import { query } from '../../db/client';

export interface ANCVisit {
  id: string;
  profile_id: string;
  scheduled_date: string | null;
  actual_date: string | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  weight_kg: number | null;
  fundal_height_cm: number | null;
  fetal_heart_rate: number | null;
  urine_protein: string | null;
  urine_glucose: string | null;
  provider_notes: string | null;
  created_at: string;
}

export const getVisitsByProfileId = async (profileId: string): Promise<ANCVisit[]> => {
  const res = await query(
    `SELECT id, profile_id, scheduled_date, actual_date, bp_systolic, bp_diastolic, 
            weight_kg, fundal_height_cm, fetal_heart_rate, urine_protein, urine_glucose, 
            provider_notes, created_at
     FROM anc_visits
     WHERE profile_id = $1
     ORDER BY scheduled_date ASC, created_at ASC`,
    [profileId]
  );
  return res.rows;
};

export const createVisit = async (
  profileId: string,
  scheduledDate: string | null,
  actualDate: string | null,
  bpSystolic: number | null,
  bpDiastolic: number | null,
  weightKg: number | null,
  fundalHeightCm: number | null,
  fetalHeartRate: number | null,
  urineProtein: string | null,
  urineGlucose: string | null,
  providerNotes: string | null
): Promise<ANCVisit> => {
  const res = await query(
    `INSERT INTO anc_visits (
      profile_id, scheduled_date, actual_date, bp_systolic, bp_diastolic, 
      weight_kg, fundal_height_cm, fetal_heart_rate, urine_protein, urine_glucose, provider_notes
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id, profile_id, scheduled_date, actual_date, bp_systolic, bp_diastolic, 
               weight_kg, fundal_height_cm, fetal_heart_rate, urine_protein, urine_glucose, 
               provider_notes, created_at`,
    [
      profileId, scheduledDate, actualDate, bpSystolic, bpDiastolic,
      weightKg, fundalHeightCm, fetalHeartRate, urineProtein, urineGlucose, providerNotes
    ]
  );
  return res.rows[0];
};
