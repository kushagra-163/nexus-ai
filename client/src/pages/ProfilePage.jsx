import React, { useState, useEffect } from 'react';
import { User, Save, GraduationCap, Briefcase, Target, CheckCircle2, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card, ProgressBar } from '../components/Card';
import { Input, Select, Textarea } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export const ProfilePage = () => {
  const { profile, updateProfileState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [headline, setHeadline] = useState('');
  const [degree, setDegree] = useState('');
  const [college, setCollege] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('Software Development');
  const [experienceLevel, setExperienceLevel] = useState('Entry Level / Student');
  const [targetRoles, setTargetRoles] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (profile) {
      setHeadline(profile.headline || '');
      setDegree(profile.education?.degree || '');
      setCollege(profile.education?.college || '');
      setGradYear(profile.education?.graduationYear || '');
      setPreferredDomain(profile.preferredDomain || 'Software Development');
      setExperienceLevel(profile.experienceLevel || 'Entry Level / Student');
      setTargetRoles(profile.targetRoles ? profile.targetRoles.join(', ') : '');
      setCareerGoals(profile.careerGoals || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const rolesArray = targetRoles.split(',').map(r => r.trim()).filter(Boolean);

      const payload = {
        headline,
        education: { degree, college, graduationYear: gradYear },
        preferredDomain,
        experienceLevel,
        targetRoles: rolesArray,
        careerGoals,
        bio,
      };

      const res = await API.put('/profile', payload);
      if (res.data.success) {
        updateProfileState(res.data.data);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        subtitle="Manage your education, experience, and target role intelligence"
        actionText="Save Changes"
        onAction={handleSave}
        actionIcon={Save}
      />

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* COMPLETENESS METER */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-nexus-600/20 text-nexus-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Profile Completeness</h3>
              <p className="text-xs text-slate-400">Complete all fields to maximize AI recommendation accuracy</p>
            </div>
          </div>
          <span className="text-xl font-extrabold text-white">{profile?.profileCompleteness || 70}%</span>
        </div>
        <ProgressBar progress={profile?.profileCompleteness || 70} />
      </Card>

      {/* EDIT PROFILE FORM */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-nexus-400" />
            <span>General Information</span>
          </h3>

          <Input
            label="Professional Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />

          <Select
            label="Preferred Domain"
            value={preferredDomain}
            onChange={(e) => setPreferredDomain(e.target.value)}
            options={[
              'Software Development',
              'Artificial Intelligence & Full Stack Web',
              'Data Science & Analytics',
              'Frontend Engineering & UX',
              'Backend Systems Engineering'
            ]}
          />

          <Select
            label="Experience Level"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            options={[
              'Entry Level / Student',
              'Junior (1-2 yrs)',
              'Mid Level (3-5 yrs)',
              'Senior (5+ yrs)'
            ]}
          />

          <Input
            label="Target Roles (comma separated)"
            value={targetRoles}
            onChange={(e) => setTargetRoles(e.target.value)}
            placeholder="AI Engineer, Full Stack Developer, Data Scientist"
          />
        </Card>

        <Card className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <GraduationCap className="w-4 h-4 text-nexus-400" />
            <span>Education & Vision</span>
          </h3>

          <Input
            label="Degree / Program"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="College / Institution"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
            <Input
              label="Graduation Year"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
            />
          </div>

          <Textarea
            label="Career Goals & Aspirations"
            rows={3}
            value={careerGoals}
            onChange={(e) => setCareerGoals(e.target.value)}
          />
        </Card>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" variant="primary" loading={loading} icon={Save}>
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
