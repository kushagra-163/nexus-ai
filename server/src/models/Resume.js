import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalFilename: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    default: 75,
  },
  atsCompatibility: {
    type: String,
    enum: ['High', 'Moderate', 'Needs Work'],
    default: 'Moderate',
  },
  detectedSkills: [{
    type: String,
  }],
  missingKeywords: [{
    type: String,
  }],
  strengths: [{
    type: String,
  }],
  weaknesses: [{
    type: String,
  }],
  recommendations: [{
    type: String,
  }],
  roleCompatibility: {
    role: String,
    matchPercentage: Number,
  },
}, {
  timestamps: true,
});

export const Resume = mongoose.model('Resume', resumeSchema);
