import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Loader2, Send, CheckCircle2, AlertTriangle, Lightbulb, Sparkles, Brain, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../lib/utils';

const QUESTIONS_BY_CATEGORY = [
  {
    category: "System Design & Scalability",
    question: "How would you design a distributed web application capable of handling 10 million daily active users with sub-100ms latency?",
    sampleAnswer: "I would adopt a microservices architecture behind a global Content Delivery Network (CDN) like Cloudflare for static assets and edge caching. For dynamic traffic, I would use an AWS API Gateway with rate-limiting leading to horizontally scaled Kubernetes clusters running stateless services. For data persistence, a sharded PostgreSQL database with read replicas would handle relational queries, combined with Redis clustered caching for hot key retrieval and Kafka for asynchronous background job processing."
  },
  {
    category: "Technical & Debugging",
    question: "Tell me about a time you had to diagnose and resolve a severe performance bottleneck or production outage.",
    sampleAnswer: "During a peak shopping event, our checkout API latency spiked to over 6 seconds, causing cart abandonments. I immediately checked Datadog APM traces and noticed a high database wait time. Using EXPLAIN ANALYZE on our ORM queries, I discovered an N+1 query loop fetching user discount codes without proper indexing. I deployed a hotfix adding a composite database index and refactored the ORM to eager loading. Latency dropped by 92% to under 250ms within 20 minutes."
  },
  {
    category: "Behavioral & Leadership",
    question: "How do you handle severe disagreements regarding architectural or design trade-offs with senior team members?",
    sampleAnswer: "I believe strong engineering culture relies on objective discussions rather than subjective opinions. When a senior colleague and I disagreed on whether to use GraphQL or REST for our mobile backend, I proposed writing a small benchmark comparing payload sizes and client caching complexity. We reviewed the quantitative results together with the team, agreed that REST with custom field masks best fit our timeline, and aligned smoothly without any personal friction."
  },
  {
    category: "Frontend Architecture",
    question: "Describe your approach to state management, re-render optimization, and bundle splitting in a large React application.",
    sampleAnswer: "For global server state, I utilize TanStack React Query for automated caching and background synchronization. For lightweight UI state, I use atomic stores like Zustand to avoid unnecessary context re-render cascades. To optimize bundle performance, I implement route-level code splitting via React.lazy and Suspense, coupled with memoization using useMemo and React.memo strictly where React DevTools Profiler indicates render cost anomalies."
  },
  {
    category: "Backend & RESTful APIs",
    question: "What strategies do you use to ensure REST API idempotency, versioning, and robust rate-limiting in production environments?",
    sampleAnswer: "To guarantee idempotency for POST/PUT endpoints, I require clients to include an Idempotency-Key header stored in Redis with a 24-hour TTL, ensuring retry requests return the cached response without duplicate side effects. For versioning, I prefer URL path prefixing (/api/v1/) combined with semantic deprecation headers. For rate-limiting, I implement token bucket algorithms at the API Gateway layer using Redis sliding window counters per authenticated user ID."
  },
  {
    category: "Data Structures & Algorithms",
    question: "Explain the difference between optimistic and pessimistic concurrency control in database transactions, and when to choose each.",
    sampleAnswer: "Pessimistic concurrency locks database records when read, preventing simultaneous updates until the transaction commits, which is ideal for high-collision scenarios like inventory reservation or financial ledger balances. Optimistic concurrency uses a version timestamp or hash column to detect conflicts at commit time, avoiding expensive read locks, making it superior for read-heavy or low-collision web workflows like user profile updates."
  },
  {
    category: "DevOps & Cloud Resilience",
    question: "How do you structure zero-downtime deployment pipelines for stateful services and schema migrations?",
    sampleAnswer: "I follow the expand-and-contract (blue/green) pattern for database schema evolutions. First, we expand the schema by adding nullable columns or views without breaking old code. Next, we deploy application v2 using rolling Kubernetes pods with health probes to write to both columns. Finally, after data backfill verification, we deploy v3 to contract and drop the old legacy column, ensuring continuous zero-downtime availability throughout the transition."
  },
  {
    category: "AI & Machine Learning Systems",
    question: "How do you mitigate LLM hallucination and ensure factual accuracy when building production Retrieval-Augmented Generation (RAG) pipelines?",
    sampleAnswer: "To mitigate hallucinations, I design a multi-stage RAG pipeline using hybrid retrieval (BM25 sparse + dense embeddings via vector search like pgvector/Pinecone), followed by a re-ranker model like Cohere to select the top 5 highest-relevance chunks. In the LLM prompt, I enforce strict system constraints instructing the model to rely exclusively on context and cite specific chunk IDs, combining automated factual verification checks and semantic similarity evaluations before presenting answers to end users."
  }
];

