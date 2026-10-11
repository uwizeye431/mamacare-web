import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as SymptomsModel from './symptoms.model';
import { analyzeSymptoms } from '../../triage';

// Open to everyone; logged-in users also get the result saved to their history
export const logSymptom = async (req: AuthRequest, res: Response) => {
  try {
    const symptoms = typeof req.body.symptoms === 'string' ? req.body.symptoms.trim() : '';
    const userId = req.user?.userId;

    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms description is required' });
    }

    if (symptoms.length > 2000) {
      return res.status(400).json({ error: 'Please keep the description under 2000 characters.' });
    }

    // Safety rules (WHO danger signs, self-harm, emergencies) first, then the trained model
    const language = req.body.language === 'rw' ? 'rw' : 'en';
    const analysis = analyzeSymptoms(symptoms, language);
    const flagged = analysis.triage === 'red';

    const profile = userId ? await SymptomsModel.getOrCreatePregnancyProfile(userId) : undefined;
    if (!profile) {
      // Guest (or deleted account): return the result without saving it
      return res.status(200).json({
        log: {
          id: null,
          symptoms,
          triage_level: analysis.triage,
          ai_analysis: analysis,
          flagged,
          created_at: new Date().toISOString(),
        },
        saved: false,
      });
    }

    const newLog = await SymptomsModel.createSymptomLog(profile.id, symptoms, analysis.triage, analysis, flagged);
    return res.status(201).json({ log: newLog, saved: true });
  } catch (error) {
    console.error('Log symptom error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const profile = await SymptomsModel.getPregnancyProfileByUserId(userId);
    if (!profile) {
      // No profile yet means nothing has been logged
      return res.status(200).json({ logs: [] });
    }

    const logs = await SymptomsModel.getSymptomLogsByProfileId(profile.id);
    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
