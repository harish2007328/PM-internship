import React, { useState, useEffect } from 'react';
import Register from './Register';
import CompanyDashboard from './CompanyDashboard';
import StudentFeed from './StudentFeed';
import DemoMode from './DemoMode';
import { User, Building2, LayoutGrid, LogOut, Mail, MapPin, Briefcase, Zap } from 'lucide-react';
import { insforge } from './lib/insforge';

function App() {
  const [view, setView] = useState('demo'); // Default to 'demo' for hackathon
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (currentUserId) {
      insforge.database.from('pm_users').select('*').eq('user_id', currentUserId).single()
        .then(({ data, error }) => {
          if (!error) setUserProfile(data);
        })
        .catch(err => console.error(err));
    } else {
      setUserProfile(null);
    }
  }, [currentUserId]);

  const startStudentFeed = (userId) => {
    setCurrentUserId(userId);
    setCurrentJobId(null);
    setView('student_feed');
  };

  const startCompanyConsole = (jobId) => {
    setCurrentJobId(jobId);
    setCurrentUserId(null);
    setView('company');
  };

  const logout = () => {
    setCurrentUserId(null);
    setCurrentJobId(null);
    setUserProfile(null);
    setView('demo');
  };

  return (
    <div className="h-screen bg-offWhite text-textPrimary selection:bg-accent/20 flex flex-col overflow-hidden">
      {/* Shared Navigation */}
      <nav className="h-14 bg-white/80 backdrop-blur-md border-b border-border px-6 flex justify-between items-center shadow-sm shrink-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-heading font-bold text-xl shadow-lg">P</div>
          <span className="font-heading font-bold text-xl tracking-tight text-primary">PM Portal</span>
        </div>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setView('demo')}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${view === 'demo' ? 'text-accent border-b-2 border-accent pb-1' : 'text-textSecondary hover:text-primary'}`}
          >
            <Zap size={16} /> Showcase
          </button>

          <button 
            onClick={() => setView('user')}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${view === 'user' ? 'text-accent border-b-2 border-accent pb-1' : 'text-textSecondary hover:text-primary'}`}
          >
            <User size={16} /> Students
          </button>
          
          <button 
            onClick={() => { setView('company'); setCurrentJobId(null); }}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${view === 'company' ? 'text-accent border-b-2 border-accent pb-1' : 'text-textSecondary hover:text-primary'}`}
          >
            <Building2 size={16} /> Companies
          </button>

          {currentUserId && (
            <button 
              onClick={() => setView('student_feed')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${view === 'student_feed' ? 'text-accent border-b-2 border-accent pb-1' : 'text-textSecondary hover:text-primary'}`}
            >
              <LayoutGrid size={16} /> My Feed
            </button>
          )}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Profile Sidebar - Full height */}
        {view === 'student_feed' && userProfile && (
          <aside className="w-64 bg-white border-r border-[#E2E0DC] hidden lg:flex flex-col h-full shrink-0">
            <div className="p-6 border-b border-[#F5F4F2] text-center">
              <div className="w-16 h-16 bg-[#1C2340]/5 text-[#1C2340] rounded-lg flex items-center justify-center mx-auto mb-3 border border-[#E2E0DC] shadow-sm">
                 <User size={32} />
              </div>
              <h2 className="text-sm font-heading font-black text-[#1C2340] leading-tight mb-1">{userProfile.name}</h2>
              <span className="text-[8px] uppercase font-black tracking-[0.2em] text-[#E05C2A] bg-[#E05C2A]/5 px-2 py-0.5 rounded">Student Profile</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div className="space-y-5">
                 <div className="group">
                   <p className="text-[8px] uppercase font-black text-[#6B7280] tracking-[0.2em] opacity-40 mb-2">Email Address</p>
                   <p className="text-[11px] font-bold text-[#1C2340] break-all group-hover:text-[#E05C2A] transition-colors">{userProfile.email}</p>
                 </div>

                 <div className="group">
                   <p className="text-[8px] uppercase font-black text-[#6B7280] tracking-[0.2em] opacity-40 mb-2">Location</p>
                   <p className="text-[11px] font-bold text-[#1C2340] flex items-center gap-1.5 uppercase group-hover:text-[#E05C2A] transition-colors">
                     <MapPin size={12} /> {userProfile.location}
                   </p>
                 </div>

                 <div className="group">
                   <p className="text-[8px] uppercase font-black text-[#6B7280] tracking-[0.2em] opacity-40 mb-2">Major</p>
                   <p className="text-[11px] font-bold text-[#1C2340] flex items-center gap-1.5 group-hover:text-[#E05C2A] transition-colors">
                     <Briefcase size={12} /> {userProfile.major}
                   </p>
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[8px] uppercase font-black text-[#6B7280] tracking-[0.2em] opacity-40">Skills</p>
                 <div className="flex flex-wrap gap-1.5 pt-1">
                   {userProfile.skills.split(',').map(skill => (
                     <span key={skill} className="bg-[#F5F4F2] text-[#1C2340] text-[9px] font-bold px-2 py-0.5 rounded border border-[#E2E0DC]/60 uppercase tracking-tighter">
                       {skill.trim()}
                     </span>
                   ))}
                 </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#F5F4F2]">
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {view === 'demo' && <DemoMode setView={setView} onSelectProfile={startStudentFeed} onSelectCompany={startCompanyConsole} />}
          {view === 'user' && <Register onRegistrationSuccess={startStudentFeed} />}
          {view === 'student_feed' && <StudentFeed userId={currentUserId} />}
          {view === 'company' && <CompanyDashboard preSelectedJobId={currentJobId} />}
        </main>
      </div>
    </div>
  );
}

export default App;
