import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { ArrowUpRight, LogOut, LayoutDashboard } from 'lucide-react';

export default function Layout() {
  const { token, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] font-body flex flex-col relative selection:bg-black selection:text-white">
      {/* Editorial Top Hairline Banner */}
      <div className="border-b border-black bg-black text-white px-6 py-2 flex items-center justify-between font-mono text-[11px] tracking-widest uppercase">
        <span>VI-SCOUTS // AI PRECISION SUITE v2.0</span>
        <span className="hidden sm:inline">ARCHITECTURE / REDUCTION TO ESSENCE</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-24 items-center justify-between px-6 md:px-12">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-5 h-5 border-2 border-black bg-black group-hover:bg-white transition-none"></div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase">
                VI-SCOUTS
              </span>
              <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase -mt-1">
                Precision Interview Engine
              </span>
            </div>
          </Link>

          <nav aria-label="Main Navigation" className="flex items-center space-x-6 font-mono text-xs md:text-sm uppercase tracking-widest font-bold">
            {token ? (
              <>
                <Link to="/dashboard" className="px-4 py-2.5 border border-black hover:bg-black hover:text-white transition-none flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4 stroke-[1.5]" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 border border-black hover:bg-black hover:text-white transition-none flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4 stroke-[1.5]" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2.5 px-4 hover:underline transition-none">
                  Log in
                </Link>
                <Link to="/register" className="px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-none flex items-center">
                  Get Started <ArrowUpRight className="ml-1 h-4 w-4 stroke-[1.5]" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <Outlet />
      </main>

      {/* Editorial Footer */}
      <footer className="border-t-4 border-black bg-white pt-16 pb-12 mt-24 text-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="space-y-3 max-w-md">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-black border border-black"></div>
              <span className="font-display font-black text-2xl uppercase tracking-tight">VI-SCOUTS PLATFORM</span>
            </div>
            <p className="font-body text-neutral-600 text-sm leading-relaxed">
              Strictly minimal monochrome architectural design system. Built for precision candidates, senior engineers, and rigorous technical leadership.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 font-mono text-xs tracking-widest uppercase">
            <div className="space-y-2">
              <p className="font-bold text-black border-b border-black pb-1">Architecture</p>
              <p className="text-neutral-600">OpenRouter (tencent/hy3:free)</p>
              <p className="text-neutral-600">FastAPI Unified Backend</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-black border-b border-black pb-1">System</p>
              <p className="text-neutral-600">Zero Radius / Pure Monochrome</p>
              <p className="text-neutral-600">&copy; {new Date().getFullYear()} VI-SCOUTS</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
