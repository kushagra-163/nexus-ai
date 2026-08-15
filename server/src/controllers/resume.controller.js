import fs from 'fs';
import pdfParse from 'pdf-parse';
import { Resume } from '../models/Resume.js';
import { Activity } from '../models/Activity.js';
import { Profile } from '../models/Profile.js';
import { generateAIResponse, fallbackResumeAnalysis } from '../services/ai/ai.service.js';
import { getResumeAnalysisPrompt } from '../services/ai/prompt.service.js';

export const uploadAndAnalyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or text resume file' });
    }

    let extractedText = '';

    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const parsed = await pdfParse(dataBuffer);
      extractedText = parsed.text;
    } else {
      extractedText = fs.readFileSync(req.file.path, 'utf8');
    }

    const profile = await Profile.findOne({ user: req.user._id });
    const targetRole = (profile && profile.targetRoles && profile.targetRoles[0]) || 'Software Engineer';

    const prompt = getResumeAnalysisPrompt(extractedText, targetRole);

    const aiAnalysis = await generateAIResponse(
      prompt,
      () => fallbackResumeAnalysis(extractedText, targetRole)
    );

    const resumeDoc = await Resume.create({
      user: req.user._id,
      originalFilename: req.file.originalname,
      extractedText: extractedText.substring(0, 5000),
      score: aiAnalysis.score || 76,
      atsCompatibility: aiAnalysis.atsCompatibility || 'Moderate',
      detectedSkills: aiAnalysis.detectedSkills || [],
      missingKeywords: aiAnalysis.missingKeywords || [],
      strengths: aiAnalysis.strengths || [],
      weaknesses: aiAnalysis.weaknesses || [],
      recommendations: aiAnalysis.recommendations || [],
      roleCompatibility: {
        role: targetRole,
        matchPercentage: aiAnalysis.roleMatchPercentage || 80,
      },
    });

    await Activity.create({
      user: req.user._id,
      activityType: 'RESUME_ANALYZED',
      title: 'Resume Analyzed by Nexus AI',
      description: `Resume score: ${resumeDoc.score}/100 with ${resumeDoc.atsCompatibility} ATS rating.`,
    });

    // Cleanup local temp file safely
    try {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn('Could not delete upload temp file:', e.message);
    }

    res.status(201).json({
      success: true,
      data: resumeDoc,
    });
  } catch (error) {
    next(error);
  }
};

export const getLatestResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};
