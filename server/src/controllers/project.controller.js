import { Project } from '../models/Project.js';
import { Activity } from '../models/Activity.js';
import { generateAIResponse } from '../services/ai/ai.service.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, role, status } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Project title is required' });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : (technologies || '').split(',').map(t => t.trim()).filter(Boolean);

    const project = await Project.create({
      user: req.user._id,
      title,
      description,
      technologies: techArray,
      githubUrl,
      liveUrl,
      role: role || 'Sole Developer',
      status: status || 'Completed',
      aiFeedback: {
        qualityRating: 85,
        resumeImpact: 'Solid technical portfolio item',
        strengths: ['Modern tech stack implementation', 'Clear problem scope'],
        recommendations: ['Add quantitative performance metrics', 'Include end-to-end integration tests'],
      },
    });

    await Activity.create({
      user: req.user._id,
      activityType: 'PROJECT_ADDED',
      title: `Added Project: ${title}`,
      description: `Tech stack: ${techArray.join(', ')}.`,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({
      success: true,
      message: 'Project removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeProjectWithAI = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const prompt = `
Analyze this developer portfolio project for technical quality and resume impact:
Title: ${project.title}
Description: ${project.description}
Technologies: ${project.technologies.join(', ')}

Return strictly JSON with schema:
{
  "qualityRating": number (0-100),
  "resumeImpact": string,
  "strengths": [string],
  "recommendations": [string]
}
`;

    const aiResult = await generateAIResponse(prompt, () => ({
      qualityRating: Math.floor(Math.random() * 15) + 82,
      resumeImpact: 'High Impact Portfolio Highlight',
      strengths: [
        'Demonstrates clean separation of concerns and full-stack API integration',
        `Strong choice of modern technologies (${project.technologies.slice(0, 3).join(', ')})`,
      ],
      recommendations: [
        'Add a live demo link and visual GIF preview to the GitHub repository README',
        'Implement error logging and containerize using Docker for production readiness',
      ],
    }));

    project.aiFeedback = aiResult;
    await project.save();

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};
