import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Skill } from '../models/Skill.js';
import { Project } from '../models/Project.js';
import { Resume } from '../models/Resume.js';
import { CareerGoal } from '../models/CareerGoal.js';
import { Roadmap } from '../models/Roadmap.js';
import { Activity } from '../models/Activity.js';
import { fallbackRoadmap } from '../services/ai/ai.service.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexus-ai';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing demo data...');
    const demoEmail = 'demo@nexusai.com';
    const existingUser = await User.findOne({ email: demoEmail });

    if (existingUser) {
      await Promise.all([
        User.deleteOne({ _id: existingUser._id }),
        Profile.deleteMany({ user: existingUser._id }),
        Skill.deleteMany({ user: existingUser._id }),
        Project.deleteMany({ user: existingUser._id }),
        Resume.deleteMany({ user: existingUser._id }),
        CareerGoal.deleteMany({ user: existingUser._id }),
        Roadmap.deleteMany({ user: existingUser._id }),
        Activity.deleteMany({ user: existingUser._id }),
      ]);
    }

    console.log('Creating demo user (demo@nexusai.com)...');
    const user = await User.create({
      name: 'Kushagra Sharma',
      email: demoEmail,
      password: 'Password123!',
      onboardingCompleted: true,
    });

    console.log('Creating profile...');
    await Profile.create({
      user: user._id,
      headline: 'Full Stack & AI Engineer',
      education: {
        degree: 'Bachelor of Technology in Computer Science',
        college: 'Apex Institute of Technology',
        graduationYear: '2025',
      },
      preferredDomain: 'Artificial Intelligence & Full Stack Web',
      targetRoles: ['AI Engineer', 'Full Stack Developer'],
      experienceLevel: 'Entry Level / Student',
      careerGoals: 'Building scalable production AI microservices and high-performance Web apps.',
      bio: 'Passionate software architect focused on modern React applications, Node.js REST services, and generative AI integration.',
      profileCompleteness: 95,
      readinessScore: 84,
    });

    console.log('Seeding skills...');
    const skills = [
      { name: 'JavaScript', category: 'Programming', proficiency: 'Advanced' },
      { name: 'Python', category: 'Programming', proficiency: 'Advanced' },
      { name: 'React.js', category: 'Frontend', proficiency: 'Advanced' },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 'Advanced' },
      { name: 'Node.js', category: 'Backend', proficiency: 'Intermediate' },
      { name: 'Express.js', category: 'Backend', proficiency: 'Intermediate' },
      { name: 'MongoDB', category: 'Database', proficiency: 'Intermediate' },
      { name: 'PyTorch', category: 'AI/ML', proficiency: 'Intermediate' },
      { name: 'Machine Learning', category: 'AI/ML', proficiency: 'Intermediate' },
      { name: 'Git & GitHub', category: 'Tools', proficiency: 'Advanced' },
      { name: 'Docker', category: 'Tools', proficiency: 'Beginner' },
    ];
    await Skill.insertMany(skills.map(s => ({ ...s, user: user._id })));

    console.log('Seeding projects...');
    const projects = [
      {
        user: user._id,
        title: 'Nexus AI - Full Stack Platform',
        description: 'Intelligent career acceleration engine with resume ATS scoring, skill gap analysis, job matcher, and context-aware AI workspace.',
        technologies: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Google GenAI SDK'],
        githubUrl: 'https://github.com/demo/nexus-ai',
        liveUrl: 'https://nexus-ai.demo',
        role: 'Sole Architect & Developer',
        status: 'Completed',
        aiFeedback: {
          qualityRating: 94,
          resumeImpact: 'Flagship Portfolio Masterpiece',
          strengths: ['Modular AI engine architecture', 'Comprehensive REST API design', 'Polished responsive SaaS UI'],
          recommendations: ['Integrate vector search RAG for custom resume knowledge base'],
        },
      },
      {
        user: user._id,
        title: 'Neural Vision Classifier',
        description: 'Convolutional neural network for multi-class image recognition with PyTorch and FastAPI endpoint.',
        technologies: ['Python', 'PyTorch', 'FastAPI', 'NumPy', 'Docker'],
        githubUrl: 'https://github.com/demo/neural-vision',
        liveUrl: '',
        role: 'AI Engineer',
        status: 'Completed',
        aiFeedback: {
          qualityRating: 88,
          resumeImpact: 'Strong AI/ML Signal',
          strengths: ['Clear model evaluation metrics', 'Clean FastAPI integration'],
          recommendations: ['Add TensorBoard training curves to README'],
        },
      },
    ];
    await Project.insertMany(projects);

    console.log('Seeding resume analysis...');
    await Resume.create({
      user: user._id,
      originalFilename: 'Kushagra_Sharma_Software_Engineer.pdf',
      extractedText: 'Full Stack & AI Engineer with hands-on experience in React, Node.js, Express, MongoDB, Python, PyTorch, and REST API design...',
      score: 86,
      atsCompatibility: 'High',
      detectedSkills: ['JAVASCRIPT', 'REACT', 'NODE.JS', 'EXPRESS', 'MONGODB', 'PYTHON', 'PYTORCH', 'GIT', 'TAILWIND CSS'],
      missingKeywords: ['Docker Containerization', 'Kubernetes', 'CI/CD Pipelines', 'System Design'],
      strengths: [
        'Excellent technical depth across both web development and AI/ML stack',
        'Demonstrates end-to-end full-stack project building capability',
        'Clean standard resume layout with quantified project bullet points',
      ],
      weaknesses: [
        'Needs higher visibility for DevOps and cloud deployment technologies',
      ],
      recommendations: [
        'Highlight Docker and cloud deployment experience on top project listings',
        'Add a dedicated System Design section detailing scalable API design patterns',
      ],
      roleCompatibility: {
        role: 'AI Engineer',
        matchPercentage: 88,
      },
    });

    console.log('Seeding roadmap...');
    const defaultRoadmap = fallbackRoadmap('AI Engineer');
    await Roadmap.create({
      user: user._id,
      targetRole: defaultRoadmap.targetRole,
      totalMilestones: defaultRoadmap.totalMilestones,
      completedMilestones: 4,
      phases: defaultRoadmap.phases,
    });

    console.log('Seeding activities...');
    const activities = [
      { user: user._id, activityType: 'RESUME_ANALYZED', title: 'Resume ATS Analysis Completed', description: 'Scored 86/100 with High ATS Compatibility rating.' },
      { user: user._id, activityType: 'SKILL_ADDED', title: 'Added Skill: PyTorch', description: 'Categorized under AI/ML at Intermediate level.' },
      { user: user._id, activityType: 'ROADMAP_UPDATED', title: 'Milestone Completed: React State Management', description: 'Phase 1 progress updated.' },
      { user: user._id, activityType: 'PROJECT_ADDED', title: 'Created Project: Nexus AI Platform', description: 'Added flagship full-stack AI portfolio item.' },
    ];
    await Activity.insertMany(activities);

    console.log('✅ Demo Seed Data Successfully Created!');
    console.log('----------------------------------------------------');
    console.log('Demo Login Credentials:');
    console.log('Email: demo@nexusai.com');
    console.log('Password: Password123!');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
