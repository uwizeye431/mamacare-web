// Shapes of the data returned by the MamaCare API, shared by the pages that display it.

export type TriageLevel = 'red' | 'yellow' | 'green';

export interface PregnancyProfile {
  id: string;
  lmp: string | null;
  edd: string | null;
  gravida: number | null;
  para: number | null;
  conditions: string[] | null;
  facility_id?: string | null;
}

// GET /api/profile/me
export interface ProfileResponse {
  profile: PregnancyProfile;
  calculations: {
    gestationalWeeks: number;
    gestationalDays: number;
    daysToDelivery: number;
    progressPercentage: number;
  };
}

// GET /api/visits
export interface AncVisit {
  id: string;
  scheduled_date: string | null;
  actual_date: string | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  weight_kg: number | string | null;
  fundal_height_cm: number | string | null;
  fetal_heart_rate: number | null;
  urine_protein?: string | null;
  provider_notes: string | null;
}

// POST /api/symptoms/log and GET /api/symptoms/history
export interface SymptomLog {
  id: string | null; // null for guest checks, which are not saved
  symptoms: string;
  triage_level: TriageLevel;
  ai_analysis: {
    triage: TriageLevel;
    explanation: string;
    actions: string[];
    override: boolean;
    matchedSignal?: string;
    intent?: string;
    confidence?: number;
  };
  flagged: boolean;
  created_at: string;
}
