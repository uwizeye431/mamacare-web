import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as ProfileModel from './profile.model';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const profile = await ProfileModel.getProfileByUserId(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Pregnancy profile not found' });
    }

    // Dynamic calculations
    let gestationalWeeks = 0;
    let gestationalDays = 0;
    let daysToDelivery = 0;

    if (profile.lmp) {
      const lmpDate = new Date(profile.lmp);
      const today = new Date();
      const diffTime = today.getTime() - lmpDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0) {
        gestationalWeeks = Math.floor(diffDays / 7);
        gestationalDays = diffDays % 7;
      }
    }

    if (profile.edd) {
      const eddDate = new Date(profile.edd);
      const today = new Date();
      const diffTime = eddDate.getTime() - today.getTime();
      daysToDelivery = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    return res.status(200).json({
      profile,
      calculations: {
        gestationalWeeks,
        gestationalDays,
        daysToDelivery,
        progressPercentage: Math.min(100, Math.max(0, Math.round(((280 - daysToDelivery) / 280) * 100)))
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const saveProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { lmp, gravida, para, conditions, facility_id } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!lmp) {
      return res.status(400).json({ error: 'Last Menstrual Period (LMP) is required' });
    }

    // Automatically compute EDD: LMP + 280 days (40 weeks)
    const lmpDate = new Date(lmp);
    if (isNaN(lmpDate.getTime())) {
      return res.status(400).json({ error: 'Invalid LMP date format' });
    }

    const eddDate = new Date(lmpDate.getTime());
    eddDate.setDate(eddDate.getDate() + 280);
    const edd = eddDate.toISOString().split('T')[0];

    const profile = await ProfileModel.createOrUpdateProfile(
      userId,
      lmp,
      edd,
      gravida ? parseInt(gravida, 10) : null,
      para ? parseInt(para, 10) : null,
      conditions || [],
      facility_id || null
    );

    return res.status(200).json({
      message: 'Pregnancy profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Save profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
