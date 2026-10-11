import { API_URL } from './api';
import type { AncVisit, ProfileResponse, SymptomLog } from './types';

export type PatientDataResult =
  | { status: 'unauthorized' }
  | { status: 'ok'; profile: ProfileResponse | null; visits: AncVisit[]; logs: SymptomLog[] };

const get = (path: string) => fetch(`${API_URL}${path}`, { credentials: 'include' });

/**
 * Loads the logged-in mother's pregnancy profile, ANC visits and (optionally) symptom history.
 * Returns { status: 'unauthorized' } when the session is missing or expired, and
 * profile: null when no pregnancy profile has been set up yet. Throws on other failures.
 */
export const loadPatientData = async ({ includeLogs = false } = {}): Promise<PatientDataResult> => {
  const profileRes = await get('/api/profile/me');
  if (profileRes.status === 401) return { status: 'unauthorized' };
  if (profileRes.status === 404) return { status: 'ok', profile: null, visits: [], logs: [] };
  if (!profileRes.ok) throw new Error('Could not load your pregnancy profile. Please try again.');
  const profile = (await profileRes.json()) as ProfileResponse;

  const [visitsRes, logsRes] = await Promise.all([
    get('/api/visits'),
    includeLogs ? get('/api/symptoms/history') : Promise.resolve(null),
  ]);
  if (!visitsRes.ok || (logsRes && !logsRes.ok)) {
    throw new Error('Could not load all of your health records. Please try again.');
  }

  const visits = ((await visitsRes.json()).visits ?? []) as AncVisit[];
  const logs = logsRes ? (((await logsRes.json()).logs ?? []) as SymptomLog[]) : [];
  return { status: 'ok', profile, visits, logs };
};
