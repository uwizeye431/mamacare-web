import { query } from '../../db/client';

export const getPregnancyProfileByUserId = async (userId: string) => {
  const res = await query(
    'SELECT id FROM pregnancy_profiles WHERE user_id = $1 LIMIT 1',
    [userId]
  );
  return res.rows[0];
};

export const createSymptomLog = async (
  profileId: string,
  symptoms: string,
  triageLevel: 'red' | 'yellow' | 'green',
  aiAnalysis: any,
  flagged: boolean = false
) => {
  // Using correct database columns: description, ai_response, visit_flagged
  const res = await query(
    `INSERT INTO symptom_logs (profile_id, description, triage_level, ai_response, visit_flagged)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, profile_id, description as symptoms, triage_level, ai_response as ai_analysis, visit_flagged as flagged, created_at`,
    [profileId, symptoms, triageLevel, JSON.stringify(aiAnalysis), flagged]
  );
  return res.rows[0];
};

export const getSymptomLogsByProfileId = async (profileId: string) => {
  const res = await query(
    `SELECT id, profile_id, description as symptoms, triage_level, ai_response as ai_analysis, visit_flagged as flagged, created_at 
     FROM symptom_logs WHERE profile_id = $1 ORDER BY created_at DESC`,
    [profileId]
  );
  return res.rows;
};
