import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, Zap, Target } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { PageHeader, StatCard } from '../components/Topbar';
import { Card } from '../components/Card';
import API from '../services/api';

const readinessTrendData = [
  { month: 'Jan', readiness: 55, skillCount: 4 },
  { month: 'Feb', readiness: 62, skillCount: 6 },
  { month: 'Mar', readiness: 70, skillCount: 8 },
  { month: 'Apr', readiness: 78, skillCount: 10 },
  { month: 'May', readiness: 84, skillCount: 12 },
];

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/analytics/dashboard-summary');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Analytics & Growth Metrics"
        subtitle="Visual analytics tracking skill expansion, readiness progression, and job match performance"
      />

      {/* METRIC HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Career Readiness Index" value={`${data?.metrics?.readinessScore || 84}/100`} change="+14%" icon={Award} />
        <StatCard title="Skill Strength Rating" value={`${data?.metrics?.skillStrength || 78}/100`} change="+8%" icon={Zap} color="text-indigo-400" />
        <StatCard title="Target Role Match" value="82%" change="High Match" icon={Target} color="text-emerald-400" />
        <StatCard title="Milestone Completion" value={`${data?.metrics?.completedMilestones || 4} / ${data?.metrics?.totalMilestones || 12}`} change="33%" icon={TrendingUp} color="text-purple-400" />
      </div>

      {/* RECHARTS VISUALIZATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* READINESS PROGRESSION LINE CHART */}
        <Card className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Readiness Progression Trend</h3>
            <p className="text-xs text-slate-400">Monthly evolution of career readiness index</p>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readinessTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="readiness" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* SKILL CATEGORY BREAKDOWN BAR CHART */}
        <Card className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Skill Distribution by Domain</h3>
            <p className="text-xs text-slate-400">Count of logged skills across categories</p>
          </div>
          <div className="h-64 w-full pt-4">
            {data?.skillDistribution && data.skillDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.skillDistribution} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#818cf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No skill distribution data available.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
