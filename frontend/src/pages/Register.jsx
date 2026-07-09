import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Loader2, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../lib/utils';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to register');
      }

      // Automatically redirect to login on success
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Check backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[82vh] py-12">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-cyan-300 p-4 shadow-[0_0_40px_rgba(6,182,212,0.4)] text-slate-950 flex items-center justify-center mb-4 transform hover:scale-105 transition-transform">
            <Brain className="w-full h-full stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-cyan-gradient">
            Join VI-SCOUTS
          </h2>
        </div>

        <Card className="shadow-[0_10px_40px_rgba(0,0,0,0.6)] border-cyan-500/30 bg-slate-900/85 backdrop-blur-xl overflow-hidden rounded-3xl">
          <CardHeader className="space-y-2 text-center bg-slate-950/60 p-8 pb-7 border-b border-slate-800">
            <CardTitle className="text-2xl font-extrabold text-slate-100">Create Account</CardTitle>
            <CardDescription className="text-slate-400 text-sm">Start practicing AI-assisted interviews for free</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
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
                <label className="text-sm font-extrabold text-slate-200 tracking-wide">Password</label>
                <Input 
                  type="password" 
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-5 p-8 pt-0">
              <Button type="submit" className="w-full h-14 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black tracking-wide rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all text-base" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2.5 h-5 w-5 animate-spin" /> : null}
                Create Free Account
              </Button>
              <div className="text-center text-sm text-slate-400 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-400 font-extrabold hover:underline hover:text-cyan-300 ml-1">
                  Sign in here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
