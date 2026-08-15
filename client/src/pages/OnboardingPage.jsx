import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, ArrowLeft, GraduationCap, Briefcase, Zap, Compass, AlertCircle } from 'lucide-react';
import { Input, Select, Textarea } from '../components/Input';
import { Button } from '../components/Button';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const availableSkillsList = [
  { name: 'JavaScript', category: 'Programming' },
  { name: 'Python', category: 'Programming' },
  { name: 'React', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'SQL', category: 'Database' },
  { name: 'PyTorch', category: 'AI/ML' },
  { name: 'Machine Learning', category: 'AI/ML' },
  { name: 'Docker', category: 'Tools' },
  { name: 'Git', category: 'Tools' },
];

const availableRoles = [
  'AI Engineer',
  'ML Engineer',
  'Data Scientist',
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
  'Software Engineer',
];

export const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [headline, setHeadline] = useState('Aspiring Software Engineer');
  const [degree, setDegree] = useState('Bachelor of Technology in Computer Science');
  const [college, setCollege] = useState('');
  const [gradYear, setGradYear] = useState('2025');
  const [preferredDomain, setPreferredDomain] = useState('Software Development');
  const [selectedRoles, setSelectedRoles] = useState(['Full Stack Developer']);
  const [experienceLevel, setExperienceLevel] = useState('Entry Level / Student');
  const [careerGoals, setCareerGoals] = useState('Build high-performance web applications and production AI models.');
  const [selectedSkills, setSelectedSkills] = useState(['JavaScript', 'React', 'Node.js', 'Git']);

  const { completeOnboardingState } = useAuth();
  const navigate = useNavigate();

  const toggleRole = (role) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const toggleSkill = (skillName) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        headline,
        education: { degree, college, graduationYear: gradYear },
        preferredDomain,
        targetRoles: selectedRoles,
        experienceLevel,
        careerGoals,
        initialSkills: selectedSkills,
      };

      const res = await API.post('/profile/onboarding', payload);
      if (res.data.success) {
        completeOnboardingState(res.data.data.profile, res.data.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Onboarding submit error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to submit profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-nexus-500 selection:text-white">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Header Step Indicator */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-nexus-600/20 border border-nexus-500/30 flex items-center justify-center text-nexus-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Setup Your Nexus Profile</h2>
              <p className="text-xs text-slate-400">Step {step} of 3 — Tailoring Your Intelligence Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-2 rounded-full transition-all ${
                  s === step ? 'bg-nexus-500 w-10' : s < step ? 'bg-indigo-600/60' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-semibold text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: EDUCATION & BACKGROUND */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <GraduationCap className="w-4 h-4 text-nexus-400" />
              <span>Education & Professional Background</span>
            </div>

            <Input
              label="Professional Headline"
              placeholder="e.g. AI Engineer | Full Stack Developer"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Degree / Program"
                placeholder="e.g. B.Tech Computer Science"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
              <Input
                label="College / University"
                placeholder="e.g. Apex Institute of Technology"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Graduation Year"
                placeholder="e.g. 2025"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
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
            </div>
          </div>
        )}

        {/* STEP 2: TARGET ROLES & DOMAIN */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Compass className="w-4 h-4 text-nexus-400" />
              <span>Select Target Roles & Career Domain</span>
            </div>

            <Select
              label="Preferred Tech Domain"
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              options={[
                'Artificial Intelligence & Full Stack Web',
                'Software Development & Cloud',
                'Data Science & Analytics',
                'Frontend Engineering & UX',
                'Backend Systems Engineering'
              ]}
            />

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Target Roles (Select at least one)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableRoles.map((role) => {
                  const active = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                        active
                          ? 'bg-nexus-600/20 border-nexus-500 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{role}</span>
                      {active && <Check className="w-3.5 h-3.5 text-nexus-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Textarea
              label="Career Vision & Aspirations"
              placeholder="What kind of projects or tech impact do you want to achieve?"
              rows={3}
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
            />
          </div>
        )}

        {/* STEP 3: SKILL SELECTION */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Zap className="w-4 h-4 text-nexus-400" />
                <span>Select Your Current Skills Inventory</span>
              </div>
              <span className="text-xs text-nexus-400 font-semibold">{selectedSkills.length} Selected</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
              {availableSkillsList.map((skill) => {
                const active = selectedSkills.includes(skill.name);
                return (
                  <button
                    key={skill.name}
                    type="button"
                    onClick={() => toggleSkill(skill.name)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      active
                        ? 'bg-nexus-600/20 border-nexus-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-semibold">{skill.name}</span>
                      {active && <Check className="w-3.5 h-3.5 text-nexus-400" />}
                    </div>
                    <span className="text-[10px] text-slate-500">{skill.category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          {step > 1 ? (
            <Button variant="secondary" onClick={() => setStep(step - 1)} icon={ArrowLeft}>
              Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)} icon={ArrowRight}>
              Next Step
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} loading={loading} icon={Sparkles}>
              Build My Nexus Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
