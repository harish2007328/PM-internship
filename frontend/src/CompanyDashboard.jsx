import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Users, 
  MapPin, 
  Search, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { insforge } from './lib/insforge';
import { calculateMatchScore } from './lib/matching';

const CompanyDashboard = ({ preSelectedJobId }) => {
  const [activeTab, setActiveTab] = useState(preSelectedJobId ? 'applicants' : 'post'); 
  const [isPosting, setIsPosting] = useState(false);
  const [shortlisted, setShortlisted] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(preSelectedJobId || null);

  const ROLES = ["SDE Intern", "Data Science Intern", "Frontend Dev", "Backend Dev", "PM Intern", "UI/UX Intern", "Marketing Intern"];
  const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Tenkasi"];

  const [jobData, setJobData] = useState({
    company: '',
    role: '',
    sector: '',
    required_skills: '',
    location: '',
    stipend: ''
  });

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const { data, error } = await insforge.database.from('pm_jobs').select('*');
    if (!error) setJobs(data);
  };

  React.useEffect(() => {
    fetchJobs();
  }, []);

  React.useEffect(() => {
    if (preSelectedJobId) {
      setCurrentJobId(preSelectedJobId);
      fetchApplicants(preSelectedJobId);
    }
  }, [preSelectedJobId]);

  const handlePost = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      const { data, error } = await insforge.database.from('pm_jobs').insert([{ ...jobData, stipend: parseInt(jobData.stipend) }]).select();
      if (!error && data) {
        setIsPosting(false);
        const newJob = data[0];
        setCurrentJobId(newJob.job_id);
        setActiveTab('applicants');
        fetchJobs(); 
        fetchApplicants(newJob.job_id);
      }
    } catch (err) { console.error(err); }
    finally { setIsPosting(false); }
  };

  const fetchApplicants = async (jobId) => {
    const idToUse = jobId || currentJobId;
    if (!idToUse) return;
    let selectedJob = jobs.find(j => j.job_id === idToUse);
    
    setIsLoading(true);
    try {
      // If job not in state (e.g. direct load from demo), fetch it
      if (!selectedJob) {
        const { data: jobData } = await insforge.database.from('pm_jobs').select('*').eq('job_id', idToUse).single();
        if (jobData) selectedJob = jobData;
      }

      const { data: apps } = await insforge.database.from('pm_applications').select('user_id').eq('job_id', idToUse);
      if (!apps || apps.length === 0) {
        setShortlisted([]);
        return;
      }

      const applicantIds = apps.map(a => a.user_id);
      const { data: usersData } = await insforge.database.from('pm_users').select('*').in('user_id', applicantIds);
      
      const { data: selections } = await insforge.database.from('pm_selections').select('user_id').eq('job_id', idToUse);
      const selectedSet = new Set(selections?.map(s => s.user_id) || []);
      
      if (Array.isArray(usersData)) {
        const processed = usersData.map(user => {
          const uSkills = user.skills || '';
          const jSkills = selectedJob?.required_skills || '';
          const score = calculateMatchScore(uSkills, jSkills);
          
          return { 
            ...user, 
            id: user.user_id, 
            score: Math.round(score * 100), 
            is_selected: selectedSet.has(user.user_id),
            skills: user.skills ? user.skills.split(',').map(s => s.trim()) : [] 
          };
        }).sort((a, b) => b.score - a.score);
        
        setShortlisted(processed);
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const handleSelect = async (candidateId) => {
    if (!currentJobId) return;
    try {
      const { error } = await insforge.database.from('pm_selections').insert([{ user_id: candidateId, job_id: currentJobId, timestamp: new Date().toISOString() }]);
      if (!error) fetchApplicants(currentJobId);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-heading mb-2 text-primary">Company Console</h1>
          <p className="text-textSecondary text-sm italic">Analyze your talent pool with semantic AI.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 bg-border/20 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('post')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'post' ? 'bg-white shadow-sm text-primary' : 'text-textSecondary hover:text-primary'}`}
            >
              Post Internship
            </button>
            <button 
              onClick={() => { setActiveTab('applicants'); fetchApplicants(); }}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'applicants' ? 'bg-white shadow-sm text-primary' : 'text-textSecondary hover:text-primary'}`}
            >
              Applicants
            </button>
          </div>

          {activeTab === 'applicants' && (
            <select 
              value={currentJobId || ''} 
              onChange={(e) => { setCurrentJobId(e.target.value); fetchApplicants(e.target.value); }}
              className="bg-primary text-white text-[10px] font-black uppercase px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-accent shadow-lg"
            >
              <option value="">Select Internship</option>
              {jobs.map(j => <option key={j.job_id} value={j.job_id}>{j.role} @ {j.company}</option>)}
            </select>
          )}
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'post' ? (
            <motion.div 
              key="post"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              <div className="space-y-6">
                <div className="card">
                  <h3 className="mb-6 flex items-center gap-2"><Plus size={20} className="text-accent" /> New Internship Posting</h3>
                  <form onSubmit={handlePost} className="space-y-4">
                    <div className="space-y-1">
                      <label className="input-label">Company Name</label>
                      <input className="form-input" required value={jobData.company} onChange={e => setJobData({...jobData, company: e.target.value})} placeholder="e.g. Zepto" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="input-label">Role</label>
                        <select className="form-input" required value={jobData.role} onChange={e => setJobData({...jobData, role: e.target.value})}>
                          <option value="">Select Role</option>
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="input-label">Sector</label>
                        <select className="form-input" required value={jobData.sector} onChange={e => setJobData({...jobData, sector: e.target.value})}>
                          <option value="">Select</option>
                          <option value="IT">Information Tech</option>
                          <option value="Finance">Finance</option>
                          <option value="Core">Core Engineering</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="input-label">Required Skills (Comma separated)</label>
                      <input className="form-input" required value={jobData.required_skills} onChange={e => setJobData({...jobData, required_skills: e.target.value})} placeholder="Python, React, SQL..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="input-label">Location</label>
                        <select className="form-input" required value={jobData.location} onChange={e => setJobData({...jobData, location: e.target.value})}>
                          <option value="">Select city</option>
                          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="input-label">Monthly Stipend (₹)</label>
                        <input className="form-input" type="number" required value={jobData.stipend} onChange={e => setJobData({...jobData, stipend: e.target.value})} placeholder="e.g. 15000" />
                      </div>
                    </div>
                    <button type="submit" disabled={isPosting} className="btn-primary w-full py-3 mt-4">
                      {isPosting ? 'Posting Opportunity...' : 'Post Internship & Trigger Matchmaker'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="space-y-6">
                <div className="card bg-primary text-white border-0">
                  <h3 className="text-white mb-4 flex items-center gap-2"><Zap size={20} className="text-accent" /> Matchmaker Potential</h3>
                  <div className="space-y-4 text-sm text-white/70">
                    <p>Our engine uses <strong>Vector Embeddings</strong> (all-MiniLM-L6-v2) to calculate semantic similarity between candidate profiles and your job requirements.</p>
                    <div className="bg-white/10 p-4 rounded-input border border-white/10">
                      <p className="font-bold text-white mb-2 text-xs uppercase tracking-widest">Recommended Filter</p>
                      <ul className="space-y-2 list-disc pl-4">
                        <li>AI identifies top 3 candidates based on <strong>Merit & Inclusion</strong></li>
                        <li>You can manually select any applicant for the next round</li>
                      </ul>
                    </div>
                    <p>Financial risk is automatically flagged if candidates are from outside <strong>{jobData.location || "the job location"}</strong>.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="applicants"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-end mb-4">
                <h3 className="flex items-center gap-2 font-heading"><Users size={20} /> All Applicants ({shortlisted.length})</h3>
                <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">Manual Selection Enabled</span>
              </div>

              {isLoading ? (
                <div className="py-20 text-center card bg-offWhite/50 border-dashed animate-pulse">
                  <p className="text-textSecondary font-bold text-xs uppercase tracking-tighter">Calculating Cosine Similarities...</p>
                </div>
              ) : shortlisted.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {shortlisted.map((candidate, idx) => (
                    <motion.div 
                      key={candidate.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`card hover:border-primary transition-all group ${candidate.is_selected ? 'border-green-500 bg-green-50/30' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-lg ${candidate.is_selected ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                            {candidate.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold">{candidate.name}</h4>
                              {candidate.is_selected && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-green-500 text-white flex items-center gap-1">
                                  <CheckCircle2 size={10} /> Selected for Interview
                                </span>
                              )}
                              {!candidate.is_selected && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-gray-200 text-gray-700">
                                  Pending Review
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-textSecondary font-medium">
                              <span className="flex items-center gap-1"><MapPin size={12} /> {candidate.location}</span>
                              <span className="flex items-center gap-1"><Award size={12} /> {candidate.caste}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                           <p className="text-[10px] font-bold text-textSecondary uppercase mb-1">Match Score</p>
                           <p className={`text-2xl font-heading font-bold ${candidate.score === 100 ? 'text-[#E05C2A]' : candidate.score > 90 ? 'text-primary' : 'text-accent'}`}>
                             {candidate.score}%
                           </p>
                          </div>
                          <div className="text-right">
                            {candidate.location !== jobData.location && jobData.location ? (
                              <div className="flex items-center gap-1.5 text-red-500 font-bold text-[10px] uppercase bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                                <AlertCircle size={12} /> High Risk
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] uppercase bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                                <CheckCircle2 size={12} /> Low Risk
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => handleSelect(candidate.id)}
                            disabled={candidate.is_selected}
                            className={`btn-primary px-8 transition-colors ${candidate.is_selected ? 'bg-green-500 border-green-500 cursor-default' : 'group-hover:bg-primary'}`}
                          >
                            {candidate.is_selected ? 'Shortlisted' : 'Select for Interview'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-2">
                         {candidate.skills.map(skill => (
                           <span key={skill} className="px-2 py-0.5 bg-offWhite border border-border rounded text-[10px] font-bold text-textSecondary uppercase">{skill}</span>
                         ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center card bg-offWhite/50 border-dashed">
                  <p className="text-textSecondary font-bold text-xs uppercase tracking-widest opacity-40">
                    {currentJobId ? "No qualified candidates found for this role yet." : "Select an internship above to view top matches."}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CompanyDashboard;
