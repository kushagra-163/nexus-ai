import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { Activity } from '../models/Activity.js';

export const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await Profile.create({ user: req.user._id });
    }

    const skillsCount = await Skill.countDocuments({ user: req.user._id });
    
    // Calculate real completeness percentage
    let score = 25;
    if (profile.education?.degree) score += 15;
    if (profile.targetRoles && profile.targetRoles.length > 0) score += 20;
    if (profile.careerGoals) score += 15;
    if (skillsCount > 0) score += 25;

    profile.profileCompleteness = Math.min(100, score);
    await profile.save();

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { headline, education, preferredDomain, targetRoles, experienceLevel, careerGoals, bio } = req.body;

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    if (headline !== undefined) profile.headline = headline;
    if (education !== undefined) profile.education = education;
    if (preferredDomain !== undefined) profile.preferredDomain = preferredDomain;
    if (targetRoles !== undefined) profile.targetRoles = targetRoles;
    if (experienceLevel !== undefined) profile.experienceLevel = experienceLevel;
    if (careerGoals !== undefined) profile.careerGoals = careerGoals;
    if (bio !== undefined) profile.bio = bio;

    await profile.save();

    await Activity.create({
      user: req.user._id,
      activityType: 'PROFILE_UPDATED',
      title: 'Updated Career Profile',
      description: 'Modified target roles and background details.',
    });

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const submitOnboarding = async (req, res, next) => {
  try {
    const { headline, education, preferredDomain, targetRoles, experienceLevel, careerGoals, initialSkills } = req.body;

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    profile.headline = headline || 'Aspiring Professional';
    profile.education = education || {};
    profile.preferredDomain = preferredDomain || 'Software Development';
    profile.targetRoles = targetRoles || ['Software Engineer'];
    profile.experienceLevel = experienceLevel || 'Entry Level / Student';
    profile.careerGoals = careerGoals || '';
    profile.profileCompleteness = 75;
    profile.readinessScore = 65;

    await profile.save();

    // Update user document to set onboardingCompleted: true
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { onboardingCompleted: true },
      { new: true }
    ).select('-password');

    // Seed selected skills if provided
    if (initialSkills && Array.isArray(initialSkills) && initialSkills.length > 0) {
      await Skill.deleteMany({ user: req.user._id });
      const skillDocs = initialSkills.map(s => ({
        user: req.user._id,
        name: typeof s === 'string' ? s : s.name,
        category: typeof s === 'object' && s.category ? s.category : 'Programming',
        proficiency: typeof s === 'object' && s.proficiency ? s.proficiency : 'Intermediate',
      }));
      await Skill.insertMany(skillDocs);
    }

    await Activity.create({
      user: req.user._id,
      activityType: 'PROFILE_UPDATED',
      title: 'Completed Onboarding',
      description: 'Built initial Nexus AI profile and skill catalog.',
    });

    res.json({
      success: true,
      data: {
        profile,
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
