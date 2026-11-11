import React, { useState, useEffect } from 'react';
import { Plus, FolderGit2, Code, ExternalLink, Sparkles, Trash2, Edit2, Award, CheckCircle2, Search, Filter } from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card, Badge } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input, Select, Textarea } from '../components/Input';
import { Button } from '../components/Button';
import API from '../services/api';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);

  // Search and Filter State
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Project Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [role, setRole] = useState('Sole Developer');
  const [status, setStatus] = useState('Completed');
  const [submitting, setSubmitting] = useState(false);

  // Edit Project Modal State
  const [editingProject, setEditingProject] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTechnologies, setEditTechnologies] = useState('');
  const [editGithubUrl, setEditGithubUrl] = useState('');
  const [editLiveUrl, setEditLiveUrl] = useState('');
  const [editRole, setEditRole] = useState('Sole Developer');
  const [editStatus, setEditStatus] = useState('Completed');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const res = await API.post('/projects', {
        title,
        description,
        technologies,
        githubUrl,
        liveUrl,
        role,
        status,
      });

      if (res.data.success) {
        setProjects([res.data.data, ...projects]);
        setTitle('');
        setDescription('');
        setTechnologies('');
        setGithubUrl('');
        setLiveUrl('');
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to create project:', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setEditTitle(project.title || '');
    setEditDescription(project.description || '');
    setEditTechnologies(
      Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || ''
    );
    setEditGithubUrl(project.githubUrl || '');
    setEditLiveUrl(project.liveUrl || '');
    setEditRole(project.role || 'Sole Developer');
    setEditStatus(project.status || 'Completed');
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editingProject) return;

    setUpdating(true);
    try {
      const techArray = editTechnologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await API.put(`/projects/${editingProject._id}`, {
        title: editTitle,
        description: editDescription,
        technologies: techArray,
        githubUrl: editGithubUrl,
        liveUrl: editLiveUrl,
        role: editRole,
        status: editStatus,
      });

      if (res.data.success) {
        setProjects(projects.map((p) => (p._id === editingProject._id ? res.data.data : p)));
        setEditingProject(null);
      }
    } catch (err) {
      console.error('Failed to update project:', err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Failed to delete project:', err.message);
    }
  };

  const handleAnalyzeProject = async (id) => {
    setAnalyzingId(id);
    try {
      const res = await API.post(`/projects/${id}/analyze`);
      if (res.data.success) {
        setProjects(projects.map((p) => (p._id === id ? res.data.data : p)));
      }
    } catch (err) {
      console.error('Failed to analyze project:', err.message);
    } finally {
      setAnalyzingId(null);
    }
  };

  const statusOptions = ['All', 'Completed', 'In Progress', 'Planned'];

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      project.title?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.technologies?.some((t) => t.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Project Intelligence"
        subtitle="Manage your developer portfolio projects and run AI quality audits for resume impact"
        actionText="Add New Project"
        onAction={() => setIsModalOpen(true)}
        actionIcon={Plus}
      />

      {/* FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          {statusOptions.map((opt) => {
            const count = opt === 'All' ? projects.length : projects.filter((p) => p.status === opt).length;
            const isSelected = statusFilter === opt;
            return (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-nexus-500/20 text-nexus-400 border border-nexus-500/30 font-semibold shadow-sm'
                    : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-700/40'
                }`}
              >
                <span>{opt}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-nexus-500/30 text-nexus-300' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-nexus-500"
          />
        </div>
      </div>

      {/* PROJECTS GRID */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project._id} className="flex flex-col justify-between p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-nexus-600/20 text-nexus-400 flex items-center justify-center shrink-0">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{project.title}</h3>
                      <span className="text-[11px] text-slate-400">{project.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        project.status === 'Completed'
                          ? 'emerald'
                          : project.status === 'In Progress'
                          ? 'amber'
                          : 'slate'
                      }
                    >
                      {project.status}
                    </Badge>
                    <button
                      onClick={() => handleOpenEditModal(project)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-nexus-400 hover:bg-nexus-500/10 transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{project.description}</p>

                {/* TECH STACK TAGS */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI FEEDBACK SUMMARY IF AVAILABLE */}
              {project.aiFeedback && (
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-nexus-400" />
                      <span>AI Quality Rating</span>
                    </span>
                    <span className="font-bold text-nexus-400">
                      {project.aiFeedback.qualityRating || 85}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{project.aiFeedback.resumeImpact}</p>
                </div>
              )}

              {/* FOOTER LINKS & AUDIT ACTION */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-3 text-xs">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-white"
                    >
                      <Code className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  loading={analyzingId === project._id}
                  onClick={() => handleAnalyzeProject(project._id)}
                  icon={Sparkles}
                  className="text-xs text-nexus-400 hover:text-nexus-300"
                >
                  Run AI Audit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 text-slate-400 space-y-3">
          <FolderGit2 className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm">No projects match the current search or status filter.</p>
          {(statusFilter !== 'All' || searchQuery) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          )}
        </Card>
      )}

      {/* CREATE PROJECT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Portfolio Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="e.g. Nexus AI Full-Stack Platform"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Project Description"
            placeholder="Describe features, architecture, and personal contributions..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Technologies Used (comma separated)"
            placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub URL"
              placeholder="https://github.com/username/repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
            <Input
              label="Live Demo URL"
              placeholder="https://myproject.demo"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Role"
              placeholder="Sole Developer / Lead Architect"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={['Completed', 'In Progress', 'Planned']}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Add Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT PROJECT MODAL */}
      <Modal
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        title="Edit Portfolio Project"
      >
        <form onSubmit={handleUpdateProject} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="e.g. Nexus AI Full-Stack Platform"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />

          <Textarea
            label="Project Description"
            placeholder="Describe features, architecture, and personal contributions..."
            rows={3}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <Input
            label="Technologies Used (comma separated)"
            placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
            value={editTechnologies}
            onChange={(e) => setEditTechnologies(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub URL"
              placeholder="https://github.com/username/repo"
              value={editGithubUrl}
              onChange={(e) => setEditGithubUrl(e.target.value)}
            />
            <Input
              label="Live Demo URL"
              placeholder="https://myproject.demo"
              value={editLiveUrl}
              onChange={(e) => setEditLiveUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Role"
              placeholder="Sole Developer / Lead Architect"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            />
            <Select
              label="Status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              options={['Completed', 'In Progress', 'Planned']}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setEditingProject(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={updating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
