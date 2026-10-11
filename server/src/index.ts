import './instrument'; // must be first: starts error monitoring before Express loads
import app from './app';
import { warmUpTriageModel } from './triage';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Train after the server is up so startup (and health checks) aren't delayed
  setImmediate(warmUpTriageModel);
});
