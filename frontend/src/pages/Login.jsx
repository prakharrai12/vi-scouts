import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Loader2, ArrowRight } from 'lucide-react';
import { API_URL } from '../lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setToken } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

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

  return (
    <div className="flex items-center justify-center min-h-[75vh] py-12">
      <div className="w-full max-w-md bg-white border-2 border-black p-8 md:p-12 space-y-8 shadow-none">
        <div className="border-b-2 border-black pb-6 space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">AUTHENTICATION // MODULE</p>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-black">
            Sign In
          </h1>
        </div>

        {error && (
          <div className="bg-black text-white font-mono text-xs uppercase p-4 border border-black tracking-wider">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-widest font-bold text-black">
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border-2 border-black px-4 py-3 text-black font-body placeholder:text-neutral-400 placeholder:italic focus:border-b-4 focus:outline-none transition-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-widest font-bold text-black">
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border-2 border-black px-4 py-3 text-black font-body placeholder:text-neutral-400 focus:border-b-4 focus:outline-none transition-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black text-white font-mono text-sm uppercase tracking-widest font-bold border-2 border-black hover:bg-white hover:text-black transition-none duration-100 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Authenticate Session <ArrowRight className="ml-2 h-4 w-4 stroke-[1.5]" />
            </button>
          </div>
        </form>

        <div className="border-t border-neutral-300 pt-6 text-center font-mono text-xs uppercase tracking-widest text-neutral-600">
          Unregistered Candidate?{' '}
          <Link to="/register" className="text-black font-bold underline hover:no-underline ml-1">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
