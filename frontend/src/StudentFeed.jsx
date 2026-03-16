import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Building2,
  IndianRupee, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ClipboardList,
  X,
  Play,
  Zap,
  Globe,
  RotateCcw
} from 'lucide-react';
import MockTest from './MockTest';
import ChatBot from './ChatBot';
import ReactMarkdown from 'react-markdown';
import { insforge } from './lib/insforge';
import { calculateMatchScore, getFinancialRisk } from './lib/matching';

const JobCard = ({ job, rank, isAbsoluteTop, isGolden, isHighestStipend, onApply, onOpenMock, canApply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const applied = job.has_applied;

  const handleApply = async (e) => {
    e.stopPropagation();
    if (applied) return;
    if (!canApply) return;
    
    setIsApplying(true);
    await onApply(job.job_id);
    setIsApplying(false);
  };

  const riskColor = job.financial_risk === "CRITICAL" ? "text-red-600 border-red-200 bg-red-50" : 
                    job.financial_risk === "LOW" ? "text-green-600 border-green-200 bg-green-50" : 
                    "text-yellow-600 border-yellow-200 bg-yellow-50";

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer transition-all duration-200 border rounded-xl overflow-hidden relative group
          ${isAbsoluteTop ? 'bg-[#E05C2A] border-[#E05C2A] shadow-lg' : isGolden ? 'bg-[#FDFCFB] border-[#E2E0DC]' : 'bg-white border-[#E2E0DC]'}
          ${isExpanded ? 'p-8' : 'p-6'}`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-5 flex-1">
            <div className={`mt-1 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs
              ${isAbsoluteTop ? 'bg-white text-[#E05C2A]' : isGolden ? 'bg-[#E05C2A] text-white' : 'bg-[#1C2340]/5 text-[#1C2340]/40'}`}>
              {rank}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className={`font-heading font-bold transition-all ${isAbsoluteTop ? 'text-white' : 'text-[#1C2340]'} ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
                  {job.role}
                </h3>
                {isAbsoluteTop && (
                  <span className="bg-white/20 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded inline-block">
                    Top Match
                  </span>
                )}
                {!isAbsoluteTop && isGolden && (
                  <span className="bg-[#E05C2A]/10 text-[#E05C2A] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded inline-block">
                    Match
                  </span>
                )}
                {applied && !isExpanded && !job.is_selected && (
                  <CheckCircle2 size={16} className={`${isAbsoluteTop ? 'text-white' : 'text-green-600'} shrink-0`} />
                )}
                {job.is_selected && (
                   <span className="bg-green-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded inline-block flex items-center gap-1">
                     <CheckCircle2 size={10} /> Selected
                   </span>
                )}
              </div>
              
              {!isExpanded && (
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                  <span className={`flex items-center gap-1.5 text-[11px] font-bold ${isAbsoluteTop ? 'text-white/80' : 'text-[#6B7280]'} uppercase tracking-wider`}>
                    <Building2 size={14} className="opacity-40" /> {job.company}
                  </span>
                  <span className={`flex items-center gap-1.5 text-[11px] font-bold ${isAbsoluteTop ? 'text-white/80' : 'text-[#6B7280]'} uppercase tracking-wider`}>
                    <MapPin size={14} className="opacity-40" /> {job.location}
                  </span>
                  <div className="flex flex-wrap gap-1 ml-2">
                    {job.required_skills ? job.required_skills.split(',').slice(0, 3).map(skill => (
                      <span key={skill} className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-tighter ${isAbsoluteTop ? 'bg-white/10 border-white/20 text-white' : 'bg-[#1C2340]/5 border-[#1C2340]/10 text-[#1C2340]/40'}`}>
                        {skill.trim()}
                      </span>
                    )) : null}
                    {job.required_skills && job.required_skills.split(',').length > 3 && (
                      <span className={`text-[8px] font-bold uppercase tracking-tighter ${isAbsoluteTop ? 'text-white/40' : 'text-[#6B7280]/40'}`}>+ others</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right sr-only md:not-sr-only">
              <div className={`font-heading font-black leading-none ${isExpanded ? 'text-4xl' : 'text-2xl'} 
                ${isAbsoluteTop ? 'text-white' : isGolden ? 'text-[#E05C2A]' : 'text-[#1C2340]'}`}>
                {Math.round(job.score * 100)}%
              </div>
              <div className={`text-[10px] font-black uppercase tracking-widest ${isAbsoluteTop ? 'text-white/60' : 'text-[#6B7280]'} mt-1.5 opacity-40`}>Match</div>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} className={`${isAbsoluteTop ? 'text-white/60' : 'text-[#6B7280]'} opacity-30`}>
              <ChevronRight size={20} />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className={`pt-8 mt-6 border-t ${isAbsoluteTop ? 'border-white/20' : 'border-[#E2E0DC]'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                  <div className="space-y-6 flex-1 w-full">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className={`border ${isAbsoluteTop ? 'border-white/20 bg-white/5' : 'border-[#E2E0DC]'} p-5 rounded-lg`}>
                          <p className={`text-[10px] font-black ${isAbsoluteTop ? 'text-white/60' : 'text-[#6B7280]'} uppercase tracking-widest mb-2 opacity-60`}>Stipend</p>
                          <p className={`text-sm font-bold ${isAbsoluteTop ? 'text-white' : 'text-[#1C2340]'}`}>₹{job.stipend.toLocaleString()}</p>
                        </div>
                        <div className={`border ${isAbsoluteTop ? 'border-white/20 bg-white/5' : 'border-[#E2E0DC]'} p-5 rounded-lg col-span-1 sm:col-span-2`}>
                          <p className={`text-[10px] font-black ${isAbsoluteTop ? 'text-white/60' : 'text-[#6B7280]'} uppercase tracking-widest mb-2 opacity-60`}>Required Skills</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {job.required_skills ? job.required_skills.split(',').map(skill => (
                              <span key={skill} className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter ${isAbsoluteTop ? 'bg-white/10 border-white/20 text-white' : 'bg-offWhite border-border/50 text-primary/70'}`}>
                                {skill.trim()}
                              </span>
                            )) : <span className="text-[9px] text-gray-400">Not specified</span>}
                          </div>
                        </div>
                        <div className={`border ${isAbsoluteTop ? 'border-white/20 bg-white/5' : 'border-[#E2E0DC]'} p-5 rounded-lg`}>
                          <p className={`text-[10px] font-black ${isAbsoluteTop ? 'text-white/60' : 'text-[#6B7280]'} uppercase tracking-widest mb-2 opacity-60`}>Risk Index</p>
                          <p className={`text-[11px] font-bold px-2 py-1 rounded border inline-block ${isAbsoluteTop && job.financial_risk === "LOW" ? 'bg-green-600 text-white border-green-500' : riskColor}`}>
                            {job.financial_risk} RISK
                          </p>
                        </div>
                     </div>
                  </div>

                  <div className="w-full md:w-auto space-y-4">
                    <div className={`flex items-center gap-2.5 font-bold text-[10px] uppercase px-4 py-3 rounded-lg border tracking-wider
                      ${isAbsoluteTop && job.financial_risk === "LOW" ? 'bg-green-600 text-white border-green-500' : riskColor}`}>
                      <AlertCircle size={14} /> {job.risk_message}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={handleApply}
                        disabled={applied || isApplying || (!canApply && !applied)}
                        className={`flex-1 px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all
                        ${applied ? 'bg-green-600 text-white border-green-600' : 
                          !canApply ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' :
                          isAbsoluteTop ? 'bg-white text-[#E05C2A] hover:bg-white/90' : 'bg-[#1C2340] text-white hover:bg-[#2D385E]'}`}
                      >
                        {isApplying ? "Wait..." : applied ? "Applied" : !canApply ? "Limit Reached" : "Apply" } 
                      </button>
                      
                      {applied && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onOpenMock(job); }} 
                          className={`${isAbsoluteTop ? 'bg-white text-[#E05C2A]' : 'bg-[#1C2340] text-white'} p-3.5 rounded-lg hover:opacity-90 transition-all`}
                        >
                          <Zap size={20} className="fill-current" />
                        </button>
                      )}
                    </div>
                    {!canApply && !applied && (
                      <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest text-center">Max 5 applications allowed</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const StudentFeed = ({ userId }) => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMock, setActiveMock] = useState(null);

  const [locationFilter, setLocationFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortBy, setSortBy] = useState('score');
  const [topGlobalIds, setTopGlobalIds] = useState([]);
  const [absoluteTopJobId, setAbsoluteTopJobId] = useState(null);
  const [globalRankMap, setGlobalRankMap] = useState({});
  const [viewingJob, setViewingJob] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!userId) return;
      try {
        const { data: userData, error: userError } = await insforge.database.from('pm_users').select('*').eq('user_id', userId).single();
        if (userError) throw userError;

        const { data: jobsData, error: jobsError } = await insforge.database.from('pm_jobs').select('*');
        if (jobsError) throw jobsError;

        const { data: appsData } = await insforge.database.from('pm_applications').select('job_id').eq('user_id', userId);
        const appliedIds = new Set(appsData?.map(a => a.job_id) || []);

        const processed = jobsData.map(job => {
          const score = calculateMatchScore(userData.skills, job.required_skills);
          const { risk, message } = getFinancialRisk(userData.location, job.location, job.stipend);
          return {
            ...job,
            score,
            financial_risk: risk,
            risk_message: message,
            has_applied: appliedIds.has(job.job_id)
          };
        });

        const sorted = [...processed].sort((a, b) => b.score - a.score);
        const rankMap = {};
        sorted.forEach((j, i) => { rankMap[j.job_id] = i + 1; });
        
        setMatches(processed);
        setFilteredMatches(processed);
        setTopGlobalIds(sorted.slice(0, 5).map(j => j.job_id));
        setGlobalRankMap(rankMap);
        if (sorted.length > 0) setAbsoluteTopJobId(sorted[0].job_id);
      } catch (err) { console.error('Error:', err); }
      finally { setIsLoading(false); }
    };
    fetchMatches();
  }, [userId]);

  useEffect(() => {
    let result = [...matches];
    if (locationFilter !== 'All') result = result.filter(j => j.location === locationFilter);
    if (roleFilter !== 'All') result = result.filter(j => j.role === roleFilter);
    if (sortBy === 'stipend_asc') result.sort((a, b) => a.stipend - b.stipend);
    else if (sortBy === 'stipend_desc') result.sort((a, b) => b.stipend - a.stipend);
    else result.sort((a, b) => b.score - a.score);
    setFilteredMatches(result);
  }, [locationFilter, roleFilter, sortBy, matches]);

  const clearFilters = () => {
    setLocationFilter('All');
    setRoleFilter('All');
    setSortBy('score');
  };

  const handleApply = async (jobId) => {
    const currentApplied = matches.filter(m => m.has_applied).length;
    if (currentApplied >= 5) return false;

    try {
      const { error } = await insforge.database
        .from('pm_applications')
        .insert([{ user_id: userId, job_id: jobId, timestamp: new Date().toISOString() }]);
      if (!error) {
        setMatches(matches.map(m => m.job_id === jobId ? {...m, has_applied: true} : m));
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse text-[#6B7280] font-bold text-[11px] uppercase tracking-widest">Initializing...</div>;

  const appliedJobs = matches.filter(m => m.has_applied);
  const offeredJobs = []; // Currently no logic to move to offers, using as section placeholder
  const selectedJobs = matches.filter(m => m.is_selected); 
  
  const uniqueLocations = ['All', ...new Set(matches.map(j => j.location))];
  const uniqueRoles = ['All', ...new Set(matches.map(j => j.role))];

  const handleUnapply = async (jobId) => {
    try {
      const { error } = await insforge.database
        .from('pm_applications')
        .delete()
        .eq('user_id', userId)
        .eq('job_id', jobId);

      if (!error) {
        setMatches(matches.map(m => m.job_id === jobId ? {...m, has_applied: false} : m));
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="w-full h-full bg-[#F5F4F2] flex flex-col xl:flex-row overflow-hidden relative">
      <AnimatePresence>
        {activeMock && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setActiveMock(null)}
              className="absolute inset-0 bg-[#1C2340]/40 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
               <div className="p-8">
                 <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#E05C2A]/10 rounded-lg flex items-center justify-center text-[#E05C2A]">
                        <Zap size={20} className="fill-current" />
                     </div>
                     <div>
                       <h2 className="text-xl font-heading font-black text-[#1C2340]">AI Capability Test</h2>
                       <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{activeMock.role} focus</p>
                     </div>
                   </div>
                   <button onClick={() => setActiveMock(null)} className="p-2 hover:bg-[#F5F4F2] rounded-full transition-colors">
                     <X size={20} className="text-[#6B7280]" />
                   </button>
                 </div>
                 <MockTest job={activeMock} onComplete={() => setActiveMock(null)} />
               </div>
            </motion.div>
          </div>
        )}

        {viewingJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setViewingJob(null)}
              className="absolute inset-0 bg-[#1C2340]/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-[#E2E0DC]"
            >
               <div className="p-10">
                 <div className="flex justify-between items-start mb-8">
                   <div>
                     <div className="flex items-center gap-2 mb-2">
                       <span className="bg-[#E05C2A] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                         {Math.round(viewingJob.score * 100)}% Match
                       </span>
                       <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest flex items-center gap-1">
                         <MapPin size={10} /> {viewingJob.location}
                       </span>
                     </div>
                     <h2 className="text-2xl font-heading font-black text-[#1C2340] mb-1">{viewingJob.role}</h2>
                     <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{viewingJob.company}</p>
                   </div>
                   <button onClick={() => setViewingJob(null)} className="p-2 hover:bg-[#F5F4F2] rounded-full transition-colors">
                     <X size={20} className="text-[#1C2340]" />
                   </button>
                 </div>

                 <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-[#1C2340] tracking-[0.2em] mb-3 opacity-30">Job Description</h4>
                      <div className="text-xs text-[#1C2340]/70 leading-relaxed font-body markdown-content">
                        <ReactMarkdown>{viewingJob.description}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div>
                         <h4 className="text-[10px] font-black uppercase text-[#1C2340] tracking-[0.2em] mb-3 opacity-30">Stipend Range</h4>
                         <p className="text-sm font-black text-[#E05C2A]">₹{viewingJob.stipend.toLocaleString()}<span className="text-[10px] opacity-40">/month</span></p>
                       </div>
                       <div>
                         <h4 className="text-[10px] font-black uppercase text-[#1C2340] tracking-[0.2em] mb-3 opacity-30">Requirements</h4>
                         <div className="flex flex-wrap gap-1.5">
                            {viewingJob.skills_required?.split(',').map(s => (
                              <span key={s} className="px-2 py-1 bg-[#F5F4F2] text-[9px] font-bold text-[#1C2340] rounded">{s.trim()}</span>
                            ))}
                         </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-10 pt-6 border-t border-[#F5F4F2] flex gap-3">
                    <button className="flex-1 bg-[#1C2340] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#E05C2A] transition-colors">
                      Resume Applied
                    </button>
                    <button 
                      onClick={() => { setActiveMock(viewingJob); setViewingJob(null); }}
                      className="bg-[#E05C2A]/10 text-[#E05C2A] px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#E05C2A]/20 transition-all"
                    >
                      Mock Prep
                    </button>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: OPPORTUNITY FEED */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="space-y-6">
             <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-heading font-black text-[#1C2340] tracking-tight mb-2">Job Opportunities</h1>
                  <p className="text-[#6B7280] text-xs leading-relaxed font-body">
                    Showing {matches.length} matches. <span className="text-[#E05C2A] font-bold">{appliedJobs.length}/5 Applications Used</span>
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                   <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest opacity-30">Status</p>
                   <p className="text-[10px] font-bold text-green-600 flex items-center justify-end gap-1.5 uppercase">
                     <Globe size={12} /> Connected
                   </p>
                </div>
             </div>

             <div className="bg-white border border-[#E2E0DC] rounded-xl shadow-sm p-1 flex flex-wrap items-stretch gap-1">
                <div className="flex-1 min-w-[200px] flex items-center">
                  <div className="px-4 py-2 flex-1 group">
                    <label className="block text-[8px] font-black text-[#6B7280] uppercase tracking-[0.2em] mb-1 opacity-40">City</label>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-[#E05C2A] opacity-50" />
                      <select 
                        value={locationFilter} 
                        onChange={e => setLocationFilter(e.target.value)} 
                        className="bg-transparent text-[11px] font-bold text-[#1C2340] border-none p-0 focus:ring-0 cursor-pointer w-full"
                      >
                        {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="w-[1px] h-8 bg-[#F5F4F2] self-center" />
                  
                  <div className="px-4 py-2 flex-1 group">
                    <label className="block text-[8px] font-black text-[#6B7280] uppercase tracking-[0.2em] mb-1 opacity-40">Job Role</label>
                    <div className="flex items-center gap-2">
                      <Building2 size={12} className="text-[#E05C2A] opacity-50" />
                      <select 
                        value={roleFilter} 
                        onChange={e => setRoleFilter(e.target.value)} 
                        className="bg-transparent text-[11px] font-bold text-[#1C2340] border-none p-0 focus:ring-0 cursor-pointer w-full"
                      >
                        {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1C2340] rounded-lg px-4 py-2 flex flex-col justify-center min-w-[120px]">
                  <label className="block text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Sort By</label>
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)} 
                    className="bg-transparent text-[11px] font-bold text-white border-none p-0 focus:ring-0 cursor-pointer w-full appearance-none"
                  >
                    <option value="score" className="bg-[#1C2340] text-white">Top Matches</option>
                    <option value="stipend_desc" className="bg-[#1C2340] text-white">Stipend: High</option>
                    <option value="stipend_asc" className="bg-[#1C2340] text-white">Stipend: Low</option>
                  </select>
                </div>
                
                <button 
                  onClick={clearFilters}
                  className="bg-[#F5F4F2] hover:bg-[#E2E0DC] text-[#1C2340] px-4 rounded-lg flex items-center justify-center transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw size={16} />
                </button>
             </div>
          </header>

          <div className="grid grid-cols-1 gap-4">
            {filteredMatches.length > 0 ? filteredMatches.map((job) => (
              <JobCard 
                key={job.job_id} 
                job={job} 
                rank={globalRankMap[job.job_id]} 
                isAbsoluteTop={job.job_id === absoluteTopJobId}
                isGolden={topGlobalIds.includes(job.job_id)}
                isHighestStipend={job.stipend === Math.max(...matches.map(m=>m.stipend))}
                onApply={handleApply}
                onOpenMock={setActiveMock}
                canApply={appliedJobs.length < 5}
              />
            )) : (
              <div className="text-center py-24 bg-white rounded-xl border border-[#E2E0DC]">
                <X size={32} className="mx-auto mb-2 opacity-10" />
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest opacity-40">No jobs found</p>
              </div>
            )}
          </div>
        </div>
      </div>      {/* RIGHT COLUMN: DASHBOARD - Categories Added */}
      {/* RIGHT COLUMN: DASHBOARD - Categories Added */}
      <aside className="w-full xl:w-80 bg-white border-l border-[#E2E0DC] flex flex-col h-full shrink-0">
          <div className="p-6 bg-[#1C2340]">
             <div className="grid grid-cols-3 gap-4">
                <div className="text-center group cursor-default">
                   <p className="text-xl font-heading font-black text-white group-hover:text-[#E05C2A] transition-colors">{appliedJobs.length}</p>
                   <p className="text-[7px] font-black uppercase text-white/40 tracking-[0.2em]">Applied</p>
                </div>
                <div className="text-center border-l border-r border-white/10 group cursor-default">
                   <p className="text-xl font-heading font-black text-white group-hover:text-amber-400 transition-colors">{offeredJobs.length}</p>
                   <p className="text-[7px] font-black uppercase text-white/40 tracking-[0.2em]">Offers</p>
                </div>
                <div className="text-center group cursor-default">
                   <p className="text-xl font-heading font-black text-white group-hover:text-green-400 transition-colors">{selectedJobs.length}</p>
                   <p className="text-[7px] font-black uppercase text-white/40 tracking-[0.2em]">Selected</p>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
            {/* Achievement Sections - Only shown if active */}
            {selectedJobs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-green-600 tracking-[0.2em] flex items-center gap-2">
                   <CheckCircle2 size={12} /> Confirmed Selections
                </h3>
                {selectedJobs.map(job => (
                  <div key={job.job_id} className="bg-green-50 border border-green-200 rounded-lg p-4 relative overflow-hidden">
                    <h4 className="text-[11px] font-black text-green-900 uppercase mb-1">{job.role}</h4>
                    <p className="text-[9px] font-bold text-green-700/60 uppercase">{job.company}</p>
                  </div>
                ))}
              </div>
            )}

            {offeredJobs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-amber-600 tracking-[0.2em] flex items-center gap-2">
                   <Star size={12} /> Current Offers
                </h3>
                {offeredJobs.map(job => (
                  <div key={job.job_id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="text-[11px] font-black text-amber-900 uppercase mb-1">{job.role}</h4>
                    <p className="text-[9px] font-bold text-amber-700/60 uppercase mb-3">{job.company}</p>
                    <button className="w-full bg-amber-600 text-white py-2 rounded text-[8px] font-black uppercase tracking-widest">
                      Accept & Confirm
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Active Inventory - Applied Jobs */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase text-[#1C2340]/40 tracking-[0.2em] flex justify-between items-center">
                 Active Applications
                 <span className="text-[9px] font-bold bg-[#F5F4F2] text-[#1C2340] px-1.5 py-0.5 rounded">{appliedJobs.length}</span>
              </h3>

              <div className="space-y-3">
                {appliedJobs.length > 0 ? [...appliedJobs].reverse().map((job) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    key={job.job_id} 
                    onClick={() => setViewingJob(job)}
                    className="group bg-[#FDFCFB] border border-[#E2E0DC] rounded-xl p-4 hover:border-[#E05C2A]/30 transition-all shadow-sm cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <h4 className="text-[10px] font-black text-[#1C2340] uppercase tracking-tight truncate pr-4">{job.role}</h4>
                         <p className="text-[8px] font-black text-[#E05C2A] uppercase tracking-widest mt-0.5">{Math.round(job.score * 100)}% Match</p>
                       </div>
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleUnapply(job.job_id); }}
                        className="text-[#6B7280] hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"
                        title="Cancel Application"
                       >
                         <X size={12} />
                       </button>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest opacity-50">
                         {job.company}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMock(job); }}
                        className="bg-[#1C2340] text-white px-3 py-1.5 rounded text-[8px] font-black uppercase tracking-widest hover:bg-[#E05C2A] transition-colors"
                      >
                        Mock Test
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-12 border border-dashed border-[#E2E0DC] rounded-xl">
                    <p className="text-[9px] font-black text-[#6B7280] uppercase opacity-20 tracking-[0.2em]">Inventory Empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-[#F5F4F2] bg-[#FDFCFB]">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E05C2A]/5 text-[#E05C2A] flex items-center justify-center border border-[#E05C2A]/10">
                   <Zap size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#1C2340] uppercase tracking-tight">Prime Status</p>
                  <p className="text-[8px] font-bold text-[#6B7280] uppercase opacity-40">Profile meta: Active</p>
                </div>
             </div>
          </div>
      </aside>

      <ChatBot matches={matches} />
    </div>
  );
};

export default StudentFeed;
