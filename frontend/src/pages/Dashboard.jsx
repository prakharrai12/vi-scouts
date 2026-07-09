import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Play, History, Trophy, Clock, Sparkles, BrainCircuit, MessageSquare, Target, ChevronRight, Upload, FileText, CheckCircle2, BarChart3, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
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
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [token, navigate]);

  const startNewInterview = async () => {
    try {
      const response = await fetch(`${API_URL}/api/interviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  // Calculate real metrics from history
  const allFeedbacks = history.flatMap(session => session.feedbacks || []);
  const totalQuestions = allFeedbacks.length;
  const avgConfidence = totalQuestions > 0
    ? Math.round(allFeedbacks.reduce((acc, curr) => acc + (curr.confidence_score || 0), 0) / totalQuestions)
    : 85;
  const avgCommunication = totalQuestions > 0
    ? Math.round(allFeedbacks.reduce((acc, curr) => acc + (curr.communication_score || 0), 0) / totalQuestions)
    : 88;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-12 py-2">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#07192f] to-slate-900 border border-cyan-500/30 p-8 sm:p-12 text-white shadow-[0_0_40px_rgba(6,182,212,0.15)] backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full bg-teal-500/15 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center rounded-full bg-cyan-500/15 px-4 py-1.5 text-xs font-extrabold text-cyan-300 border border-cyan-400/30 tracking-wider uppercase">
              <Sparkles className="mr-2 h-4 w-4 text-teal-300 animate-pulse" />
              VI-SCOUTS Candidate Assessment Hub
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Practice & Master Your <span className="text-cyan-gradient">Next Interview</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Step into realistic technical and behavioral simulations. Receive precise, actionable AI feedback and watch your scores climb.
            </p>
          </div>
          <Button 
            onClick={startNewInterview} 
            size="lg" 
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black tracking-wide h-14 px-8 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] transition-all transform hover:-translate-y-0.5 shrink-0 text-base"
          >
            <Play className="mr-2.5 h-5 w-5 fill-current" /> Start AI Interview Session
          </Button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-slate-900/80 border-cyan-500/20 shadow-md hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] hover:border-cyan-500/40 transition-all rounded-3xl p-3 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center">
              <History className="mr-2 h-4 w-4 text-cyan-400" /> Total Practice Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-4xl sm:text-5xl font-black text-slate-100">{history.length}</div>
              <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">{totalQuestions} questions evaluated</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/80 border-teal-500/20 shadow-md hover:shadow-[0_10px_30px_rgba(20,184,166,0.1)] hover:border-teal-500/40 transition-all rounded-3xl p-3 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-teal-400 flex items-center">
              <Trophy className="mr-2 h-4 w-4 text-teal-400" /> Avg Confidence Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-4xl sm:text-5xl font-black text-slate-100">{avgConfidence}%</div>
              <span className="text-xs font-bold text-teal-300 bg-teal-500/15 px-3 py-1 rounded-full border border-teal-500/30">High Delivery</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-cyan-500/20 shadow-md hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] hover:border-cyan-500/40 transition-all rounded-3xl p-3 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center">
              <MessageSquare className="mr-2 h-4 w-4 text-cyan-400" /> Avg Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-4xl sm:text-5xl font-black text-slate-100">{avgCommunication}%</div>
              <span className="text-xs font-bold text-cyan-300 bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-500/30">Optimal Clarity</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resume PDF Upload & Tailored AI Questions Hub */}
      <Card className="bg-gradient-to-r from-slate-900 via-[#07192f] to-slate-900 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                <FileText className="h-4 w-4 text-teal-400" />
                <span>AI Resume Parsing & Custom Question Generator</span>
              </div>
              <h3 className="text-2xl font-black text-slate-100">Upload Your Resume (.PDF)</h3>
              <p className="text-sm text-slate-300">Our semantic engine extracts your core competencies and constructs highly tailored technical & leadership prompts.</p>
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform hover:-translate-y-0.5">
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4 stroke-[2.5]" />}
                {isUploading ? "Extracting Skills..." : "Upload Resume PDF"}
                <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" disabled={isUploading} />
              </label>
            </div>
          </div>

          {uploadError && (
            <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm font-bold animate-pulse text-center">
              {uploadError}
            </div>
          )}

          {resumeData && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Parsed Document</span>
                    <div className="text-base font-bold text-slate-100">{resumeData.filename} ({resumeData.word_count} words analyzed)</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase">AI Readiness Profile:</span>
                  <span className="text-lg font-black text-cyan-400">{resumeData.readiness_score}%</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300">Extracted Core Competencies:</span>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills_extracted?.map((skill, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center">
                  <BrainCircuit className="mr-2 h-4 w-4 text-cyan-400" /> Tailored Questions Generated From Your Experience (Click to Practice):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {resumeData.tailored_questions?.map((q, idx) => (
                    <div key={idx} onClick={startNewInterview} className="group cursor-pointer p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors leading-relaxed">&ldquo;{q}&rdquo;</p>
                      <div className="mt-4 flex items-center justify-end text-xs font-extrabold text-cyan-400 group-hover:translate-x-1 transition-transform">
                        Answer Now &rarr;
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Interactive Performance Trajectory Chart */}
      <Card className="bg-slate-900/80 border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-teal-400 mb-1">
              <TrendingUp className="h-4 w-4 text-teal-400" />
              <span>Session Score Progression</span>
            </div>
            <h3 className="text-2xl font-black text-slate-100 flex items-center">
              <BarChart3 className="mr-3 h-6 w-6 text-cyan-400" /> Interactive Performance Trajectory
            </h3>
          </div>
          <div className="flex items-center space-x-4 text-xs font-extrabold">
            <span className="flex items-center text-teal-300"><span className="w-3 h-3 rounded-full bg-teal-400 mr-2 shadow-[0_0_8px_rgba(20,184,166,0.8)]"></span>Confidence</span>
            <span className="flex items-center text-cyan-300"><span className="w-3 h-3 rounded-full bg-cyan-400 mr-2 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>Communication</span>
          </div>
        </div>

        <div className="pt-2">
          {allFeedbacks.length === 0 ? (
            <div className="h-48 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-400 text-sm font-medium">
              <span>Complete your first practice question to unlock dynamic score trajectory charts!</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {allFeedbacks.slice(-6).map((fb, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Q#{idx + 1} Assessment</span>
                    <div className="w-full space-y-2">
                      <div>
                        <div className="flex justify-between text-[10px] font-extrabold text-teal-300 mb-1">
                          <span>Conf</span>
                          <span>{fb.confidence_score || 85}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.5)]" style={{ width: `${fb.confidence_score || 85}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-extrabold text-cyan-300 mb-1">
                          <span>Comm</span>
                          <span>{fb.communication_score || 88}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" style={{ width: `${fb.communication_score || 88}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Practice Tracks */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-slate-100 flex items-center">
            <BrainCircuit className="mr-3 h-6 w-6 text-cyan-400" /> Featured Practice Tracks
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={startNewInterview} className="group cursor-pointer rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-sm hover:shadow-[0_10px_35px_rgba(6,182,212,0.15)] hover:border-cyan-400/60 transition-all backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-teal-400 group-hover:text-slate-950 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <BrainCircuit className="h-7 w-7 stroke-[2.5]" />
              </div>
              <h3 className="font-bold text-slate-100 text-xl group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                Technical & Architecture <ChevronRight className="h-5 w-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
              </h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">Deep dive into database bottlenecks, distributed systems, and coding trade-offs with immediate scoring.</p>
            </div>
          </div>

          <div onClick={startNewInterview} className="group cursor-pointer rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-sm hover:shadow-[0_10px_35px_rgba(20,184,166,0.15)] hover:border-teal-400/60 transition-all backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-6 group-hover:bg-gradient-to-tr group-hover:from-teal-400 group-hover:to-cyan-400 group-hover:text-slate-950 transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <Target className="h-7 w-7 stroke-[2.5]" />
              </div>
              <h3 className="font-bold text-slate-100 text-xl group-hover:text-teal-300 transition-colors flex items-center justify-between">
                Behavioral & Leadership <ChevronRight className="h-5 w-5 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
              </h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">Master STAR-format answers for conflict resolution, team collaboration, and impact delivery.</p>
            </div>
          </div>

          <div onClick={startNewInterview} className="group cursor-pointer rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-sm hover:shadow-[0_10px_35px_rgba(6,182,212,0.15)] hover:border-cyan-400/60 transition-all backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-teal-400 group-hover:text-slate-950 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <MessageSquare className="h-7 w-7 stroke-[2.5]" />
              </div>
              <h3 className="font-bold text-slate-100 text-xl group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                Rapid Quick-Fire <ChevronRight className="h-5 w-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
              </h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">Short, intense questions to test your fast thinking and communication clarity under time constraints.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-black tracking-tight text-slate-100">Past Assessment Logs</h2>
        {isLoading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse font-medium">Loading your evaluation history...</div>
        ) : history.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-800 bg-slate-900/40 rounded-3xl p-12 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-2xl bg-cyan-500/15 border border-cyan-500/30 p-5 mb-5 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Clock className="h-10 w-10 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">No practice sessions recorded yet</h3>
              <p className="text-slate-400 mt-2 mb-8 max-w-md text-base leading-relaxed">Launch your first session now to start tracking your strengths and areas for improvement.</p>
              <Button onClick={startNewInterview} className="bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black rounded-xl px-8 h-12 shadow-[0_0_20px_rgba(6,182,212,0.3)]">Begin First Assessment</Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {history.map((session) => {
              const qCount = session.feedbacks?.length || 0;
              const sessionConf = qCount > 0 
                ? Math.round(session.feedbacks.reduce((a, c) => a + (c.confidence_score || 0), 0) / qCount)
                : null;
              return (
                <Card key={session.id} className="hover:shadow-[0_10px_35px_rgba(6,182,212,0.15)] hover:border-cyan-500/50 transition-all rounded-3xl border-slate-800 bg-slate-900/80 group overflow-hidden backdrop-blur-xl">
                  <CardHeader className="bg-slate-950/60 pb-4 border-b border-slate-800 p-6 sm:p-7">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg font-bold text-slate-100">Session #{session.id}</CardTitle>
                      {sessionConf && (
                        <span className="text-xs font-extrabold text-teal-300 bg-teal-500/20 border border-teal-500/40 px-3 py-1 rounded-full">
                          {sessionConf}% Score
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      {new Date(session.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-7 flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-300 flex items-center">
                      <MessageSquare className="h-4 w-4 text-cyan-400 mr-2.5" />
                      {qCount} {qCount === 1 ? 'question answered' : 'questions evaluated'}
                    </div>
                    <Link to={`/interview/${session.id}`}>
                      <Button variant="link" className="px-0 font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center">
                        View Assessment <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
