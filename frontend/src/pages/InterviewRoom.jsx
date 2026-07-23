import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Loader2, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { API_URL } from '../lib/utils';

export default function InterviewRoom() {
  const { id } = useParams();
  const { token } = useStore();
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/interviews/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSessionData(data);
          if (data?.questions && data.questions.length > 0) {
            const firstQ = data.questions[0];
            const existing = data.feedbacks?.find(f => f.question === firstQ);
            if (existing) {
              setFeedback(existing);
              setAnswer(existing.answer || '');
            }
          }
        } else {
          console.error("Failed to fetch session");
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchSession();
  }, [id, token]);

  const questionsList = (sessionData?.questions && sessionData.questions.length > 0)
    ? sessionData.questions
    : [
        "How would you architect a horizontally scalable distributed web application capable of handling 10 million daily active users with sub-100ms P99 latency globally?",
        "Walk me through your diagnostic methodology when a high-throughput relational database encounters sudden connection starvation and severe query latency spikes under peak load.",
        "Describe how you design multi-region disaster recovery (DR) strategies with strict RPO=0 and RTO<60 seconds without doubling infrastructure operational expenses.",
        "Explain how you design zero-downtime database schema evolutions and stateful service migrations across rolling Kubernetes cluster deployments.",
        "How do you implement distributed tracing, rate-limiting token buckets, and circuit breaking at the API Gateway tier to protect downstream microservices?"
      ];

  const currentQuestion = questionsList[questionIdx] || questionsList[0] || "";
  const categoryName = sessionData?.category || "General Technical & Architecture";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/interviews/${id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: currentQuestion,
          answer: answer
        })
      });

      if (!response.ok) throw new Error('Failed to get feedback from server');
      
      const data = await response.json();
      setFeedback(data);
      // Refresh session data to reflect newly saved feedback
      const res = await fetch(`${API_URL}/api/interviews/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = await res.json();
        setSessionData(updated);
      }
    } catch (error) {
      console.error(error);
      alert("Evaluation failed. Please make sure the backend API is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (questionIdx < questionsList.length - 1) {
      const nextIdx = questionIdx + 1;
      setQuestionIdx(nextIdx);
      const nextQ = questionsList[nextIdx];
      const existing = sessionData?.feedbacks?.find(f => f.question === nextQ);
      setFeedback(existing || null);
      setAnswer(existing?.answer || '');
    } else {
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 py-12">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-black">Loading Real AI Assessment Room #{id}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-6">
      {/* Editorial Header & Prompt Selector */}
      <div className="border-4 border-black bg-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[4px_4px_0px_0px_#000]">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 font-mono text-xs uppercase tracking-widest text-neutral-600 font-bold">
            <span className="bg-black text-white px-2 py-0.5">SESSION #{id}</span>
            <span>//</span>
            <span>{categoryName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-black">
            Rigorous Interview Room
          </h1>
        </div>
        
        <div className="flex items-center flex-wrap gap-2">
          {questionsList.map((qText, i) => {
            const isEvaluated = sessionData?.feedbacks?.some(f => f.question === qText);
            return (
              <button
                key={i}
                onClick={() => {
                  setQuestionIdx(i);
                  const existing = sessionData?.feedbacks?.find(f => f.question === qText);
                  setFeedback(existing || null);
                  setAnswer(existing?.answer || '');
                }}
                className={`w-10 h-10 font-mono text-xs font-bold transition-none border border-black flex items-center justify-center relative ${
                  questionIdx === i 
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_#22d3ee]' 
                    : isEvaluated
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
                title={qText}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {!feedback ? (
        <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000]">
          {/* High-Contrast Faint-Free Question Banner */}
          <div className="p-8 md:p-12 border-b-4 border-black bg-[#111111] text-white space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="font-mono text-xs font-bold uppercase tracking-widest border border-white bg-black text-white px-3 py-1.5 shadow-[2px_2px_0px_0px_#22d3ee]">
                PROMPT #{questionIdx + 1} // AI EVALUATION ENGINE
              </span>
              <button 
                type="button"
                onClick={() => setAnswer("To architect a highly resilient, distributed system capable of handling strict P99 latency SLAs, I implement a multi-stage approach. First, at the edge tier, I utilize Cloudflare anycast routing to offload static assets and TLS termination. For the application layer, horizontally auto-scaled Kubernetes pods run stateless Go/Node APIs behind an API Gateway enforcing token-bucket rate limiting via Redis cluster. For data persistence, a sharded PostgreSQL architecture separates read replicas from high-throughput master writers, while Kafka buffers background asynchronous events and outbox domain workflows, ensuring strict zero-data-loss durability and sub-100ms end-user responses.")}
                disabled={isSubmitting}
                className="font-mono text-xs font-bold uppercase tracking-widest border border-white bg-neutral-900 text-neutral-300 px-4 py-2 hover:bg-white hover:text-black transition-none duration-100 self-start sm:self-auto"
              >
                Insert High-Scoring Reference Structure &rarr;
              </button>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black leading-tight text-white tracking-normal drop-shadow-sm">
              &ldquo;{currentQuestion}&rdquo;
            </h2>
          </div>
          
          <div className="p-8 md:p-12 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block font-mono text-xs uppercase tracking-widest font-bold text-black">
                  Candidate Articulation & Architectural Trade-offs
                </label>
                <textarea
                  className="w-full min-h-[300px] p-6 border-2 border-black bg-white font-body text-black text-base md:text-lg leading-relaxed placeholder:text-neutral-400 placeholder:italic focus:border-b-8 focus:outline-none transition-none"
                  placeholder="Detail your structured response here... Ensure explicit mention of latency trade-offs, quantifiable impact metrics, and STAR progression."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-black">
                <div className="font-mono text-xs text-neutral-600 font-medium">
                  Word Count: {answer.trim() ? answer.trim().split(/\s+/).length : 0} words
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !answer.trim()}
                  className="w-full sm:w-auto px-10 py-5 bg-black text-white font-mono text-sm uppercase tracking-widest font-bold border-2 border-black hover:bg-white hover:text-black transition-none duration-100 flex items-center justify-center disabled:opacity-50 shrink-0"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating via OpenRouter Engine...</>
                  ) : (
                    <>Submit For AI Assessment &rarr;</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Evaluation Banner */}
          <div className="border-4 border-black bg-black text-white p-8 rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-inverted-lines shadow-[6px_6px_0px_0px_#000]">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">EVALUATION REPORT // GENERATED</span>
              <h2 className="text-3xl font-display font-black uppercase text-white">Semantic Assessment Complete</h2>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="px-6 py-3 border border-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-none duration-100 flex items-center shrink-0"
            >
              <RefreshCw className="h-3 w-3 mr-2" /> Retry Prompt
            </button>
          </div>

          {/* Scores Monograph Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000]">
            <div className="p-10 border-b md:border-b-0 md:border-r-2 border-black flex flex-col items-center justify-center text-center space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600">CONFIDENCE & RIGOR SCORE</span>
              <div className="text-7xl font-display font-black text-black my-2">
                {feedback?.confidence_score ?? 0}<span className="text-3xl">%</span>
              </div>
            </div>
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600">COMMUNICATION & CLARITY SCORE</span>
              <div className="text-7xl font-display font-black text-black my-2">
                {feedback?.communication_score ?? 0}<span className="text-3xl">%</span>
              </div>
            </div>
          </div>

          {/* Feedback Monograph Content */}
          <div className="border-4 border-black bg-white divide-y-4 divide-black shadow-[6px_6px_0px_0px_#000]">
            <div className="p-8 md:p-12 space-y-4">
              <div className="flex items-center space-x-3 border-b border-black pb-3">
                <Check className="h-5 w-5 stroke-[2.5]" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-black">
                  01 // KEY STRENGTHS IDENTIFIED
                </h3>
              </div>
              <p className="font-body text-lg leading-relaxed text-neutral-800 pt-2">
                {feedback.strengths}
              </p>
            </div>

            <div className="p-8 md:p-12 space-y-4">
              <div className="flex items-center space-x-3 border-b border-black pb-3">
                <span className="font-mono text-xs font-bold px-1.5 py-0.5 border border-black">!</span>
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-black">
                  02 // AREAS FOR REFINEMENT
                </h3>
              </div>
              <p className="font-body text-lg leading-relaxed text-neutral-800 pt-2">
                {feedback.weaknesses}
              </p>
            </div>

            <div className="p-8 md:p-12 space-y-4 bg-neutral-50">
              <div className="flex items-center space-x-3 border-b border-black pb-3">
                <span className="font-mono text-xs font-bold px-1.5 py-0.5 border border-black">&rarr;</span>
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-black">
                  03 // EXPERT COACHING FRAMEWORKS & ACTIONABLE TIPS
                </h3>
              </div>
              <p className="font-body text-lg leading-relaxed text-neutral-800 pt-2">
                {feedback.tips}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleNext} 
              className="px-10 py-5 bg-black text-white font-mono text-sm uppercase tracking-widest font-bold border-2 border-black hover:bg-white hover:text-black transition-none duration-100 flex items-center justify-center shadow-[4px_4px_0px_0px_#000]"
            >
              {questionIdx < questionsList.length - 1 ? (
                <>Next Assessment Question &rarr;</>
              ) : (
                <>Return to Dashboard &rarr;</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
