import dotenv from 'dotenv';
import path from 'path';

// Loads server/.env once; every module that needs env vars imports this file first.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Fail fast on missing or weak secrets instead of silently running insecurely.
// (A weak JWT secret lets anyone forge a login token for any account.)
const MIN_SECRET_LENGTH = 32;

const problems: string[] = [];

if (!process.env.DATABASE_URL) {
  problems.push('DATABASE_URL is not set.');
}

for (const key of ['JWT_SECRET', 'JWT_REFRESH_SECRET']) {
  const value = process.env[key] ?? '';
  if (value.length < MIN_SECRET_LENGTH) {
    problems.push(`${key} must be set to a random string of at least ${MIN_SECRET_LENGTH} characters.`);
  } else if (/change|fallback|secret|example/i.test(value)) {
    problems.push(`${key} looks like a placeholder; set it to a random value.`);
  }
}

if (process.env.JWT_SECRET && process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
  problems.push('JWT_SECRET and JWT_REFRESH_SECRET must be different.');
}

if (problems.length) {
  console.error(
    [
      'Server configuration error:',
      ...problems.map((p) => `  - ${p}`),
      'Generate a secret with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"',
    ].join('\n')
  );
  process.exit(1);
}
