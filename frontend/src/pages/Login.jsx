import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Loader2, KeyRound, Sparkles, ShieldCheck, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setToken } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e, customEmail = null, customPassword = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    if (!loginEmail || !loginPassword) return;

    setIsLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', loginEmail);
      formData.append('password', loginPassword);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      setToken(data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Ensure backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass = 'password123') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    handleLogin(null, demoEmail, demoPass);
  };

  return (
    <div className="flex items-center justify-center min-h-[82vh] py-12">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-cyan-300 p-4 shadow-[0_0_40px_rgba(6,182,212,0.4)] text-slate-950 flex items-center justify-center mb-4 transform hover:scale-105 transition-transform">
            <Brain className="w-full h-full stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-cyan-gradient">
            VI-SCOUTS Platform
          </h2>
        </div>

        <Card className="shadow-[0_10px_40px_rgba(0,0,0,0.6)] border-cyan-500/30 bg-slate-900/85 backdrop-blur-xl overflow-hidden rounded-3xl">
          <CardHeader className="space-y-2 text-center bg-slate-950/60 p-8 pb-7 border-b border-slate-800">
            <CardTitle className="text-2xl font-extrabold text-slate-100">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400 text-sm">Sign in to continue your AI interview practice</CardDescription>
          </CardHeader>
          
          <div className="p-8 pb-4 bg-cyan-950/30 border-b border-cyan-500/20">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-cyan-300 uppercase tracking-widest mb-4">
              <Sparkles className="h-4 w-4 text-teal-300 animate-pulse" />
              <span>One-Click Demo Credentials</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => fillDemo('demo@vi-scouts.com')}
                disabled={isLoading}
                className="flex items-center justify-between text-left p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/15 shadow-sm transition-all text-xs font-bold text-slate-200 group cursor-pointer"
              >
                <span className="truncate flex items-center">
                  <ShieldCheck className="h-4 w-4 text-cyan-400 mr-2 shrink-0" />
                  demo@vi-scouts.com
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-lg font-extrabold group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                  Login
                </span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('test@example.com')}
                disabled={isLoading}
                className="flex items-center justify-between text-left p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 hover:bg-cyan-500/15 shadow-sm transition-all text-xs font-bold text-slate-200 group cursor-pointer"
              >
                <span className="truncate flex items-center">
                  <KeyRound className="h-4 w-4 text-slate-400 mr-2 shrink-0 group-hover:text-cyan-400" />
                  test@example.com
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg font-extrabold group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                  Login
                </span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3.5 text-center font-medium">
              Dummy password: <span className="font-mono bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-cyan-300 font-bold">password123</span>
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5 p-8 pt-6">
              {error && (
                <div className="bg-red-950/60 text-red-300 p-4 rounded-2xl text-sm text-center border border-red-500/40 font-bold animate-pulse">
                  {error}
                </div>
              )}
              <div className="space-y-2.5">
                <label className="text-sm font-extrabold text-slate-200 tracking-wide">Email address</label>
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-extrabold text-slate-200 tracking-wide">Password</label>
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-5 p-8 pt-0">
              <Button type="submit" className="w-full h-14 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black tracking-wide rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all text-base" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2.5 h-5 w-5 animate-spin" /> : null}
                Sign in to Dashboard
              </Button>
              <div className="text-center text-sm text-slate-400 font-medium">
                Don&apos;t have an account yet?{' '}
                <Link to="/register" className="text-cyan-400 font-extrabold hover:underline hover:text-cyan-300 ml-1">
                  Sign up free
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