export default function InterviewRoom() {
  const { id } = useParams();
  const { token } = useStore();
  const navigate = useNavigate();
  
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const currentItem = QUESTIONS_BY_CATEGORY[questionIdx];
  const currentQuestion = currentItem.question;

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
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
    } catch (error) {
      console.error(error);
      alert("Evaluation failed. Please make sure the backend API is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (questionIdx < QUESTIONS_BY_CATEGORY.length - 1) {
      setQuestionIdx(prev => prev + 1);
      setAnswer('');
      setFeedback(null);
    } else {
      navigate('/dashboard');
    }
  };

  const fillSampleAnswer = () => {
    setAnswer(currentItem.sampleAnswer);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-900/85 p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-[0_4px_30px_rgba(6,182,212,0.15)] backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-cyan-300 text-slate-950 flex items-center justify-center font-black shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0">
            <Brain className="h-7 w-7 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">VI-SCOUTS AI Assessment Room</h1>
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-extrabold text-cyan-400 uppercase tracking-widest">
              {currentItem.category}
            </div>
          </div>
        </div>
        
        <div className="flex items-center flex-wrap gap-2.5 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
          {QUESTIONS_BY_CATEGORY.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setQuestionIdx(i);
                setAnswer('');
                setFeedback(null);
              }}
              className={`w-10 h-10 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                questionIdx === i 
                  ? 'bg-gradient-to-tr from-cyan-500 via-teal-400 to-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105' 
                  : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800 hover:text-cyan-300 border border-slate-800'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!feedback ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-8"
          >
            <Card className="border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden bg-slate-900/80 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 p-8 sm:p-10 pb-8 border-b border-cyan-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300 bg-cyan-500/20 px-4 py-1.5 rounded-full border border-cyan-500/40 self-start sm:self-auto">
                    Interview Prompt #{questionIdx + 1}
                  </span>
                  <button 
                    type="button"
                    onClick={fillSampleAnswer}
                    disabled={isSubmitting}
                    className="flex items-center justify-center text-xs sm:text-sm font-extrabold text-cyan-300 hover:text-cyan-100 bg-cyan-950/70 hover:bg-cyan-900/90 px-4 py-2 rounded-xl border border-cyan-500/40 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] self-start sm:self-auto"
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-teal-300 animate-pulse" />
                    Insert High-Scoring Sample Answer
                  </button>
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-slate-100 leading-relaxed font-black pt-2">
                  "{currentQuestion}"
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-8 sm:p-10 pt-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                      Your Candidate Response
                    </label>
                    <textarea
                      className="w-full min-h-[260px] p-6 rounded-2xl border border-slate-700/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/15 resize-y transition-all shadow-inner bg-[#040810]/90 text-slate-100 leading-relaxed font-normal text-base sm:text-lg placeholder:text-slate-500"
                      placeholder="Type or insert your response here... Be detailed, reference practical trade-offs, metrics, and use STAR structure."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-800/80">
                    <div className="text-sm text-slate-400 font-medium flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-2.5 animate-pulse"></span>
                      Pro-tip: Include concrete metrics (e.g. "reduced latency by 85%") for higher evaluation scores.
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !answer.trim()}
                      className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black tracking-wide rounded-2xl px-10 h-14 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] transition-all transform hover:-translate-y-0.5 text-base shrink-0"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="mr-2.5 h-5 w-5 animate-spin" /> Running AI Evaluation...</>
                      ) : (
                        <><Send className="mr-2.5 h-5 w-5" /> Submit for AI Assessment</>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-8 rounded-3xl border border-cyan-500/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-[0_0_35px_rgba(6,182,212,0.25)] gap-6 backdrop-blur-xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal-500/20 rounded-2xl border border-teal-400/40 text-teal-300 shrink-0">
                  <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-100">AI Evaluation Complete</h3>
                  <p className="text-sm text-cyan-300/80 mt-0.5">Comprehensive semantic assessment generated by VI-SCOUTS Engine.</p>
                </div>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="flex items-center text-sm font-bold bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 px-5 py-3 rounded-2xl transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0 self-stretch sm:self-auto justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Re-answer Prompt
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <ScoreCard title="Confidence & Delivery Score" score={feedback.confidence_score} color="emerald" />
              <ScoreCard title="Communication & Clarity Score" score={feedback.communication_score} color="cyan" />
            </div>

            <Card className="border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden bg-slate-900/85 backdrop-blur-xl">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                <div className="p-8 sm:p-10 bg-teal-950/30 space-y-4">
                  <h3 className="font-extrabold text-teal-300 flex items-center text-lg">
                    <div className="p-2 bg-teal-500/20 rounded-xl mr-3 text-teal-400">
                      <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    Key Strengths Identified
                  </h3>
                  <p className="text-slate-200 leading-relaxed text-base">{feedback.strengths}</p>
                </div>
                <div className="p-8 sm:p-10 bg-amber-950/25 space-y-4">
                  <h3 className="font-extrabold text-amber-300 flex items-center text-lg">
                    <div className="p-2 bg-amber-500/20 rounded-xl mr-3 text-amber-400">
                      <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    Areas for Refinement
                  </h3>
                  <p className="text-slate-200 leading-relaxed text-base">{feedback.weaknesses}</p>
                </div>
              </div>
              <div className="p-8 sm:p-10 bg-cyan-950/40 border-t border-slate-800 space-y-4">
                <h3 className="font-extrabold text-cyan-300 flex items-center text-lg">
                  <div className="p-2 bg-cyan-500/20 rounded-xl mr-3 text-cyan-400">
                    <Lightbulb className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  Expert Coaching Tips & Actionable Frameworks
                </h3>
                <p className="text-slate-200 leading-relaxed text-base">{feedback.tips}</p>
              </div>
            </Card>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} size="lg" className="bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 rounded-2xl px-10 h-14 font-black tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.35)]">
                {questionIdx < QUESTIONS_BY_CATEGORY.length - 1 ? (
                  <>Next Assessment Question <ArrowRight className="ml-2.5 h-5 w-5" /></>
                ) : (
                  <>Finish & Return to Dashboard <CheckCircle2 className="ml-2.5 h-5 w-5" /></>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreCard({ title, score, color }) {
  const colorMap = {
    emerald: "text-teal-300 bg-gradient-to-br from-teal-950/50 via-slate-900 to-slate-900 border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.15)]",
    cyan: "text-cyan-300 bg-gradient-to-br from-cyan-950/50 via-slate-900 to-slate-900 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]",
  };
  
  return (
    <Card className={`${colorMap[color]} rounded-3xl border backdrop-blur-xl`}>
      <CardContent className="p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-3">
        <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{title}</div>
        <div className="text-6xl font-black tracking-tight my-2 bg-gradient-to-r from-white via-cyan-200 to-teal-300 bg-clip-text text-transparent">
          {score}<span className="text-3xl font-bold opacity-70 text-cyan-400 ml-1">%</span>
        </div>
      </CardContent>
    </Card>
  );
}
