import { Profile } from '../models/Profile.js';
import { Skill } from '../models/Skill.js';
import { Resume } from '../models/Resume.js';
import { Project } from '../models/Project.js';
import { Roadmap } from '../models/Roadmap.js';
import { Activity } from '../models/Activity.js';
import { JobAnalysis } from '../models/JobAnalysis.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [profile, skills, projects, latestResume, roadmap, activities, jobMatches] = await Promise.all([
      Profile.findOne({ user: userId }),
      Skill.find({ user: userId }),
      Project.find({ user: userId }),
      Resume.findOne({ user: userId }).sort({ createdAt: -1 }),
      Roadmap.findOne({ user: userId }),
      Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(6),
      JobAnalysis.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
    ]);

    // Skill distribution by category
    const categoryCounts = {};
    skills.forEach(skill => {
      categoryCounts[skill.category] = (categoryCounts[skill.category] || 0) + 1;
    });

    const skillDistribution = Object.keys(categoryCounts).map(cat => ({
      category: cat,
      count: categoryCounts[cat],
    }));

    // Calculate skill strength average
    const profMap = { 'Beginner': 40, 'Intermediate': 75, 'Advanced': 95 };
    const avgSkillScore = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + (profMap[s.proficiency] || 70), 0) / skills.length)
      : 60;

    res.json({
      success: true,
      data: {
        metrics: {
          readinessScore: profile?.readinessScore || 72,
          skillStrength: avgSkillScore,
          resumeScore: latestResume?.score || 76,
          profileCompleteness: profile?.profileCompleteness || 70,
          totalSkills: skills.length,
          totalProjects: projects.length,
          completedMilestones: roadmap?.completedMilestones || 0,
          totalMilestones: roadmap?.totalMilestones || 12,
        },
        skillDistribution,
        recentActivities: activities,
        jobMatches,
        targetRole: profile?.targetRoles?.[0] || 'Full Stack Developer',
        aiRecommendation: {
          title: 'Strengthen Microservices & Containerization',
          description: `Mastering Docker and Redis will boost your readiness score for ${profile?.targetRoles?.[0] || 'Software Engineering'} roles by +14%.`,
          actionLink: '/skills',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
