import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Copy,
  Check,
  Filter,
} from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card, Badge, ProgressBar } from '../components/Card';
import { Button } from '../components/Button';
import API from '../services/api';

export const LearningRoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [copied, setCopied] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await API.get('/roadmap');
      if (res.data.success && res.data.data) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch roadmap:', err.message);
    }
  };

  const handleGenerate = async () => {
    try {
      const res = await API.post('/roadmap/generate');
      if (res.data.success) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      console.error('Failed to generate roadmap:', err.message);
    }
  };

  const handleToggleItem = async (phaseIndex, itemIndex, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    try {
      const res = await API.patch('/roadmap/item', {
        phaseIndex,
        itemIndex,
        status: newStatus,
      });
      if (res.data.success) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      console.error('Failed to update roadmap item:', err.message);
    }
  };

  const calculateProgress = () => {
    if (!roadmap?.phases) return 0;
    let total = 0;
    let completed = 0;
    roadmap.phases.forEach((p) => {
      p.items?.forEach((i) => {
        total++;
        if (i.status === 'Completed') completed++;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const generateMarkdown = () => {
    if (!roadmap) return '';
    let md = `# Nexus AI Learning Roadmap — ${roadmap.targetRole}\n\n`;
    md += `Progress: ${calculateProgress()}% Completed\n\n`;

    roadmap.phases?.forEach((phase) => {
      md += `## Phase ${phase.phaseNumber}: ${phase.phaseTitle}\n`;
      md += `${phase.description}\n\n`;
      phase.items?.forEach((item) => {
        const check = item.status === 'Completed' ? '[x]' : '[ ]';
        md += `- ${check} **${item.title}** (${item.category})\n`;
        if (item.resources && item.resources.length > 0) {
          md += `  - Resources: ${item.resources.join(', ')}\n`;
        }
      });
      md += '\n';
    });
    return md;
  };

  const handleExportMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus-learning-roadmap-${roadmap?.targetRole?.toLowerCase().replace(/\s+/g, '-') || 'plan'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = async () => {
    const md = generateMarkdown();
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const allItems = roadmap?.phases?.flatMap((p) => p.items || []) || [];
  const statusCounts = {
    All: allItems.length,
    Completed: allItems.filter((i) => i.status === 'Completed').length,
    'In Progress': allItems.filter((i) => i.status === 'In Progress').length,
    'Not Started': allItems.filter((i) => !i.status || i.status === 'Not Started').length,
  };

  const statusOptions = ['All', 'Completed', 'In Progress', 'Not Started'];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Personalized Learning Roadmap"
        subtitle="Actionable phase-by-phase learning path tailored to your skills and target role"
        actionText="Regenerate Roadmap"
        onAction={handleGenerate}
        actionIcon={Sparkles}
      />

      {/* OVERVIEW PROGRESS CARD */}
      {roadmap && (
        <Card className="bg-gradient-to-r from-nexus-100/50 via-white to-slate-50 dark:from-nexus-900/40 dark:via-slate-900 dark:to-slate-900 border-nexus-500/30 p-6 space-y-4 shadow-xs dark:shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-nexus-600 dark:text-nexus-400">
                Target Role Roadmap
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{roadmap.targetRole}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Milestones:{' '}
                <strong className="text-slate-900 dark:text-white">
                  {roadmap.completedMilestones} / {roadmap.totalMilestones}
                </strong>
              </span>
              <Badge variant={calculateProgress() === 100 ? 'emerald' : 'indigo'}>
                {calculateProgress()}% Completed
              </Badge>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyMarkdown}
                  icon={copied ? Check : Copy}
                  className="text-xs"
                >
                  {copied ? 'Copied MD!' : 'Copy MD'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExportMarkdown}
                  icon={Download}
                  className="text-xs"
                >
                  Export (.md)
                </Button>
              </div>
            </div>
          </div>
          <ProgressBar progress={calculateProgress()} />
        </Card>
      )}

      {/* FILTER CONTROLS */}
      {roadmap && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Milestones:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((opt) => {
              const isSelected = statusFilter === opt;
              const count = statusCounts[opt] || 0;
              return (
                <button
                  key={opt}
                  onClick={() => setStatusFilter(opt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-nexus-500/20 text-nexus-700 dark:text-nexus-400 border border-nexus-500/40 font-semibold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/40'
                  }`}
                >
                  <span>{opt}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-nexus-500/30 text-nexus-800 dark:text-nexus-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASES & MILESTONES LIST */}
      <div className="space-y-6">
        {roadmap?.phases?.map((phase, pIdx) => {
          const filteredItems = (phase.items || []).filter((item) => {
            if (statusFilter === 'All') return true;
            if (statusFilter === 'Not Started') return !item.status || item.status === 'Not Started';
            return item.status === statusFilter;
          });

          return (
            <Card key={pIdx} className="space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-nexus-600/10 dark:bg-nexus-600/20 text-nexus-600 dark:text-nexus-400 flex items-center justify-center font-bold text-xs shadow-xs">
                    P{phase.phaseNumber}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{phase.phaseTitle}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{phase.description}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    phase.status === 'Completed'
                      ? 'emerald'
                      : phase.status === 'In Progress'
                      ? 'amber'
                      : 'slate'
                  }
                >
                  {phase.status || 'Not Started'}
                </Badge>
              </div>

              {/* ITEMS LIST */}
              <div className="space-y-2.5 pt-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, iIdx) => {
                    const originalIndex = phase.items.indexOf(item);
                    const isDone = item.status === 'Completed';
                    const isInProgress = item.status === 'In Progress';
                    return (
                      <div
                        key={iIdx}
                        onClick={() => handleToggleItem(pIdx, originalIndex, item.status)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isDone
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-500'
                            : isInProgress
                            ? 'bg-amber-500/10 border-amber-500/20 text-slate-900 dark:text-white'
                            : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs dark:shadow-none'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button className="shrink-0 cursor-pointer" type="button">
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : isInProgress ? (
                              <Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                            )}
                          </button>
                          <div>
                            <span
                              className={`text-xs font-semibold ${
                                isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.resources && item.resources.length > 0 && (
                              <span className="block text-[10px] text-slate-500 mt-0.5">
                                Resources: {item.resources.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            item.category === 'Project'
                              ? 'indigo'
                              : item.category === 'Concept'
                              ? 'blue'
                              : 'slate'
                          }
                        >
                          {item.category}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 py-2">
                    No milestones matching status &ldquo;{statusFilter}&rdquo; in this phase.
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
