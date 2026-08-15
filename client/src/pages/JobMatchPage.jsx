import React, { useState, useEffect } from 'react';
import { Target, Sparkles, CheckCircle2, AlertTriangle, HelpCircle, History } from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card, Badge, ProgressBar } from '../components/Card';
import { Textarea, Input } from '../components/Input';
import { Button } from '../components/Button';
import API from '../services/api';

export const JobMatchPage = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/jobs/history');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch job match history:', err.message);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobDescriptionText.trim()) {
      setError('Please paste a job description text to analyze.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await API.post('/jobs/match', {
        jobTitle,
        jobDescriptionText,
      });

      if (res.data.success) {
        setMatchResult(res.data.data);
        fetchHistory();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Job match analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Job Matcher"
        subtitle="Paste any target job description to compute instant match percentage, skill gaps, and preparation steps"
      />

      {/* INPUT FORM CARD */}
      <Card className="space-y-4">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <Input
            label="Job Position Title (Optional)"
            placeholder="e.g. AI Systems Engineer / Full Stack Developer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />

          <Textarea
            label="Paste Job Description Requirements"
            placeholder="Paste the full job posting requirements, responsibilities, and technical stack specifications..."
            rows={6}
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
            required
          />

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={loading} icon={Sparkles}>
              Calculate AI Job Match
            </Button>
          </div>
        </form>
      </Card>

      {/* MATCH RESULT BREAKDOWN */}
      {matchResult && (
        <div className="space-y-6 animate-fade-in">
          {/* OVERVIEW SCORE GAUGE */}
          <Card className="bg-gradient-to-r from-nexus-900/40 via-slate-900 to-slate-900 border-nexus-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-nexus-400">Position Analysis</span>
              <h3 className="text-xl font-bold text-white">{matchResult.jobTitle}</h3>
              <p className="text-xs text-slate-400">{matchResult.companyName || 'Target Organization'}</p>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/80 px-6 py-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase block">Match Score</span>
                <span className="text-3xl font-black text-white">{matchResult.matchScore}%</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-nexus-600/20 border-2 border-nexus-500 flex items-center justify-center text-nexus-400">
                <Target className="w-8 h-8" />
              </div>
            </div>
          </Card>

          {/* MATCHING VS MISSING BREAKDOWN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Matches</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.matchingSkills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300">
                    {s}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <HelpCircle className="w-4 h-4" />
                <span>Partial Matches</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.partialMatches?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300">
                    ~ {s}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Missing Requirements</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.missingSkills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-300">
                    + {s}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* TAILORED PREPARATION STEPS */}
          <Card className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-nexus-400" />
              <span>AI Tailored Preparation Strategy</span>
            </h4>
            <ul className="space-y-2">
              {matchResult.recommendations?.map((rec, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-nexus-400 font-bold mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};
