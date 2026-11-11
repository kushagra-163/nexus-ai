import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Target,
  Bot,
  HelpCircle,
  ChevronDown,
  Mail,
  CheckCircle2,
  Send
} from 'lucide-react';

const faqs = [
  {
    question: 'How does Nexus AI calculate career readiness and ATS scores?',
    answer: 'Nexus AI evaluates your technical proficiencies, portfolio projects, and resume structure against live industry job specifications. It generates an objective 0-100 readiness index highlighting exact strengths and missing skill requirements.',
  },
  {
    question: 'Is my uploaded resume and personal profile data secure?',
    answer: 'Yes, completely. Resumes uploaded to Nexus AI are processed securely. Your profile data is private to your account and never sold, shared with third parties, or used for unsolicited marketing.',
  },
  {
    question: 'Can I export my learning roadmap and ATS audit reports?',
    answer: 'Yes. You can export your step-by-step career milestone roadmaps to Markdown and download actionable resume ATS improvement checklists for offline study and mentor reviews.',
  },
  {
    question: 'Which career tracks and technical domains are supported?',
    answer: 'Nexus AI supports structured blueprints and India market salary benchmarks across Full Stack Development, AI/ML Engineering, Cloud & DevOps, Backend Architecture, Data Science, and Mobile Engineering.',
  },
  {
    question: 'Is Nexus AI free for developers and students?',
    answer: 'Yes! Core capabilities including skill gap analysis, resume ATS scanning, career blueprints, and learning roadmap generation are 100% free for individual developers and students.',
  },
];

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail || !emailRegex.test(newsletterEmail.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <div className="space-y-24 py-12 md:py-20 px-6 max-w-7xl mx-auto">
      {/* HERO SECTION */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nexus-500/10 border border-nexus-500/20 text-xs font-semibold text-nexus-300">
          <Sparkles className="w-3.5 h-3.5 text-nexus-400" />
          <span>Next-Generation Career Intelligence Engine</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Your Career. <br />
          <span className="bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Connected by Intelligence.
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Nexus AI analyzes your skills, experience, projects, and goals against real-time industry demands to engineer your personalized career roadmap.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-nexus-600 hover:bg-nexus-500 text-white font-semibold text-sm rounded-xl transition-all shadow-xl shadow-nexus-600/25 active:scale-95"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#capabilities"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm rounded-xl transition-all"
          >
            <span>Explore Nexus Capabilities</span>
          </a>
        </div>

        {/* Hero Visual Banner Mockup */}
        <div className="relative mt-12 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-4 md:p-8 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-nexus-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Career Readiness</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">+14% Growth</span>
              </div>
              <p className="text-3xl font-extrabold text-white">84 / 100</p>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-nexus-500 h-2 rounded-full w-[84%]" />
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Resume ATS Score</span>
                <span className="text-xs font-bold text-nexus-400 bg-nexus-500/10 px-2 py-0.5 rounded">Scanned</span>
              </div>
              <p className="text-3xl font-extrabold text-white">86 / 100</p>
              <p className="text-xs text-slate-400">High ATS Match for AI & Full Stack Roles</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">AI Job Match</span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">Live</span>
              </div>
              <p className="text-3xl font-extrabold text-white">82% Match</p>
              <p className="text-xs text-slate-400">Missing Docker & Microservices</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW NEXUS WORKS */}
      <section id="how-it-works" className="space-y-12 text-center">
        <div className="space-y-3">
          <h2 className="text-2xl md:text-4xl font-bold text-white">How Nexus AI Works</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            A seamless four-tier intelligence workflow designed to accelerate your developer trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            { step: '01', title: 'User Data Intake', desc: 'Sync your education, skills, projects, and target role preferences.' },
            { step: '02', title: 'Contextual AI Audit', desc: 'Our engine parses your profile & resume against live ATS metrics.' },
            { step: '03', title: 'Skill Gap Matrix', desc: 'Isolate exact missing requirements for top tech roles.' },
            { step: '04', title: 'Actionable Roadmap', desc: 'Follow personalized milestone phases to reach career readiness.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
              <span className="text-3xl font-black text-nexus-500/30">{item.step}</span>
              <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section id="capabilities" className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-bold text-white">Core Capabilities</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to analyze, optimize, and present your developer portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-4 hover:border-nexus-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-nexus-600/20 text-nexus-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Resume Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your PDF resume to extract key skills, receive visual 0-100 ATS compatibility scores, and discover missing keywords.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-4 hover:border-nexus-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Skill Gap Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare your current skill inventory directly against industry target roles like AI Engineer, Full Stack, and Data Scientist.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-4 hover:border-nexus-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Context-Aware AI Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Chat with a personal AI career mentor that understands your live profile, projects, and learning history.
            </p>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-500/10 border border-nexus-500/20 text-xs font-semibold text-nexus-300">
            <HelpCircle className="w-3.5 h-3.5 text-nexus-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-400">Everything you need to know about Nexus AI career intelligence</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white hover:text-nexus-300 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'transform rotate-180 text-nexus-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* DEVELOPER NEWSLETTER & CAREER DIGEST */}
      <section className="max-w-3xl mx-auto rounded-3xl border border-nexus-500/30 bg-gradient-to-b from-slate-900 to-nexus-950/40 p-8 sm:p-10 text-center space-y-5 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-nexus-600/20 border border-nexus-500/30 flex items-center justify-center text-nexus-400 mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Subscribe to Nexus Career Digest</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Get weekly tech hiring trends, high-demand skills, and actionable career insights delivered directly to your inbox.
          </p>
        </div>

        {subscribed ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs sm:text-sm font-semibold text-emerald-300 flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Thank you for subscribing! You will receive our weekly developer career digest.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-3 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your developer email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-nexus-500 transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-nexus-600 hover:bg-nexus-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md active:scale-95 shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {emailError && <p className="text-xs text-rose-400 text-left pl-1">{emailError}</p>}
          </form>
        )}
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-nexus-900/40 via-slate-900 to-indigo-950/40 border border-nexus-500/30 rounded-3xl p-10 md:p-14 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          Ready to Build Your Career Intelligence?
        </h2>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Join thousands of developers utilizing Nexus AI to master high-value skills and land target software roles.
        </p>
        <div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-nexus-600 hover:bg-nexus-500 text-white font-semibold text-sm rounded-xl transition-all shadow-xl shadow-nexus-600/25 active:scale-95"
          >
            <span>Create Your Nexus Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
