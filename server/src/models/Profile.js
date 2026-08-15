import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  headline: {
    type: String,
    default: 'Aspiring Tech Professional',
  },
  education: {
    degree: { type: String, default: '' },
    college: { type: String, default: '' },
    graduationYear: { type: String, default: '' },
  },
  preferredDomain: {
    type: String,
    default: 'Software Development',
  },
  targetRoles: [{
    type: String,
  }],
  experienceLevel: {
    type: String,
    enum: ['Entry Level / Student', 'Junior (1-2 yrs)', 'Mid Level (3-5 yrs)', 'Senior (5+ yrs)'],
    default: 'Entry Level / Student',
  },
  careerGoals: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  profileCompleteness: {
    type: Number,
    default: 20,
  },
  readinessScore: {
    type: Number,
    default: 65,
  },
}, {
  timestamps: true,
});

export const Profile = mongoose.model('Profile', profileSchema);
