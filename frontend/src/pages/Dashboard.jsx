import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { ArrowUpRight, Upload, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { API_URL } from '../lib/utils';

export default function Dashboard() {
  const { token } = useStore();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/interviews/history`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [token, navigate]);

  const startNewInterview = async (category = "General Technical & Architecture", customQuestions = null) => {
    try {
      const bodyPayload = {
        category: typeof category === 'string' ? category : "General Technical & Architecture",
        questions: customQuestions || (resumeData?.tailored_questions ? resumeData.tailored_questions : null)
      };
      const response = await fetch(`${API_URL}/api/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload)
      });
      if (response.ok) {
        const data = await response.json();
        navigate(`/interview/${data.id}`);
      }
    } catch (error) {
      console.error("Failed to start interview:", error);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError('');
    setResumeData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_URL}/api/resume/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        setResumeData(data);
      } else {
        const err = await response.json();
        setUploadError(err.detail || 'Failed to process resume');
      }
    } catch (error) {
      setUploadError('Network error uploading resume PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const allFeedbacks = history.flatMap(session => session.feedbacks || []);
  const totalQuestions = allFeedbacks.length;
  const avgConfidence = totalQuestions > 0
    ? Math.round(allFeedbacks.reduce((acc, curr) => acc + (curr.confidence_score || 0), 0) / totalQuestions)
    : "—";
  const avgCommunication = totalQuestions > 0
    ? Math.round(allFeedbacks.reduce((acc, curr) => acc + (curr.communication_score || 0), 0) / totalQuestions)
    : "—";

  return (
    <div className="space-y-16 py-4">
      {/* Editorial Banner */}
      <div className="border-4 border-black bg-white p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-block border border-black px-3 py-1 font-mono text-xs uppercase tracking-widest font-bold bg-neutral-100">
              CANDIDATE DASHBOARD // REAL-TIME OPENROUTER AI
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase text-black leading-none">
              Assessment Hub
            </h1>
            <p className="font-body text-neutral-600 text-lg leading-relaxed">
              Step into high-stakes architectural, behavioral, and system design interviews. All responses strictly evaluated without colorful padding or grade inflation.
            </p>
          </div>
          <button 
            onClick={() => startNewInterview("General Technical & Architecture")} 
            className="w-full sm:w-auto px-8 py-5 bg-black text-white font-mono text-sm uppercase tracking-widest font-bold border-2 border-black hover:bg-white hover:text-black transition-none duration-100 flex items-center justify-center shrink-0"
          >
            Launch Interview Session <ArrowUpRight className="ml-2 h-4 w-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-2 border-black bg-white">
        <div className="p-8 border-b sm:border-b-0 sm:border-r border-black space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-500">TOTAL SESSIONS RUN</p>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-5xl font-black">{history.length}</span>
            <span className="font-mono text-xs text-neutral-600 border border-black px-2 py-0.5">{totalQuestions} Qs Evaluated</span>
          </div>
        </div>
        
        <div className="p-8 border-b sm:border-b-0 sm:border-r border-black space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-500">AVG CONFIDENCE RATING</p>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-5xl font-black">{avgConfidence}{totalQuestions > 0 ? '%' : ''}</span>
            <span className="font-mono text-xs text-black border border-black bg-neutral-100 px-2 py-0.5">Delivery Rigor</span>
          </div>
        </div>

        <div className="p-8 space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-500">AVG COMMUNICATION CLARITY</p>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-5xl font-black">{avgCommunication}{totalQuestions > 0 ? '%' : ''}</span>
            <span className="font-mono text-xs text-black border border-black bg-neutral-100 px-2 py-0.5">Structure Score</span>
          </div>
        </div>
      </div>

      {/* Resume PDF Upload & Custom Question Generator */}
      <div className="border-4 border-black bg-white p-8 md:p-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-black pb-8">
          <div className="space-y-2">
            <div className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-500">
              SEMANTIC PDF PARSER // MODULE 01
            </div>
            <h2 className="text-3xl font-display font-black uppercase text-black">Upload Resume (.PDF)</h2>
            <p className="font-body text-neutral-600 text-base max-w-2xl">
              OpenRouter extracts your core engineering competencies and formulates exactly 5 highly targeted, challenging technical questions based on your background.
            </p>
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center justify-center px-8 py-4 bg-black text-white font-mono text-xs uppercase tracking-widest font-bold border-2 border-black hover:bg-white hover:text-black transition-none duration-100">
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4 stroke-[1.5]" />}
              {isUploading ? "Processing PDF..." : "Select Resume File"}
              <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" disabled={isUploading} />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="p-4 border-2 border-black bg-black text-white font-mono text-xs uppercase tracking-widest font-bold text-center">
            ERROR: {uploadError}
          </div>
        )}

        {resumeData && (
          <div className="space-y-8 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-2 border-black bg-neutral-100">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-black shrink-0 stroke-[2]" />
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-600">Document Processed</span>
                  <div className="text-lg font-bold font-body">{resumeData.filename} ({resumeData.word_count} words verified)</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 border border-black bg-white px-5 py-3">
                <span className="font-mono text-xs uppercase tracking-widest font-bold">AI Readiness Rating:</span>
                <span className="font-display text-2xl font-black">{resumeData.readiness_score}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest font-bold block">Extracted Core Competencies:</span>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills_extracted?.map((skill, i) => (
                  <span key={i} className="px-4 py-2 border border-black bg-white font-mono text-xs font-bold uppercase tracking-wider">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <span className="font-mono text-xs uppercase tracking-widest font-bold block border-b border-black pb-2">
                Tailored Questions Generated via OpenRouter (Click to Launch):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
                {resumeData.tailored_questions?.map((q, idx) => (
                  <div key={idx} onClick={() => startNewInterview("Resume Tailored Competency Track", [q, ...resumeData.tailored_questions.filter(item => item !== q)])} className="group cursor-pointer p-6 border border-black bg-white hover:bg-black hover:text-white transition-none duration-100 flex flex-col justify-between min-h-[200px]">
                    <p className="font-body text-base leading-relaxed mb-6 group-hover:text-white">&ldquo;{q}&rdquo;</p>
                    <div className="font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-between border-t border-neutral-300 group-hover:border-neutral-700 pt-4">
                      <span>PROMPT #{idx + 1}</span>
                      <span className="flex items-center">Answer Now <ArrowRight className="ml-1 h-3 w-3" /></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trajectory Bar Chart (Pure Monochrome) */}
      <div className="border-4 border-black bg-white p-8 md:p-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-500 mb-1">ANALYTICS // MODULE 02</p>
            <h3 className="text-2xl font-display font-black uppercase text-black">Performance Trajectory</h3>
          </div>
          <div className="flex items-center space-x-6 font-mono text-xs uppercase tracking-widest font-bold">
            <span className="flex items-center"><span className="w-3 h-3 bg-black border border-black mr-2"></span>Confidence</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-neutral-300 border border-black mr-2"></span>Communication</span>
          </div>
        </div>

        <div>
          {allFeedbacks.length === 0 ? (
            <div className="h-40 border-2 border-black border-dashed flex items-center justify-center font-mono text-xs uppercase tracking-widest text-neutral-500">
              No evaluated questions recorded. Complete an interview prompt to display trajectory.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-0 border-2 border-black">
              {allFeedbacks.slice(-6).map((fb, idx) => (
                <div key={idx} className="p-6 border border-black flex flex-col items-center justify-between min-h-[180px]">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest mb-4">Q#{idx + 1}</span>
                  <div className="w-full space-y-4">
                    <div>
                      <div className="flex justify-between font-mono text-[11px] font-bold mb-1">
                        <span>CONF</span>
                        <span>{fb.confidence_score}%</span>
                      </div>
                      <div className="w-full h-3 border border-black bg-white">
                        <div className="h-full bg-black" style={{ width: `${fb.confidence_score}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-mono text-[11px] font-bold mb-1">
                        <span>COMM</span>
                        <span>{fb.communication_score}%</span>
                      </div>
                      <div className="w-full h-3 border border-black bg-white">
                        <div className="h-full bg-neutral-300" style={{ width: `${fb.communication_score}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Practice Tracks */}
      <div className="space-y-6">
        <h2 className="text-3xl font-display font-black uppercase tracking-tight text-black border-b-2 border-black pb-4">
          Featured Practice Tracks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
          <div onClick={() => startNewInterview("Technical & Architecture")} className="group cursor-pointer p-8 bg-white border border-black hover:bg-black hover:text-white transition-none duration-100 flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="font-mono text-xs font-bold tracking-widest uppercase block mb-4">TRACK // 01</span>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight mb-3">Technical & Architecture</h3>
              <p className="font-body text-neutral-600 group-hover:text-neutral-300 text-sm leading-relaxed">System design trade-offs, database bottlenecks, and high-concurrency architecture challenges.</p>
            </div>
            <div className="pt-6 font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-between border-t border-neutral-300 group-hover:border-neutral-700 mt-6">
              <span>Start Track</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div onClick={() => startNewInterview("Behavioral & Leadership")} className="group cursor-pointer p-8 bg-white border border-black hover:bg-black hover:text-white transition-none duration-100 flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="font-mono text-xs font-bold tracking-widest uppercase block mb-4">TRACK // 02</span>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight mb-3">Behavioral & Leadership</h3>
              <p className="font-body text-neutral-600 group-hover:text-neutral-300 text-sm leading-relaxed">STAR-method evaluation covering engineering conflict resolution, deadline pressure, and leadership.</p>
            </div>
            <div className="pt-6 font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-between border-t border-neutral-300 group-hover:border-neutral-700 mt-6">
              <span>Start Track</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div onClick={() => startNewInterview("Rapid Quick-Fire")} className="group cursor-pointer p-8 bg-white border border-black hover:bg-black hover:text-white transition-none duration-100 flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="font-mono text-xs font-bold tracking-widest uppercase block mb-4">TRACK // 03</span>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight mb-3">Rapid Quick-Fire</h3>
              <p className="font-body text-neutral-600 group-hover:text-neutral-300 text-sm leading-relaxed">Short, high-intensity technical questions measuring fast recall and concise verbal delivery.</p>
            </div>
            <div className="pt-6 font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-between border-t border-neutral-300 group-hover:border-neutral-700 mt-6">
              <span>Start Track</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Past Session Logs */}
      <div className="space-y-6 pt-4">
        <h2 className="text-3xl font-display font-black uppercase tracking-tight text-black border-b-2 border-black pb-4">
          Past Assessment Logs
        </h2>
        {isLoading ? (
          <div className="text-center py-16 font-mono text-xs uppercase tracking-widest text-neutral-500">Loading candidate session logs...</div>
        ) : history.length === 0 ? (
          <div className="border-2 border-black border-dashed p-12 text-center space-y-6 bg-neutral-50">
            <h3 className="text-2xl font-display font-bold uppercase text-black">No past sessions recorded</h3>
            <p className="font-body text-neutral-600 max-w-md mx-auto">Launch an interview session now to generate objective semantic scores and architectural feedback.</p>
            <button onClick={() => startNewInterview("General Technical & Architecture")} className="px-8 py-4 bg-black text-white font-mono text-xs uppercase tracking-widest font-bold border-2 border-black hover:bg-white hover:text-black transition-none duration-100">
              Initialize First Assessment
            </button>
          </div>
        ) : (
          <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3 border-2 border-black">
            {history.map((session) => {
              const qCount = session.feedbacks?.length || 0;
              const sessionConf = qCount > 0 
                ? Math.round(session.feedbacks.reduce((a, c) => a + (c.confidence_score || 0), 0) / qCount)
                : null;
              return (
                <div key={session.id} className="p-8 bg-white border border-black flex flex-col justify-between min-h-[220px] hover:bg-black hover:text-white group transition-none duration-100">
                  <div className="flex items-center justify-between border-b border-neutral-300 group-hover:border-neutral-700 pb-4 mb-4">
                    <span className="font-mono text-sm font-bold uppercase tracking-widest">SESSION #{session.id}</span>
                    {sessionConf !== null && (
                      <span className="font-mono text-xs border border-black group-hover:border-white px-2 py-0.5 font-bold">
                        {sessionConf}% SCORE
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="font-mono text-xs text-neutral-600 group-hover:text-neutral-400">
                      {new Date(session.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} // {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="font-body text-sm">
                      {qCount} {qCount === 1 ? 'question evaluated' : 'questions evaluated'}
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-neutral-300 group-hover:border-neutral-700">
                    <Link to={`/interview/${session.id}`} className="font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-between">
                      <span>Inspect Log</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
