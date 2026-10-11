// A small text classifier trained on the examples in intents.ts.
//
// Features: words, word pairs, and character trigrams (the trigrams make it tolerant of
// typos and of Kinyarwanda word forms). Model: multinomial logistic regression (softmax),
// trained with full-batch gradient descent. Training is deterministic and takes well under
// a second, so the server simply trains at startup.

export interface LabeledExample {
  text: string;
  label: number;
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'i', 'im', 'am', 'is', 'are', 'was', 'be', 'it', 'its',
  'my', 'me', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'this', 'that', 'so', 'do',
  'have', 'has', 'had', 'been', 'just', 'very', 'really', 'some', 'since', 'today',
]);

export const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const tokenize = (text: string): string[] =>
  normalize(text)
    .split(' ')
    .filter((t) => t.length > 0 && !STOPWORDS.has(t));

const extractFeatures = (text: string): string[] => {
  const tokens = tokenize(text);
  const features = new Set<string>();

  tokens.forEach((token, i) => {
    features.add(`w:${token}`);
    if (i > 0) features.add(`b:${tokens[i - 1]}_${token}`);

    const padded = `^${token}$`;
    for (let j = 0; j + 3 <= padded.length; j++) {
      features.add(`c:${padded.slice(j, j + 3)}`);
    }
  });

  return [...features];
};

export interface TrainOptions {
  epochs?: number;
  learningRate?: number;
  l2?: number;
}

export class IntentClassifier {
  private vocab = new Map<string, number>();
  private weights: Float64Array[] = []; // [class][feature]
  private bias: Float64Array = new Float64Array(0);

  constructor(private readonly numClasses: number) {}

  // Sparse, L2-normalised binary feature vector: only indices of known features
  private vectorize(text: string): { indices: number[]; value: number } {
    const indices = extractFeatures(text)
      .map((f) => this.vocab.get(f))
      .filter((i): i is number => i !== undefined);
    return { indices, value: indices.length ? 1 / Math.sqrt(indices.length) : 0 };
  }

  train(examples: LabeledExample[], { epochs = 300, learningRate = 20, l2 = 1e-4 }: TrainOptions = {}) {
    this.vocab.clear();
    for (const ex of examples) {
      for (const f of extractFeatures(ex.text)) {
        if (!this.vocab.has(f)) this.vocab.set(f, this.vocab.size);
      }
    }

    const dim = this.vocab.size;
    this.weights = Array.from({ length: this.numClasses }, () => new Float64Array(dim));
    this.bias = new Float64Array(this.numClasses);
    const vectors = examples.map((ex) => this.vectorize(ex.text));
    const n = examples.length;

    for (let epoch = 0; epoch < epochs; epoch++) {
      const gradW = Array.from({ length: this.numClasses }, () => new Float64Array(dim));
      const gradB = new Float64Array(this.numClasses);

      vectors.forEach((vec, idx) => {
        const probs = this.probabilitiesFor(vec);
        for (let c = 0; c < this.numClasses; c++) {
          const err = probs[c] - (examples[idx].label === c ? 1 : 0);
          gradB[c] += err;
          for (const f of vec.indices) gradW[c][f] += err * vec.value;
        }
      });

      for (let c = 0; c < this.numClasses; c++) {
        const w = this.weights[c];
        const g = gradW[c];
        for (let f = 0; f < dim; f++) {
          w[f] -= learningRate * (g[f] / n + l2 * w[f]);
        }
        this.bias[c] -= learningRate * (gradB[c] / n);
      }
    }
  }

  private probabilitiesFor(vec: { indices: number[]; value: number }): number[] {
    const logits = new Array<number>(this.numClasses);
    for (let c = 0; c < this.numClasses; c++) {
      let z = this.bias[c];
      for (const f of vec.indices) z += this.weights[c][f] * vec.value;
      logits[c] = z;
    }
    const max = Math.max(...logits);
    const exps = logits.map((z) => Math.exp(z - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  }

  /** Probability for each class, plus how many of the input's features the model knows. */
  predict(text: string): { probabilities: number[]; knownFeatures: number } {
    const vec = this.vectorize(text);
    return { probabilities: this.probabilitiesFor(vec), knownFeatures: vec.indices.length };
  }
}
