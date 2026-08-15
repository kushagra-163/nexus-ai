import mongoose from 'mongoose';

const roadmapItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Skill' },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  resources: [{ type: String }],
});

const roadmapPhaseSchema = new mongoose.Schema({
  phaseNumber: { type: Number, required: true },
  phaseTitle: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  items: [roadmapItemSchema],
});

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetRole: {
    type: String,
    required: true,
  },
  totalMilestones: {
    type: Number,
    default: 0,
  },
  completedMilestones: {
    type: Number,
    default: 0,
  },
  phases: [roadmapPhaseSchema],
}, {
  timestamps: true,
});

export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
