import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Loader2, ArrowRight, RefreshCw, Check } from 'lucide-react';
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
    <div className="space-y-12 py-6">
      {/* Editorial Header & Prompt Selector */}
      <div className="border-4 border-black bg-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 font-mono text-xs uppercase tracking-widest text-neutral-500">
            <span>ASSESSMENT SESSION #{id}</span>
            <span>//</span>
            <span>{currentItem.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-black">
            Rigorous Interview Room
          </h1>
        </div>
        
        <div className="flex items-center flex-wrap gap-2">
          {QUESTIONS_BY_CATEGORY.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setQuestionIdx(i);
                setAnswer('');
                setFeedback(null);
              }}
              className={`w-10 h-10 font-mono text-xs font-bold transition-none border border-black flex items-center justify-center ${
                questionIdx === i 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {!feedback ? (
        <div className="border-4 border-black bg-white space-y-0">
          <div className="p-8 md:p-12 border-b-2 border-black space-y-6 bg-horizontal-lines">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="font-mono text-xs font-bold uppercase tracking-widest border border-black bg-white px-3 py-1">
                PROMPT #{questionIdx + 1} // AI EVALUATION ENGINE
              </span>
              <button 
                type="button"
                onClick={fillSampleAnswer}
                disabled={isSubmitting}
                className="font-mono text-xs font-bold uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-none duration-100 self-start sm:self-auto"
              >
                Insert High-Scoring Benchmark Answer &rarr;
              </button>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black leading-tight text-black">
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
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating via OpenRouter...</>
                  ) : (
                    <>Submit For Assessment &rarr;</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Evaluation Banner */}
          <div className="border-4 border-black bg-black text-white p-8 rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-inverted-lines">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-black bg-white">
            <div className="p-10 border-b md:border-b-0 md:border-r-2 border-black flex flex-col items-center justify-center text-center space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600">CONFIDENCE & RIGOR SCORE</span>
              <div className="text-7xl font-display font-black text-black my-2">
                {feedback.confidence_score}<span className="text-3xl">%</span>
              </div>
            </div>
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600">COMMUNICATION & CLARITY SCORE</span>
              <div className="text-7xl font-display font-black text-black my-2">
                {feedback.communication_score}<span className="text-3xl">%</span>
              </div>
            </div>
          </div>

          {/* Feedback Monograph Content */}
          <div className="border-4 border-black bg-white divide-y-4 divide-black">
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
              className="px-10 py-5 bg-black text-white font-mono text-sm uppercase tracking-widest font-bold border-2 border-black hover:bg-white hover:text-black transition-none duration-100 flex items-center justify-center"
            >
              {questionIdx < QUESTIONS_BY_CATEGORY.length - 1 ? (
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
