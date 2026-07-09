import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
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

      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Check backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] py-12">
      <div className="w-full max-w-md bg-white border-2 border-black p-8 md:p-12 space-y-8 shadow-none">
        <div className="border-b-2 border-black pb-6 space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">ENROLLMENT // MODULE</p>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-black">
            Register
          </h1>
        </div>

        {error && (
          <div className="bg-black text-white font-mono text-xs uppercase p-4 border border-black tracking-wider">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
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
              Password (Min. 6 Characters)
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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
              Create Candidate Account <ArrowRight className="ml-2 h-4 w-4 stroke-[1.5]" />
            </button>
          </div>
        </form>

        <div className="border-t border-neutral-300 pt-6 text-center font-mono text-xs uppercase tracking-widest text-neutral-600">
          Already Enrolled?{' '}
          <Link to="/login" className="text-black font-bold underline hover:no-underline ml-1">
            Candidate Login
          </Link>
        </div>
      </div>
    </div>
  );
}
