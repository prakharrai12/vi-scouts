import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { BrainCircuit, Target, TrendingUp, Sparkles, ShieldCheck, Zap, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28 lg:py-36 flex flex-col items-center text-center relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-teal-500/15 to-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[900px] space-y-10 flex flex-col items-center"
        >
          <div className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-950/60 px-5 py-2 text-xs sm:text-sm font-extrabold text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-md">
            <Sparkles className="mr-2 h-4 w-4 text-teal-300 animate-pulse" />
            VI-SCOUTS Next-Gen Candidate Assessment & Training
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="my-4"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-cyan-300 p-6 shadow-[0_0_50px_rgba(6,182,212,0.4)] flex items-center justify-center text-slate-950 transform hover:rotate-3 transition-transform duration-300">
              <BrainCircuit className="w-full h-full stroke-[2]" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-100 leading-[1.15]">
            Elevate Your Career with <br />
            <span className="text-cyan-gradient">
              AI Precision Coaching
            </span>
          </h1>
          
          <p className="mx-auto max-w-[720px] text-base sm:text-lg text-slate-300 md:text-xl leading-relaxed font-normal">
            Practice realistic technical, behavioral, and architectural interviews. Receive deep semantic feedback on clarity, confidence, and structure from our real-time evaluation engine.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4 w-full sm:w-auto px-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg h-14 px-10 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-0.5">
                Start Practicing Free <ArrowRight className="ml-2.5 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg h-14 px-10 rounded-2xl border-cyan-500/40 bg-slate-900/80 text-cyan-300 font-bold hover:bg-cyan-500/15 transition-all">
                Login with Demo ID
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-teal-400" /> Instant AI Feedback</span>
            <span className="flex items-center"><Zap className="mr-2 h-4 w-4 text-cyan-400" /> 100+ Practice Scenarios</span>
            <span className="flex items-center"><Award className="mr-2 h-4 w-4 text-cyan-300" /> Confidence & Scoring Analytics</span>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-slate-900/80 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-cyan-500/20 my-12 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-slate-100">
              Why Top Candidates Choose VI-SCOUTS
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-normal">
              Our structured AI evaluation engine pinpoints your blind spots before your real interview does.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BrainCircuit className="h-8 w-8 stroke-[2.5]" />}
              badge="Deep AI Engine"
              title="Semantic Analysis"
              description="Our evaluation engine dissects technical depth, STAR-method alignment, and architectural soundness in real time."
            />
            <FeatureCard 
              icon={<Target className="h-8 w-8 stroke-[2.5]" />}
              badge="Precise Scoring"
              title="Confidence & Clarity Metrics"
              description="Receive objective 0–100% scores measuring both your delivery structure and your technical articulation."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-8 w-8 stroke-[2.5]" />}
              badge="Continuous Growth"
              title="Assessment Tracking"
              description="Maintain a detailed history of your answers, track score trajectories, and review customized expert tips."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, badge, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-start p-8 sm:p-10 rounded-3xl bg-slate-950/60 border border-slate-800 shadow-sm hover:shadow-[0_10px_35px_rgba(6,182,212,0.15)] hover:border-cyan-400/60 transition-all group backdrop-blur-md"
    >
      <div className="flex items-center justify-between w-full mb-6">
        <div className="p-4 bg-cyan-500/15 rounded-2xl shadow-inner border border-cyan-500/30 text-cyan-400 group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-teal-400 group-hover:text-slate-950 transition-all">
          {icon}
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300 bg-cyan-500/20 px-3.5 py-1 rounded-full border border-cyan-500/40">
          {badge}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-cyan-300 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">{description}</p>
    </motion.div>
  );
}
