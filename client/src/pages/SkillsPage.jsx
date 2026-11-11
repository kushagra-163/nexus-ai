import React, { useState, useEffect } from 'react';
import { Plus, Zap, Trash2, Edit2, Target, CheckCircle2, ShieldAlert, Search, Filter } from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card, ProgressBar } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input, Select } from '../components/Input';
import { Button } from '../components/Button';
import API from '../services/api';

export const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [gapData, setGapData] = useState(null);
  const [targetRole, setTargetRole] = useState('AI Engineer');

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal State
  const [editingSkill, setEditingSkill] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Programming');
  const [editProficiency, setEditProficiency] = useState('Intermediate');

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    fetchGapAnalysis(targetRole);
  }, [targetRole]);

  const fetchSkills = async () => {
    try {
      const res = await API.get('/skills');
      if (res.data.success) {
        setSkills(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err.message);
    }
  };

  const fetchGapAnalysis = async (role) => {
    try {
      const res = await API.get(`/skills/gap-analysis?role=${encodeURIComponent(role)}`);
      if (res.data.success) {
        setGapData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch gap analysis:', err.message);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setSubmitting(true);
    try {
      const res = await API.post('/skills', {
        name: skillName,
        category,
        proficiency,
      });
      if (res.data.success) {
        setSkills([...skills, res.data.data]);
        setSkillName('');
        setIsModalOpen(false);
        fetchGapAnalysis(targetRole);
      }
    } catch (err) {
      console.error('Failed to add skill:', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (skill) => {
    setEditingSkill(skill);
    setEditName(skill.name);
    setEditCategory(skill.category || 'Programming');
    setEditProficiency(skill.proficiency || 'Intermediate');
  };

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editingSkill) return;

    setSubmitting(true);
    try {
      const res = await API.put(`/skills/${editingSkill._id}`, {
        name: editName,
        category: editCategory,
        proficiency: editProficiency,
      });
      if (res.data.success) {
        setSkills(skills.map((s) => (s._id === editingSkill._id ? res.data.data : s)));
        setEditingSkill(null);
        fetchGapAnalysis(targetRole);
      }
    } catch (err) {
      console.error('Failed to update skill:', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await API.delete(`/skills/${id}`);
      setSkills(skills.filter((s) => s._id !== id));
      fetchGapAnalysis(targetRole);
    } catch (err) {
      console.error('Failed to delete skill:', err.message);
    }
  };

  const categories = ['Programming', 'Frontend', 'Backend', 'Database', 'AI/ML', 'Tools', 'Soft Skills'];
  const allFilterCategories = ['All', ...categories];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getProficiencyBadgeClass = (prof) => {
    switch (prof) {
      case 'Expert':
      case 'Advanced':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Intermediate':
        return 'text-nexus-400 bg-nexus-500/10 border-nexus-500/20';
      default:
        return 'text-slate-400 bg-slate-800/40 border-slate-700/50';
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Skill Intelligence & Matrix"
        subtitle="Manage your skill inventory and perform real-time gap audits against target roles"
        actionText="Add New Skill"
        onAction={() => setIsModalOpen(true)}
        actionIcon={Plus}
      />

      {/* SKILL GAP ANALYZER CARD */}
      <Card className="bg-slate-900/80 border-nexus-500/30 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-nexus-600/20 text-nexus-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Target Role Skill Gap Analyzer</h3>
              <p className="text-xs text-slate-400">Audit current readiness score for specific software positions</p>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <Select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              options={[
                'AI Engineer',
                'ML Engineer',
                'Full Stack Developer',
                'Data Scientist',
                'Backend Developer',
                'Frontend Developer',
                'Software Engineer',
              ]}
            />
          </div>
        </div>

        {gapData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {targetRole} Readiness Match
              </span>
              <span className="text-lg font-extrabold text-white">{gapData.readinessScore}%</span>
            </div>
            <ProgressBar progress={gapData.readinessScore} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matched Skills ({gapData.currentSkills?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {gapData.currentSkills?.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>High Priority Missing Skills ({gapData.missingSkills?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {gapData.missingSkills?.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-300"
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {allFilterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-nexus-600 text-white shadow-md shadow-nexus-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-nexus-500"
          />
        </div>
      </div>

      {/* SKILL MATRIX BY CATEGORY */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-nexus-400" />
            <span>
              Skill Inventory Matrix ({filteredSkills.length} of {skills.length})
            </span>
          </h3>
          {selectedCategory !== 'All' && (
            <span className="text-xs text-nexus-400">Filtering: {selectedCategory}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(selectedCategory === 'All' ? categories : [selectedCategory]).map((cat) => {
            const categorySkills = filteredSkills.filter((s) => s.category === cat);
            return (
              <Card key={cat} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">{cat}</h4>
                  <span className="text-xs text-slate-500 font-semibold">{categorySkills.length}</span>
                </div>

                <div className="space-y-2">
                  {categorySkills.length > 0 ? (
                    categorySkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors"
                      >
                        <div>
                          <span className="text-xs font-semibold text-slate-200">{skill.name}</span>
                          <span
                            className={`inline-block ml-2 text-[10px] px-1.5 py-0.2 rounded border ${getProficiencyBadgeClass(
                              skill.proficiency
                            )}`}
                          >
                            {skill.proficiency}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(skill)}
                            className="p-1 text-slate-500 hover:text-nexus-400 transition-colors"
                            title="Edit Skill"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill._id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Remove Skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-2">No skills found under {cat}.</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ADD SKILL MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Skill to Inventory">
        <form onSubmit={handleAddSkill} className="space-y-4">
          <Input
            label="Skill Name"
            placeholder="e.g. PyTorch, TypeScript, Docker"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            required
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories}
          />

          <Select
            label="Proficiency Level"
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            options={['Beginner', 'Intermediate', 'Advanced', 'Expert']}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Add Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT SKILL MODAL */}
      <Modal isOpen={Boolean(editingSkill)} onClose={() => setEditingSkill(null)} title="Edit Skill Details">
        <form onSubmit={handleUpdateSkill} className="space-y-4">
          <Input
            label="Skill Name"
            placeholder="e.g. React, Node.js"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />

          <Select
            label="Category"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            options={categories}
          />

          <Select
            label="Proficiency Level"
            value={editProficiency}
            onChange={(e) => setEditProficiency(e.target.value)}
            options={['Beginner', 'Intermediate', 'Advanced', 'Expert']}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setEditingSkill(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
