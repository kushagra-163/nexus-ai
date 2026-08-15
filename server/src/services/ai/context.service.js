import { Profile } from '../../models/Profile.js';
import { Skill } from '../../models/Skill.js';
import { Project } from '../../models/Project.js';
import { Resume } from '../../models/Resume.js';
import { CareerGoal } from '../../models/CareerGoal.js';

export const buildUserAIContext = async (userId) => {
  try {
    const [profile, skills, projects, resume, careerGoal] = await Promise.all([
      Profile.findOne({ user: userId }).lean(),
      Skill.find({ user: userId }).lean(),
      Project.find({ user: userId }).lean(),
      Resume.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
      CareerGoal.findOne({ user: userId }).lean(),
    ]);

    return {
      profile: profile ? {
        headline: profile.headline,
        education: profile.education,
        preferredDomain: profile.preferredDomain,
        targetRoles: profile.targetRoles,
        experienceLevel: profile.experienceLevel,
        careerGoals: profile.careerGoals,
        readinessScore: profile.readinessScore,
      } : {},
      skills: skills ? skills.map(s => `${s.name} (${s.category} - ${s.proficiency})`) : [],
      projects: projects ? projects.map(p => ({
        title: p.title,
        description: p.description,
        techStack: p.technologies,
        status: p.status,
      })) : [],
      latestResumeScore: resume ? resume.score : null,
      resumeStrengths: resume ? resume.strengths : [],
      resumeWeaknesses: resume ? resume.weaknesses : [],
      careerGoal: careerGoal ? {
        targetRole: careerGoal.targetRole,
        timelineMonths: careerGoal.timelineMonths,
      } : null,
    };
  } catch (error) {
    console.error('Error building user AI context:', error.message);
    return {};
  }
};
