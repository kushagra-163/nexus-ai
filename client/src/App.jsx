import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResumePage } from './pages/ResumePage';
import { SkillsPage } from './pages/SkillsPage';
import { CareerPathsPage } from './pages/CareerPathsPage';
import { JobMatchPage } from './pages/JobMatchPage';
import { LearningRoadmapPage } from './pages/LearningRoadmapPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          {/* Authentication Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Onboarding Wizard */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Protected Application SaaS Workspace */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/assistant" element={<AIAssistantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/career-paths" element={<CareerPathsPage />} />
            <Route path="/job-match" element={<JobMatchPage />} />
            <Route path="/roadmap" element={<LearningRoadmapPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
