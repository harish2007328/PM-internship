import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Zap, Code, Palette, BarChart, ArrowRight, Play, Building2, Globe, Cpu, LineChart, MapPin } from 'lucide-react';
import { insforge } from './lib/insforge';

const DemoMode = ({ onSelectProfile, onSelectCompany, setView }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [isProcessing, setIsProcessing] = useState(false);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadDemoData = async () => {
      // Fetch students
      const { data: userData } = await insforge.database.from('pm_users').select('*').limit(5);
      if (userData) {
        setStudents(userData.map((s, i) => ({
          ...s,
          icon: [Code, Zap, BarChart, Palette, Globe][i % 5],
          color: ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-sky-500"][i % 5],
          category: s.major
        })));
      }
      // Fetch jobs
      const { data: jobsData } = await insforge.database.from('pm_jobs').select('*').limit(5);
      if (jobsData) {
        setCompanies(jobsData.map((c, i) => ({
          ...c,
          icon: [Cpu, Building2, LineChart, Palette, Globe][i % 5],
          color: ["bg-indigo-600", "bg-amber-600", "bg-emerald-600", "bg-rose-500", "bg-sky-600"][i % 5],
          category: c.sector
        })));
      }
    };
    loadDemoData();
  }, []);

  const handleLaunchStudent = (profile) => {
    onSelectProfile(profile.user_id);
  };

  const handleLaunchCompany = (profile) => {
    onSelectCompany(profile.job_id);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-accent/20">
          <Zap size={14} className="fill-accent" /> Live System Showcase
        </div>
        <h1 className="text-5xl font-heading mb-4 text-primary">Intelligence Portal Demo</h1>
        
        <div className="flex justify-center mt-10">
           <div className="bg-white p-1 rounded-2xl shadow-sm border border-border flex gap-1">
             <button 
               onClick={() => setActiveTab('students')}
               className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'students' ? 'bg-primary text-white shadow-lg' : 'text-textSecondary hover:text-primary'}`}
             >
               <User size={16} /> Live Students
             </button>
             <button 
               onClick={() => setActiveTab('companies')}
               className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'companies' ? 'bg-primary text-white shadow-lg' : 'text-textSecondary hover:text-primary'}`}
             >
               <Building2 size={16} /> Live Companies
             </button>
           </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.98 }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeTab === 'students' ? (
            students.map((profile, idx) => (
              <motion.div
                key={profile.user_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group card bg-white border-border hover:border-accent transition-all hover:shadow-xl p-6 relative flex flex-col justify-between"
              >
                <div>
                  <div className={`${profile.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                    <profile.icon size={24} />
                  </div>
                  <h3 className="text-xl font-heading text-primary mb-1">{profile.name}</h3>
                  <p className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-4">{profile.category}</p>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-textSecondary/40">Skills In Inventory</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.split(',').slice(0, 3).map(s => (
                        <span key={s} className="text-[9px] font-bold bg-offWhite px-2 py-0.5 rounded border border-border/50 text-primary/60">{s.trim()}</span>
                      ))}
                      {profile.skills.split(',').length > 3 && <span className="text-[9px] font-bold text-accent">+ more</span>}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleLaunchStudent(profile)}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-[10px]"
                >
                  Enter Student Portal <ArrowRight size={14} />
                </button>
              </motion.div>
            ))
          ) : (
            companies.map((profile, idx) => (
              <motion.div
                key={profile.job_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group card bg-white border-border hover:border-accent transition-all hover:shadow-xl p-6 relative flex flex-col justify-between"
              >
                <div>
                  <div className={`${profile.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                    <profile.icon size={24} />
                  </div>
                  <h3 className="text-xl font-heading text-primary mb-1">{profile.company}</h3>
                  <p className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-4">{profile.role}</p>
                  
                  <div className="space-y-2 mb-6 text-sm">
                    <p className="flex items-center gap-2 font-medium text-textSecondary text-xs">
                       <Zap size={14} className="text-accent" /> {profile.sector} Sector
                    </p>
                    <p className="flex items-center gap-2 font-medium text-textSecondary text-xs">
                       <MapPin size={14} className="text-primary/40" /> {profile.location}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleLaunchCompany(profile)}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-[10px] bg-primary group-hover:bg-accent group-hover:border-accent"
                >
                  Open Company Console <Play size={14} className="fill-white" />
                </button>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-16 p-8 bg-black text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="text-2xl font-heading mb-2">Simulate Real Interaction</h2>
          <p className="text-white/40 text-sm max-w-md">Our AI handles thousands of multi-dimensional matches per second using vector similarity. Launch any profile to see the results.</p>
        </div>
        <div className="flex gap-4 relative z-10 w-full md:w-auto">
          <button onClick={() => setView('user')} className="flex-1 md:flex-none bg-white text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-offWhite transition-all shadow-xl">Manual Test</button>
        </div>
      </div>
    </div>
  );
};

export default DemoMode;
