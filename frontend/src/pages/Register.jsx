import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Loader2, ArrowRight, Check, Mail, KeyRound, ShieldCheck } from 'lucide-react';
import { API_URL } from '../lib/utils';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [track, setTrack] = useState('Fullstack & Cloud Systems Architecture');
  const [experience, setExperience] = useState('Mid-Level Engineer (3-5 Yrs)');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredCredentials, setRegisteredCredentials] = useState(null);
  
  const { setToken } = useStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    if (!cleanEmail || !cleanPassword) {
      setError('Please provide both email address and password');
      return;
    }
    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to register');
      }

      const user = await response.json();
      setRegisteredCredentials({
        email: user.email,
        password: password,
        fullName: fullName || 'Candidate Engineer',
        track: track,
        experience: experience
      });
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Check backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoLoginAfterRegister = async () => {
    if (!registeredCredentials) return;
    setIsLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', registeredCredentials.email);
      formData.append('password', registeredCredentials.password);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDummyRegistration = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFullName("Alex Vance (Certified Candidate)");
    setEmail(`candidate_vance_${randomNum}@vi-scouts.com`);
    setPassword("vancePass2026!");
    setTrack("Distributed Backend & Scalability Engine");
    setExperience("Senior Staff Engineer (6+ Yrs)");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-12">
      <div className="w-full max-w-xl bg-white border-4 border-black p-8 md:p-12 space-y-8 shadow-[8px_8px_0px_0px_#000]">
        {!isSuccess ? (
          <>
            <div className="border-b-4 border-black pb-6 space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-600 font-bold">ENROLLMENT // REGISTRY</p>
                <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-black">
                  Candidate Registration
                </h1>
              </div>
              <button
                type="button"
                onClick={fillDummyRegistration}
                className="font-mono text-[11px] font-bold uppercase tracking-widest border-2 border-black bg-neutral-100 px-3 py-2 hover:bg-black hover:text-white transition-none self-start shrink-0"
              >
                ⚡ Quick-Fill Dummy Info
              </button>
            </div>

            {error && (
              <div className="bg-black text-white font-mono text-xs uppercase p-4 border-2 border-black tracking-wider flex items-center">
                <span className="font-bold mr-2">! ERROR:</span> {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-widest font-bold text-black">
                  Full Candidate Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Prakhar Rai or Alex Vance" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-white border-2 border-black px-4 py-3 text-black font-body placeholder:text-neutral-400 focus:border-b-4 focus:outline-none transition-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest font-bold text-black">
                    Primary Engineering Track
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    className="w-full bg-white border-2 border-black px-4 py-3 text-black font-body text-sm font-medium focus:border-b-4 focus:outline-none transition-none"
                  >
                    <option>Fullstack & Cloud Systems Architecture</option>
                    <option>Distributed Backend & Scalability Engine</option>
                    <option>AI / Machine Learning Infrastructure</option>
                    <option>Frontend Systems & UI/UX Precision</option>
                    <option>System Reliability & SRE Operations</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest font-bold text-black">
                    Seniority Level
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-white border-2 border-black px-4 py-3 text-black font-body text-sm font-medium focus:border-b-4 focus:outline-none transition-none"
                  >
                    <option>Junior / Associate Engineer (0-2 Yrs)</option>
                    <option>Mid-Level Engineer (3-5 Yrs)</option>
                    <option>Senior Staff Engineer (6+ Yrs)</option>
                    <option>Engineering Manager / Tech Lead</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black pt-4">
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest font-bold text-black">
                    Email Address (Login ID)
                  </label>
                  <input 
                    type="email" 
                    placeholder="name@vi-scouts.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white border-2 border-black px-4 py-3 text-black font-body placeholder:text-neutral-400 focus:border-b-4 focus:outline-none transition-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest font-bold text-black">
                    Set Password (Min 6 Chars)
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
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-black text-white font-mono text-sm uppercase tracking-widest font-bold border-2 border-black hover:bg-white hover:text-black transition-none duration-100 flex items-center justify-center disabled:opacity-50 shadow-[4px_4px_0px_0px_#000]"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create Account & Dispatch Credentials <ArrowRight className="ml-2 h-4 w-4 stroke-[1.5]" />
                </button>
              </div>
            </form>

            <div className="border-t border-neutral-300 pt-6 text-center font-mono text-xs uppercase tracking-widest text-neutral-600">
              Already Enrolled?{' '}
              <Link to="/login" className="text-black font-bold underline hover:no-underline ml-1">
                Candidate Login
              </Link>
            </div>
          </>
        ) : (
          /* Credentials Dispatched & Verification Pass Card */
          <div className="space-y-8 py-4">
            <div className="border-b-4 border-black pb-6 flex items-start space-x-4">
              <div className="w-12 h-12 bg-black text-white border-2 border-black flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold uppercase tracking-widest bg-emerald-600 text-white px-2 py-0.5">
                  ENROLLMENT VERIFIED // DISPATCHED
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-black">
                  Credentials Registered Successfully
                </h2>
              </div>
            </div>

            <div className="p-6 border-2 border-black bg-neutral-50 space-y-4">
              <div className="flex items-center space-x-2 text-black font-mono text-xs font-bold uppercase tracking-widest border-b border-black pb-3">
                <Mail className="w-4 h-4" />
                <span>Simulated Dispatch Voucher &rarr; Sent to {registeredCredentials?.email}</span>
              </div>
              
              <p className="font-body text-sm text-neutral-800 leading-relaxed">
                We have registered your profile for <strong>{registeredCredentials?.track}</strong> ({registeredCredentials?.experience}). Below is your official session credential pass for future authentication:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="p-4 border border-black bg-white space-y-1">
                  <span className="text-neutral-500 uppercase tracking-widest block font-bold">LOGIN EMAIL ADDRESS:</span>
                  <span className="text-black font-bold text-sm select-all">{registeredCredentials?.email}</span>
                </div>
                <div className="p-4 border border-black bg-white space-y-1">
                  <span className="text-neutral-500 uppercase tracking-widest block font-bold">ACCOUNT PASSWORD:</span>
                  <span className="text-black font-bold text-sm select-all">{registeredCredentials?.password}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAutoLoginAfterRegister}
                disabled={isLoading}
                className="w-full py-5 bg-black text-white font-mono text-sm font-bold uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-none flex items-center justify-center shadow-[4px_4px_0px_0px_#000]"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Authenticate Immediately & Launch Dashboard &rarr;
              </button>
              
              <Link
                to="/login"
                className="block text-center font-mono text-xs uppercase tracking-widest text-neutral-600 hover:text-black hover:underline py-2"
              >
                Or Return to Standard Candidate Login Screen
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
