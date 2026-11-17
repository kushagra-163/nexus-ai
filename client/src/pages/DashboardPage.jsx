import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Award,
  Zap,
  Target,
  Clock,
  ArrowRight,
  Compass,
  FolderGit2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Card, Skeleton } from '../components/Card';
import { StatCard } from '../components/Topbar';
import { Button } from '../components/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/analytics/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const chartColors = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-8">
      {/* WELCOME BANNER */}
      <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md overflow-hidden shadow-xs dark:shadow-none">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-nexus-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-500/10 border border-nexus-500/20 text-xs font-semibold text-nexus-600 dark:text-nexus-300">
              <Sparkles className="w-3.5 h-3.5 text-nexus-600 dark:text-nexus-400" />
              <span>Live Nexus Intelligence Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {getGreeting()}, {user?.name || 'Developer'}.
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Here is your latest career readiness analysis for target role <strong className="text-slate-900 dark:text-white">{data?.targetRole || 'AI & Full Stack Engineer'}</strong>.
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
              color="text-nexus-600 dark:text-nexus-400"
              progress={data?.metrics?.readinessScore || 84}
            />
            <StatCard
              title="Skills Profile"
              value={`${data?.metrics?.totalSkills || 12} Verified`}
              change="Top 15%"
              icon={Zap}
              color="text-indigo-600 dark:text-indigo-400"
            />
            <StatCard
              title="Resume ATS Score"
              value={`${data?.metrics?.resumeScore || 86}/100`}
              change="Scanned"
              icon={FileText}
              color="text-emerald-600 dark:text-emerald-400"
              progress={data?.metrics?.resumeScore || 86}
            />
            <StatCard
              title="Target Match Index"
              value="82%"
              change="Live"
              icon={Target}
              color="text-purple-600 dark:text-purple-400"
              progress={82}
            />
          </>
        )}
      </div>

      {/* PROMINENT AI RECOMMENDATION CARD */}
      <Card className="border-nexus-500/30 bg-nexus-50/50 dark:bg-nexus-950/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-nexus-600/10 dark:bg-nexus-600/20 border border-nexus-500/30 dark:border-nexus-500/40 flex items-center justify-center text-nexus-600 dark:text-nexus-400 shrink-0 mt-1 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-nexus-600 dark:text-nexus-400">Your Strongest Next Step</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{data?.aiRecommendation?.title || 'Strengthen System Design & Containerization'}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
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
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Skill Distribution by Category</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Breakdown of current logged skills</p>
            </div>
            <Link to="/skills" className="text-xs font-semibold text-nexus-600 dark:text-nexus-400 hover:underline">
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
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
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
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-nexus-600 dark:text-nexus-400" />
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
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{act.title}</p>
                    <p className="text-slate-500 dark:text-slate-400">{act.description}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
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
          { label: 'Resume ATS Audit', icon: FileText, path: '/resume', color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'AI Skill Gap Check', icon: Target, path: '/skills', color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Job Description Matcher', icon: Compass, path: '/job-match', color: 'text-purple-600 dark:text-purple-400' },
          { label: 'Portfolio Audit', icon: FolderGit2, path: '/projects', color: 'text-amber-600 dark:text-amber-400' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} to={item.path}>
              <Card hover className="flex items-center gap-3 p-4">
                <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Launch Module →</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
