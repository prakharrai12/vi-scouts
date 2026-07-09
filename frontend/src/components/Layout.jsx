import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Button } from './ui/Button';
import { Brain, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

export default function Layout() {
  const { token, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050b14] bg-gradient-to-b from-[#050b14] via-[#081222] to-[#050b14] font-sans text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background ambient glowing cyan/teal blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-[#070f1e]/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(6,182,212,0.1)]">
        <div className="max-w-7xl mx-auto flex h-22 items-center justify-between px-6 sm:px-8">
          <Link to="/" className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105 group">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-cyan-500 via-teal-400 to-cyan-300 p-3 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] text-slate-950 flex items-center justify-center font-extrabold group-hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all">
                <Brain className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-cyan-gradient">
                  VI-SCOUTS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400/80 -mt-1 flex items-center">
                  <Sparkles className="h-2.5 w-2.5 mr-1 text-teal-400 animate-pulse" /> AI Precision Suite
                </span>
              </div>
            </div>
          </Link>

          <nav className="flex items-center space-x-4 sm:space-x-5">
            {token ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-slate-200 font-bold hover:text-cyan-300 hover:bg-cyan-500/10 h-11 px-5 rounded-xl transition-all">
                    <LayoutDashboard className="mr-2.5 h-4 w-4 text-cyan-400" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout} className="text-slate-300 border-slate-700/80 bg-slate-900/60 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/40 h-11 px-5 rounded-xl transition-all font-bold">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-slate-200 font-bold hover:bg-cyan-500/10 hover:text-cyan-300 h-11 px-6 rounded-xl transition-all">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black tracking-wide h-11 px-7 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.55)] transition-all transform hover:-translate-y-0.5">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-10 sm:py-12">
        <Outlet />
      </main>
      
      <footer className="border-t border-cyan-500/20 bg-[#070f1e]/90 backdrop-blur-md py-10 mt-16 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Brain className="h-5 w-5" />
            </div>
            <span className="font-extrabold tracking-wide text-slate-200">VI-SCOUTS PLATFORM</span>
            <span className="text-slate-500 font-medium">&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-8 text-xs font-semibold tracking-wider uppercase text-cyan-400/80">
            <span className="hover:text-cyan-300 transition-colors cursor-pointer">AI Precision Analytics</span>
            <span className="text-slate-600">•</span>
            <span className="hover:text-cyan-300 transition-colors cursor-pointer">Semantic Scoring Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
