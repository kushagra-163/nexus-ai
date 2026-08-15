import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  technologies: [{
    type: String,
  }],
  githubUrl: {
    type: String,
    default: '',
  },
  liveUrl: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: 'Sole Developer',
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Planned'],
    default: 'Completed',
  },
  aiFeedback: {
    qualityRating: { type: Number, default: 80 },
    resumeImpact: { type: String, default: 'Strong technical highlight' },
    strengths: [{ type: String }],
    recommendations: [{ type: String }],
  },
}, {
  timestamps: true,
});

export const Project = mongoose.model('Project', projectSchema);
