import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, TrendingUp, Layers, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card, Badge } from '../components/Card';
import { Button } from '../components/Button';
import API from '../services/api';

export const CareerPathsPage = () => {
  const [paths, setPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareerPaths();
  }, []);

  const fetchCareerPaths = async () => {
    try {
      const res = await API.get('/career/paths');
      if (res.data.success && res.data.data.length > 0) {
        setPaths(res.data.data);
        setSelectedPath(res.data.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch career paths:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Path Intelligence"
        subtitle="Explore structured stage-by-stage progression paths and India tech market salary ranges (₹ LPA)"
      />

      {/* ROLE SELECTOR CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paths.map((path) => {
          const active = selectedPath?.role === path.role;
          return (
            <Card
              key={path.role}
              onClick={() => setSelectedPath(path)}
              className={`cursor-pointer transition-all ${
                active ? 'border-nexus-500 bg-nexus-950/20 shadow-lg' : 'hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={path.demandRating === 'Extremely High' || path.demandRating === 'Very High' ? 'emerald' : 'indigo'}>
                  {path.demandRating} Demand
                </Badge>
                <span className="text-xs font-bold text-nexus-400">INR Market</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{path.role}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{path.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Est. Salary (India):</span>
                <span className="font-bold text-emerald-400">{path.averageSalary}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* SELECTED ROLE DETAILED STAGE PROGRESSION & SALARY BREAKDOWN */}
      {selectedPath && (
        <Card className="p-6 md:p-8 space-y-6 animate-fade-in border-nexus-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-nexus-400" />
                <h3 className="text-xl font-bold text-white">{selectedPath.role} Career Blueprint</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedPath.description}</p>
            </div>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  await API.post('/career/assess', { targetRole: selectedPath.role });
                  alert(`Target role updated to ${selectedPath.role}!`);
                } catch (e) {}
              }}
            >
              Set as Target Role
            </Button>
          </div>

          {/* INDIA MARKET SALARY RANGE BREAKDOWN */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>India Tech Market Salary Expectations (INR / LPA)</span>
              </span>
              <span className="text-[10px] text-slate-500">*Market Estimates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="block text-[11px] text-slate-400 uppercase font-semibold">Entry Level (0-2 yrs)</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">
                  {selectedPath.salaryBreakdown?.entry || '₹6–12 LPA'}
                </span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="block text-[11px] text-slate-400 uppercase font-semibold">Mid Level (3-5 yrs)</span>
                <span className="text-base font-bold text-nexus-400 mt-0.5 block">
                  {selectedPath.salaryBreakdown?.mid || '₹12–25 LPA'}
                </span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="block text-[11px] text-slate-400 uppercase font-semibold">Senior Level (5+ yrs)</span>
                <span className="text-base font-bold text-purple-400 mt-0.5 block">
                  {selectedPath.salaryBreakdown?.senior || '₹25–50+ LPA'}
                </span>
              </div>
            </div>
          </div>

          {/* REQUIRED SKILLS PILLS */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Technical Requirements</span>
            <div className="flex flex-wrap gap-2">
              {selectedPath.requiredSkills?.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* STAGE TIMELINE STEPS */}
          <div className="space-y-6 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-nexus-400" />
              <span>Recommended Progression Stages</span>
            </h4>

            <div className="relative border-l-2 border-slate-800 pl-6 ml-3 space-y-8">
              {selectedPath.stages?.map((stg) => (
                <div key={stg.stageNumber} className="relative group">
                  <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-nexus-500 flex items-center justify-center text-[10px] font-bold text-nexus-300">
                    {stg.stageNumber}
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-slate-100">{stg.title}</h5>
                    <p className="text-xs text-slate-400">Focus Area: <strong className="text-slate-200">{stg.focusArea}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
