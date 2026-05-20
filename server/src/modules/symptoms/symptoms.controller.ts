import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as SymptomsModel from './symptoms.model';
import { checkWHODangerSignals } from '../../utils/dangerSignals';
import { analyzeSymptomsWithClaude } from '../../utils/claude';

export const logSymptom = async (req: AuthRequest, res: Response) => {
  try {
    const { symptoms } = req.body;
    const userId = req.user?.userId;

    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms description is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // 1. Fetch pregnancy profile
    const profile = await SymptomsModel.getPregnancyProfileByUserId(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Pregnancy profile not found. Please setup profile first.' });
    }

    // 2. Perform WHO Danger Signal Override Check (Dual-layer)
    const dangerMatch = checkWHODangerSignals(symptoms);
    
    let triageLevel: 'red' | 'yellow' | 'green' = 'green';
    let aiAnalysis: any = {};
    let flagged = false;

    if (dangerMatch.isCritical) {
      triageLevel = 'red';
      flagged = true;
      aiAnalysis = {
        triage: 'red',
        explanation: `CRITICAL WHO DANGER SIGNAL TRIGGERED: Immediate referral is required due to suspected ${dangerMatch.signalName}.`,
        actions: [
          'Go immediately to the nearest hospital or emergency facility.',
          'Call your midwife or emergency care provider.',
          'Inform your Community Health Worker (CHW) immediately.'
        ],
        override: true,
        matchedSignal: dangerMatch.signalName,
        matchedKeyword: dangerMatch.matchedKeyword
      };
    } else {
      // 3. Send to Anthropic Claude 3.5 Sonnet if no override triggers
      const claudeResult = await analyzeSymptomsWithClaude(symptoms);
      triageLevel = claudeResult.triage;
      flagged = triageLevel === 'red';
      aiAnalysis = {
        triage: triageLevel,
        explanation: claudeResult.explanation,
        actions: claudeResult.actions,
        override: false
      };
    }

    // 4. Save log in PostgreSQL database with correct mapped schema columns
    const newLog = await SymptomsModel.createSymptomLog(
      profile.id,
      symptoms,
      triageLevel,
      aiAnalysis,
      flagged
    );

    return res.status(201).json({ log: newLog });
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
      return res.status(404).json({ error: 'Pregnancy profile not found' });
    }

    const logs = await SymptomsModel.getSymptomLogsByProfileId(profile.id);
    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
