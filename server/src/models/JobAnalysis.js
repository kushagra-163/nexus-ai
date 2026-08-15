import mongoose from 'mongoose';

const jobAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    default: 'Target Company',
  },
  jobDescriptionText: {
    type: String,
    required: true,
  },
  matchScore: {
    type: Number,
    required: true,
  },
  matchingSkills: [{ type: String }],
  partialMatches: [{ type: String }],
  missingSkills: [{ type: String }],
  experienceGaps: [{ type: String }],
  recommendations: [{ type: String }],
}, {
  timestamps: true,
});

export const JobAnalysis = mongoose.model('JobAnalysis', jobAnalysisSchema);
