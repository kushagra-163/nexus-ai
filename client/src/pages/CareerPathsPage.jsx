import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  TrendingUp,
  Layers,
  Sparkles,
  Search,
  Filter,
  BarChart2,
  Briefcase
} from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card, Badge } from '../components/Card';
import { Button } from '../components/Button';
import API from '../services/api';

const demandOptions = ['All', 'Extremely High', 'Very High', 'High'];

export const CareerPathsPage = () => {
  const [paths, setPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [demandFilter, setDemandFilter] = useState('All');
  const [targetSuccess, setTargetSuccess] = useState('');
  const [showSalaryMatrix, setShowSalaryMatrix] = useState(false);

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

  const filteredPaths = paths.filter((path) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      path.role.toLowerCase().includes(query) ||
      (path.description && path.description.toLowerCase().includes(query)) ||
      (path.requiredSkills && path.requiredSkills.some((s) => s.toLowerCase().includes(query)));

    const matchesDemand =
      demandFilter === 'All' || path.demandRating?.toLowerCase() === demandFilter.toLowerCase();

    return matchesSearch && matchesDemand;
  });

  const handleSetTargetRole = async (roleName) => {
    try {
      await API.post('/career/assess', { targetRole: roleName });
      setTargetSuccess(`Target role updated to "${roleName}" successfully!`);
      setTimeout(() => setTargetSuccess(''), 4000);
    } catch (e) {
      setTargetSuccess(`Set target role to ${roleName}`);
      setTimeout(() => setTargetSuccess(''), 4000);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Path Intelligence"
        subtitle="Explore structured stage-by-stage progression paths and India tech market salary ranges (₹ LPA)"
      />

      {targetSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs sm:text-sm font-semibold text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{targetSuccess}</span>
        </div>
      )}

      {/* SEARCH, FILTER & COMPARISON TOOLBAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles by title, description or skills (e.g. AI, Full Stack, Docker)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-nexus-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {demandOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setDemandFilter(opt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  demandFilter === opt
                    ? 'bg-nexus-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSalaryMatrix((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              showSalaryMatrix
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{showSalaryMatrix ? 'Hide Comparison' : 'Salary Matrix'}</span>
          </button>
        </div>
      </div>

      {/* SALARY COMPARISON MATRIX (OPTIONAL EXPANDABLE VIEW) */}
      {showSalaryMatrix && (
        <Card className="border-indigo-500/30 bg-slate-950/70 p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Cross-Track India Salary Comparison (LPA)</h3>
            </div>
            <span className="text-[11px] text-slate-500">Market benchmark data</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 font-semibold">Track Role</th>
                  <th className="py-2.5 font-semibold">Demand</th>
                  <th className="py-2.5 font-semibold">Entry (0-2y)</th>
                  <th className="py-2.5 font-semibold">Mid (3-5y)</th>
                  <th className="py-2.5 font-semibold">Senior (5+y)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paths.map((p) => (
                  <tr key={p.role} className="hover:bg-slate-900/40">
                    <td className="py-2.5 font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-nexus-400" />
                      <span>{p.role}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.demandRating}
                      </span>
                    </td>
                    <td className="py-2.5 text-emerald-400 font-semibold">{p.salaryBreakdown?.entry || '₹6–12 LPA'}</td>
                    <td className="py-2.5 text-nexus-400 font-semibold">{p.salaryBreakdown?.mid || '₹12–25 LPA'}</td>
                    <td className="py-2.5 text-purple-400 font-semibold">{p.salaryBreakdown?.senior || '₹25–50+ LPA'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ROLE SELECTOR CARDS GRID */}
      {filteredPaths.length === 0 ? (
        <Card className="text-center py-12 space-y-3">
          <Compass className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No career tracks match your criteria</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or changing the demand filter to view other engineering tracks.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setDemandFilter('All');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPaths.map((path) => {
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
                  <Badge
                    variant={
                      path.demandRating === 'Extremely High' || path.demandRating === 'Very High'
                        ? 'emerald'
                        : 'indigo'
                    }
                  >
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
      )}

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
            <Button variant="primary" onClick={() => handleSetTargetRole(selectedPath.role)}>
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
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200"
                >
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
                    <p className="text-xs text-slate-400">
                      Focus Area: <strong className="text-slate-200">{stg.focusArea}</strong>
                    </p>
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
