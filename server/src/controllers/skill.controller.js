import { Skill } from '../models/Skill.js';
import { Profile } from '../models/Profile.js';
import { Activity } from '../models/Activity.js';

export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ user: req.user._id }).sort({ category: 1, name: 1 });
    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const addSkill = async (req, res, next) => {
  try {
    const { name, category, proficiency } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const skill = await Skill.create({
      user: req.user._id,
      name,
      category: category || 'Programming',
      proficiency: proficiency || 'Intermediate',
    });

    await Activity.create({
      user: req.user._id,
      activityType: 'SKILL_ADDED',
      title: `Added Skill: ${name}`,
      description: `Proficiency set to ${proficiency || 'Intermediate'} under ${category || 'Programming'}.`,
    });

    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { name, category, proficiency } = req.body;
    let skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    if (name) skill.name = name;
    if (category) skill.category = category;
    if (proficiency) skill.proficiency = proficiency;

    await skill.save();

    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.json({
      success: true,
      message: 'Skill removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillGapAnalysis = async (req, res, next) => {
  try {
    const targetRole = req.query.role || 'AI Engineer';
    const userSkills = await Skill.find({ user: req.user._id });

    const roleRequirementMap = {
      'AI Engineer': ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Docker', 'System Design', 'SQL', 'REST APIs'],
      'ML Engineer': ['Python', 'Scikit-Learn', 'TensorFlow', 'MLOps', 'Feature Engineering', 'Docker', 'SQL'],
      'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'TypeScript', 'Docker', 'CSS/Tailwind'],
      'Data Scientist': ['Python', 'SQL', 'Pandas', 'NumPy', 'Statistics', 'Data Visualization', 'Machine Learning'],
      'Backend Developer': ['Node.js', 'Express', 'SQL', 'MongoDB', 'Redis', 'Docker', 'System Design', 'REST APIs'],
      'Frontend Developer': ['JavaScript', 'React', 'HTML', 'CSS/Tailwind', 'TypeScript', 'State Management', 'Web Performance'],
      'Software Engineer': ['Data Structures', 'Algorithms', 'JavaScript', 'Python', 'SQL', 'System Design', 'Git']
    };

    const required = roleRequirementMap[targetRole] || roleRequirementMap['Software Engineer'];
    const currentSkillNames = userSkills.map(s => s.name.toLowerCase());

    const currentMatched = [];
    const missingHighPriority = [];

    required.forEach(reqSkill => {
      if (currentSkillNames.some(cs => cs.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs))) {
        currentMatched.push(reqSkill);
      } else {
        missingHighPriority.push(reqSkill);
      }
    });

    const gapPercentage = Math.round((currentMatched.length / required.length) * 100);

    res.json({
      success: true,
      data: {
        targetRole,
        readinessScore: gapPercentage,
        requiredSkills: required,
        currentSkills: currentMatched,
        missingSkills: missingHighPriority,
      },
    });
  } catch (error) {
    next(error);
  }
};
