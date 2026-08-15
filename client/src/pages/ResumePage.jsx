import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { PageHeader } from '../components/Topbar';
import { Card, Badge, ProgressBar } from '../components/Card';
import { Button } from '../components/Button';
import API from '../services/api';

export const ResumePage = () => {
  const [resumeData, setResumeData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLatestResume();
  }, []);

  const fetchLatestResume = async () => {
    try {
      const res = await API.get('/resume/latest');
      if (res.data.success && res.data.data) {
        setResumeData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load resume analysis:', err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF or text resume file first.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await API.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setResumeData(res.data.data);
        setFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload and analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume Intelligence"
        subtitle="AI-powered ATS score analysis, keyword matching, and recommendations"
      />

      {/* UPLOAD BOX CARD */}
      <Card className="border-dashed border-2 border-slate-800 bg-slate-900/40 p-8 text-center">
        <form onSubmit={handleUpload} className="max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-nexus-600/20 text-nexus-400 flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Upload Your Resume (PDF)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Nexus AI extracts key text and scans ATS keywords against your target role.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileChange}
              id="resume-file-input"
              className="hidden"
            />
            <label
              htmlFor="resume-file-input"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer border border-slate-700 transition-colors"
            >
              {file ? file.name : 'Choose PDF File'}
            </label>
            <Button type="submit" variant="primary" loading={loading} disabled={!file || loading} icon={Sparkles}>
              Scan & Analyze Resume
            </Button>
          </div>

          {error && <p className="text-xs text-rose-400 pt-2">{error}</p>}
        </form>
      </Card>

      {/* RESUME ANALYSIS RESULTS */}
      {resumeData && (
        <div className="space-y-6 animate-fade-in">
          {/* SCORE BREAKDOWN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SCORE GAUGE CARD */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-925 border-nexus-500/30 flex flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nexus ATS Score</span>
                <Badge variant={resumeData.atsCompatibility === 'High' ? 'emerald' : 'amber'}>
                  {resumeData.atsCompatibility} ATS
                </Badge>
              </div>

              <div className="py-6 text-center">
                <span className="text-5xl font-black text-white tracking-tight">{resumeData.score}</span>
                <span className="text-lg font-bold text-slate-500"> / 100</span>
                <div className="w-full bg-slate-800 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div
                    className="bg-nexus-500 h-2.5 rounded-full"
                    style={{ width: `${resumeData.score}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Calculated by Nexus AI Engine based on ATS criteria for <strong>{resumeData.roleCompatibility?.role || 'Software Engineering'}</strong>.
              </p>
            </Card>

            {/* DETECTED SKILLS CARD */}
            <Card className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Detected Keywords</span>
                </span>
                <span className="text-xs text-emerald-400 font-bold">{resumeData.detectedSkills?.length || 0} Found</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-44 overflow-y-auto">
                {resumeData.detectedSkills && resumeData.detectedSkills.length > 0 ? (
                  resumeData.detectedSkills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No skills detected yet.</p>
                )}
              </div>
            </Card>

            {/* MISSING KEYWORDS CARD */}
            <Card className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-rose-400" />
                  <span>Missing Keywords</span>
                </span>
                <span className="text-xs text-rose-400 font-bold">{resumeData.missingKeywords?.length || 0} Gap</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-44 overflow-y-auto">
                {resumeData.missingKeywords && resumeData.missingKeywords.length > 0 ? (
                  resumeData.missingKeywords.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-300">
                      + {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No critical missing keywords!</p>
                )}
              </div>
            </Card>
          </div>

          {/* STRENGTHS, WEAKNESSES & RECOMMENDATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Resume Strengths</span>
              </h3>
              <ul className="space-y-2">
                {resumeData.strengths?.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-nexus-400" />
                <span>AI Recommended Action Plan</span>
              </h3>
              <ul className="space-y-2">
                {resumeData.recommendations?.map((rec, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-nexus-400 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
