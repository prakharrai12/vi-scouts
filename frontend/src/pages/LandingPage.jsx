import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Shield, Zap, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-28 flex flex-col items-start border-b-4 border-black">
        <div className="w-full mb-6 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-neutral-600 border-b border-black pb-4">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black border border-black inline-block"></span>
            REDUCTION TO ESSENCE // 100% MONOCHROME
          </span>
          <span>OPENROUTER ENGINE (TENCENT/HY3:FREE)</span>
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tight leading-none uppercase text-black mb-8">
          AUSTERE. <br />
          AUTHORITATIVE. <br />
          PRECISION.
          <span className="inline-block w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 border-4 border-black bg-white ml-2 align-baseline"></span>
        </h1>

        <div className="grid md:grid-cols-12 gap-8 w-full border-t border-black pt-8 items-start">
          <div className="md:col-span-6 font-body text-xl md:text-2xl text-black leading-relaxed">
            Every design decision must stand on its own merit. Practice rigorous technical and architectural interviews evaluated by real-time semantic AI without colorful distractions or generic boilerplate.
          </div>
          
          <div className="md:col-span-6 flex flex-col sm:flex-row gap-4 justify-end items-start sm:items-center">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-5 bg-black text-white font-mono text-sm uppercase tracking-widest font-bold border-2 border-black hover:bg-white hover:text-black transition-none duration-100 flex items-center justify-center">
                Initialize Session <ArrowUpRight className="ml-2 h-4 w-4 stroke-[1.5]" />
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-5 bg-transparent text-black font-mono text-sm uppercase tracking-widest font-bold border-2 border-black hover:bg-black hover:text-white transition-none duration-100">
                Candidate Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Inverted Stats Section */}
      <section className="w-full bg-black text-white py-20 px-6 md:px-12 border-b-4 border-black bg-inverted-lines relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div className="border-l-2 border-white pl-6 space-y-2">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">01 // Architectural Depth</p>
            <p className="font-display text-5xl md:text-6xl font-bold tracking-tight">100%</p>
            <p className="font-body text-sm text-neutral-300">Strictly monochrome evaluation isolating pure technical articulation and system design accuracy.</p>
          </div>
          <div className="border-l-2 border-white pl-6 space-y-2">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">02 // Latency & Precision</p>
            <p className="font-display text-5xl md:text-6xl font-bold tracking-tight">&lt;100ms</p>
            <p className="font-body text-sm text-neutral-300">Instant binary UI feedback paired with real-time OpenRouter semantic analysis engine.</p>
          </div>
          <div className="border-l-2 border-white pl-6 space-y-2">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">03 // Scoring Rigor</p>
            <p className="font-display text-5xl md:text-6xl font-bold tracking-tight">0–100</p>
            <p className="font-body text-sm text-neutral-300">Exact quantitative breakdowns of delivery structure, confidence, and communication clarity.</p>
          </div>
        </div>
      </section>

      {/* Editorial Features Grid */}
      <section className="w-full py-24 border-b-4 border-black bg-horizontal-lines">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="border-b-2 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-widest uppercase font-bold text-neutral-500 mb-2">THE DNA OF MINIMALIST MONOCHROME</p>
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-black">
                Uncompromising Architectural Evaluation
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest border border-black px-4 py-2 self-start md:self-auto bg-white">
              SECTION // 02
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-0 border-2 border-black">
            <FeatureCard 
              number="01"
              title="Semantic Evaluation Engine"
              description="Deep analysis of your STAR method alignment, system architecture reasoning, and technical trade-off clarity."
            />
            <FeatureCard 
              number="02"
              title="Resume Parsing & Generation"
              description="Upload your PDF resume to instantly extract key technical domains and generate 5 rigorous, tailored challenge prompts."
            />
            <FeatureCard 
              number="03"
              title="Score Trajectory Analytics"
              description="Quantitative monitoring across recent sessions showing exact percentage improvements over time."
            />
          </div>
        </div>
      </section>

      {/* Editorial Pull Quote Section */}
      <section className="w-full py-28 border-b-4 border-black bg-grid-pattern text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">EXPERT CANDIDATE TESTIMONIAL</p>
          <blockquote className="font-display italic text-3xl md:text-5xl leading-tight text-black">
            “The monochrome discipline forces you to focus strictly on your words, structure, and technical merit. It is the gold standard for engineering preparation.”
          </blockquote>
          <div className="pt-4 border-t border-black inline-block px-8">
            <p className="font-mono text-xs uppercase tracking-widest font-bold">SR. DISTRIBUTED SYSTEMS ARCHITECT</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ number, title, description }) {
  return (
    <div className="group bg-white p-8 md:p-12 border border-black transition-colors duration-100 hover:bg-black hover:text-white flex flex-col justify-between min-h-[320px]">
      <div className="flex items-center justify-between border-b border-neutral-300 group-hover:border-neutral-700 pb-4 mb-6">
        <span className="font-mono text-sm font-bold tracking-widest">{number} // MODULE</span>
        <span className="w-3 h-3 border border-black group-hover:border-white group-hover:bg-white transition-none"></span>
      </div>
      <div>
        <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight mb-4 group-hover:text-white transition-none">
          {title}
        </h3>
        <p className="font-body text-neutral-600 group-hover:text-neutral-300 text-base leading-relaxed transition-none">
          {description}
        </p>
      </div>
    </div>
  );
}
