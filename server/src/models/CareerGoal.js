import mongoose from 'mongoose';

const careerGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetRole: {
    type: String,
    required: true,
  },
  timelineMonths: {
    type: Number,
    default: 6,
  },
  targetDomain: {
    type: String,
    default: 'Software Development',
  },
  currentReadiness: {
    type: Number,
    default: 70,
  },
  stages: [{
    stageNumber: Number,
    title: String,
    focusArea: String,
    skillsToAcquire: [String],
    suggestedProjects: [String],
  }],
}, {
  timestamps: true,
});

export const CareerGoal = mongoose.model('CareerGoal', careerGoalSchema);
