import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, Circle, Clock, Sparkles, Layers, BookOpen } from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card, Badge, ProgressBar } from '../components/Card';
import { Button } from '../components/Button';
import API from '../services/api';

export const LearningRoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await API.get('/roadmap');
      if (res.data.success) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch roadmap:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await API.post('/roadmap/generate', {
        targetRole: roadmap?.targetRole || 'Full Stack Developer',
        weeklyHours: 12,
      });
      if (res.data.success) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      console.error('Failed to generate roadmap:', err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleItem = async (phaseIndex, itemIndex, currentStatus) => {
    const nextStatusMap = {
      'Not Started': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'Not Started',
    };
    const nextStatus = nextStatusMap[currentStatus] || 'Completed';

    try {
      const res = await API.patch('/roadmap/status', {
        phaseIndex,
        itemIndex,
        status: nextStatus,
      });
      if (res.data.success) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      console.error('Failed to update item status:', err.message);
    }
  };

  const calculateProgress = () => {
    if (!roadmap || !roadmap.totalMilestones) return 0;
    return Math.round((roadmap.completedMilestones / roadmap.totalMilestones) * 100);
  };

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
        <Card className="bg-gradient-to-r from-nexus-900/40 via-slate-900 to-slate-900 border-nexus-500/30 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-nexus-400">Target Role Roadmap</span>
              <h3 className="text-xl font-bold text-white">{roadmap.targetRole}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">
                Milestones: <strong className="text-white">{roadmap.completedMilestones} / {roadmap.totalMilestones}</strong>
              </span>
              <Badge variant={calculateProgress() === 100 ? 'emerald' : 'indigo'}>
                {calculateProgress()}% Completed
              </Badge>
            </div>
          </div>
          <ProgressBar progress={calculateProgress()} />
        </Card>
      )}

      {/* PHASES & MILESTONES LIST */}
      <div className="space-y-6">
        {roadmap?.phases?.map((phase, pIdx) => (
          <Card key={pIdx} className="space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-nexus-600/20 text-nexus-400 flex items-center justify-center font-bold text-xs">
                  P{phase.phaseNumber}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{phase.phaseTitle}</h4>
                  <p className="text-xs text-slate-400">{phase.description}</p>
                </div>
              </div>
              <Badge variant={phase.status === 'Completed' ? 'emerald' : phase.status === 'In Progress' ? 'amber' : 'slate'}>
                {phase.status || 'Not Started'}
              </Badge>
            </div>

            {/* ITEMS LIST */}
            <div className="space-y-2.5 pt-2">
              {phase.items?.map((item, iIdx) => {
                const isDone = item.status === 'Completed';
                const isInProgress = item.status === 'In Progress';
                return (
                  <div
                    key={iIdx}
                    onClick={() => handleToggleItem(pIdx, iIdx, item.status)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                        : isInProgress
                        ? 'bg-amber-500/5 border-amber-500/20 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button className="shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isInProgress ? (
                          <Clock className="w-5 h-5 text-amber-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                      <div>
                        <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {item.title}
                        </span>
                        {item.resources && item.resources.length > 0 && (
                          <span className="block text-[10px] text-slate-500 mt-0.5">
                            Resources: {item.resources.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant={item.category === 'Project' ? 'purple' : item.category === 'Concept' ? 'blue' : 'slate'}>
                      {item.category}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
