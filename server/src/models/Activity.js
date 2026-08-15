import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activityType: {
    type: String,
    enum: ['RESUME_ANALYZED', 'SKILL_ADDED', 'ROADMAP_UPDATED', 'JOB_MATCHED', 'PROJECT_ADDED', 'CHAT_SESSION', 'PROFILE_UPDATED'],
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
}, {
  timestamps: true,
});

export const Activity = mongoose.model('Activity', activitySchema);
