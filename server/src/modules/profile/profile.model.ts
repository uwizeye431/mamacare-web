import { query } from '../../db/client';

export interface PregnancyProfile {
  id: string;
  user_id: string;
  lmp: string | null;
  edd: string | null;
  gravida: number | null;
  para: number | null;
  conditions: string[] | null;
  facility_id: string | null;
  active: boolean;
  created_at: string;
}

export const getProfileByUserId = async (userId: string): Promise<PregnancyProfile | null> => {
  const res = await query(
    `SELECT id, user_id, lmp, edd, gravida, para, conditions, facility_id, active, created_at
     FROM pregnancy_profiles
     WHERE user_id = $1 AND active = true
     LIMIT 1`,
    [userId]
  );
  return res.rows[0] || null;
};

export const createOrUpdateProfile = async (
  userId: string,
  lmp: string | null,
  edd: string | null,
  gravida: number | null,
  para: number | null,
  conditions: string[],
  facilityId: string | null
): Promise<PregnancyProfile> => {
  // Check if active profile exists
  const existing = await getProfileByUserId(userId);

  if (existing) {
    // Update existing active profile
    const res = await query(
      `UPDATE pregnancy_profiles
       SET lmp = $1, edd = $2, gravida = $3, para = $4, conditions = $5, facility_id = $6
       WHERE id = $7
       RETURNING id, user_id, lmp, edd, gravida, para, conditions, facility_id, active, created_at`,
      [lmp, edd, gravida, para, conditions, facilityId, existing.id]
    );
    return res.rows[0];
  } else {
    // Create new profile
    const res = await query(
      `INSERT INTO pregnancy_profiles (user_id, lmp, edd, gravida, para, conditions, facility_id, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING id, user_id, lmp, edd, gravida, para, conditions, facility_id, active, created_at`,
      [userId, lmp, edd, gravida, para, conditions, facilityId]
    );
    return res.rows[0];
  }
};
