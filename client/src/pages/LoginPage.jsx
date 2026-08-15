import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.data?.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@nexusai.com');
    setPassword('Password123!');
    setLoading(true);
    setError('');
    try {
      await login('demo@nexusai.com', 'Password123!');
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed. Run "npm run seed" in server to seed demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold text-white">Welcome Back</h3>
        <p className="text-xs text-slate-400">Sign in to your Nexus AI workspace</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" loading={loading} icon={LogIn} className="w-full">
          Sign In
        </Button>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500 font-semibold">Or</span></div>
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={handleDemoLogin}
        loading={loading}
        icon={Sparkles}
        className="w-full text-xs"
      >
        Quick Sign In with Demo Account
      </Button>

      <p className="text-center text-xs text-slate-400 pt-2">
        Don't have an account?{' '}
        <Link to="/register" className="text-nexus-400 font-semibold hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
};
