import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Zap,
  FileText,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Bot,
  Target,
  FolderGit2,
  Clock,
  Compass
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { PageHeader, StatCard } from '../components/Topbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/analytics/dashboard-summary');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard summary:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const chartColors = ['#6366f1', '#818cf8', '#a5b4fc', '#38bdf8', '#4ade80', '#fbbf24'];

  return (
    <div className="space-y-8">
      {/* WELCOME BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-nexus-900/60 via-slate-900 to-slate-900 border border-nexus-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-nexus-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-500/10 border border-nexus-500/20 text-xs font-semibold text-nexus-300">
              <Sparkles className="w-3.5 h-3.5 text-nexus-400" />
              <span>Live Nexus Intelligence Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {getGreeting()}, {user?.name || 'Developer'}.
            </h1>
            <p className="text-sm text-slate-300">
              Here is your latest career readiness analysis for target role <strong className="text-white">{data?.targetRole || 'AI & Full Stack Engineer'}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/assistant">
              <Button variant="primary" icon={Bot}>
                Ask AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatCard
              title="Career Readiness"
              value={`${data?.metrics?.readinessScore || 84}/100`}
              change="+14%"
              icon={Award}
              color="text-nexus-400"
              progress={data?.metrics?.readinessScore || 84}
            />
            <StatCard
              title="Skill Strength Index"
              value={`${data?.metrics?.skillStrength || 78}/100`}
              change="+8%"
              icon={Zap}
              color="text-indigo-400"
              progress={data?.metrics?.skillStrength || 78}
            />
            <StatCard
              title="Resume ATS Score"
              value={`${data?.metrics?.resumeScore || 86}/100`}
              change="Scanned"
              icon={FileText}
              color="text-emerald-400"
              progress={data?.metrics?.resumeScore || 86}
            />
            <StatCard
              title="Profile Completeness"
              value={`${data?.metrics?.profileCompleteness || 95}%`}
              change="Complete"
              icon={CheckCircle2}
              color="text-purple-400"
              progress={data?.metrics?.profileCompleteness || 95}
            />
          </>
        )}
      </div>

      {/* PROMINENT AI RECOMMENDATION CARD */}
      <Card className="border-nexus-500/30 bg-nexus-950/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-nexus-600/20 border border-nexus-500/40 flex items-center justify-center text-nexus-400 shrink-0 mt-1">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-nexus-400">Your Strongest Next Step</span>
              <h3 className="text-lg font-bold text-white">{data?.aiRecommendation?.title || 'Strengthen System Design & Containerization'}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {data?.aiRecommendation?.description || 'Mastering Docker containerization and Redis caching will boost your profile readiness for target full-stack & AI roles by +14%.'}
              </p>
            </div>
          </div>
          <Link to="/skills" className="shrink-0">
            <Button variant="outline" icon={ArrowRight}>
              View Recommendation
            </Button>
          </Link>
        </div>
      </Card>

      {/* CHARTS & RECENT ACTIVITY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SKILL CATEGORY CHART */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Skill Distribution by Category</h3>
              <p className="text-xs text-slate-400">Breakdown of current logged skills</p>
            </div>
            <Link to="/skills" className="text-xs font-semibold text-nexus-400 hover:underline">
              Manage Skills →
            </Link>
          </div>

          <div className="h-64 w-full pt-4">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : data?.skillDistribution && data.skillDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.skillDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {data.skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No skill distribution data available. Add skills to render analytics.
              </div>
            )}
          </div>
        </Card>

        {/* RECENT ACTIVITY TIMELINE */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-nexus-400" />
              <span>Recent Activity</span>
            </h3>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : data?.recentActivities && data.recentActivities.length > 0 ? (
              data.recentActivities.map((act) => (
                <div key={act._id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-nexus-500 mt-1.5 shrink-0" />
                  <div className="space-y-0.5 flex-1">
                    <p className="font-semibold text-slate-200">{act.title}</p>
                    <p className="text-slate-400">{act.description}</p>
                    <span className="text-[10px] text-slate-500">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No recent activities logged yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* QUICK ACTIONS SHORTCUT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Resume ATS Audit', icon: FileText, path: '/resume', color: 'text-emerald-400' },
          { label: 'AI Skill Gap Check', icon: Target, path: '/skills', color: 'text-indigo-400' },
          { label: 'Job Description Matcher', icon: Compass, path: '/job-match', color: 'text-purple-400' },
          { label: 'Portfolio Audit', icon: FolderGit2, path: '/projects', color: 'text-amber-400' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} to={item.path}>
              <Card hover className="flex items-center gap-3 p-4">
                <div className={`p-2.5 rounded-xl bg-slate-800 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-200">{item.label}</h4>
                  <span className="text-[10px] text-slate-400">Launch Module →</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
