import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Phone, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  User as UserIcon,
  Circle,
  ArrowRight
} from 'lucide-react';

// --- Constants ---
const PREDEFINED_SKILLS = [
  'Python', 'Java', 'C++', 'JavaScript', 'React', 'Node.js', 'Excel', 'PowerPoint', 
  'SQL', 'Machine Learning', 'Data Analysis', 'Figma', 'Photoshop', 'AutoCAD', 
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Content Writing', 
  'Social Media', 'Digital Marketing', 'Project Management', 'Tally', 'Accounting', 
  'Research', 'Public Speaking'
];

const PREDEFINED_LANGUAGES = [
  'Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 
  'Gujarati', 'Punjabi', 'Urdu', 'Odia', 'Assamese', 'Sanskrit', 'French', 'German', 
  'Spanish', 'Japanese', 'Chinese', 'Arabic'
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const CASTE_CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", 
  "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Tenkasi"
];

const MAJORS = [
  "AI & Data Science", "Computer Science", "Mechanical", "ECE", "Civil", 
  "Electrical", "Information Technology", "Business Management"
];

const QUALIFICATIONS = ['10th', '12th', 'Graduation', 'Post Graduation', 'Diploma'];

const COURSES = [
  "B.Tech", "B.E.", "BCA", "BSc", "M.Tech", "MBA", "B.Com", "MSc", "10th Standard", "12th Standard"
];

// --- Helper Components ---

const InputField = ({ label, required, children, error }) => (
  <div className="flex flex-col mb-4">
    <label className="input-label">
      {label} {required && <span className="text-accent">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const PreviewItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3">
    {Icon && <Icon size={16} className="text-textSecondary mt-0.5" />}
    <div>
      <p className="text-[10px] uppercase tracking-wider text-textSecondary font-bold">{label}</p>
      <p className="text-sm font-medium text-primary">{value || '-'}</p>
    </div>
  </div>
);

const ProgressBar = ({ currentStep }) => {
  const steps = ['Personal', 'Contact', 'Education', 'Skills'];
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="mb-12">
      <div className="relative h-1 bg-border rounded-full overflow-hidden">
        <motion.div 
          className="absolute h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className={`text-[10px] font-bold uppercase tracking-tighter ${idx <= currentStep ? 'text-primary' : 'text-textSecondary'}`}>
              {step}
            </div>
            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${idx <= currentStep ? 'bg-accent' : 'bg-border'}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Form Sections ---

const PersonalSection = ({ data, updateData, onConfirm, isPreview, onEdit }) => {
  if (isPreview) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card relative">
        <button onClick={onEdit} className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-accent border border-accent rounded px-2 py-1 hover:bg-accent hover:text-white transition-colors">Edit</button>
        <h3 className="mb-6 flex items-center gap-2"><UserIcon size={20} /> Personal Details</h3>
        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
          <PreviewItem label="Full Name" value={data.name} />
          <PreviewItem label="DOB" value={`${data.dobDay}/${data.dobMonth}/${data.dobYear}`} />
          <PreviewItem label="Gender" value={data.gender} />
          <PreviewItem label="Category" value={data.caste} />
          <div className="col-span-2 space-y-4">
            <h4 className="text-xs font-bold border-b border-border pb-1 mb-2">Address</h4>
            <div className="grid grid-cols-2 gap-4">
              <PreviewItem label="Line 1" value={data.address1} />
              <PreviewItem label="City" value={data.city} />
              <PreviewItem label="State" value={data.state} />
              <PreviewItem label="PIN" value={data.pincode} />
            </div>
          </div>
          <PreviewItem label="Income" value={data.family_income} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <InputField label="Full Name" required>
        <input 
          className="form-input" 
          type="text" 
          value={data.name} 
          onChange={(e) => updateData({ name: e.target.value })} 
          placeholder="e.ai John Doe"
        />
      </InputField>

      <div className="grid grid-cols-3 gap-4">
        <InputField label="DOB (Day)" required>
          <select className="form-input" value={data.dobDay} onChange={(e) => updateData({ dobDay: e.target.value })}>
            <option value="">DD</option>
            {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
        </InputField>
        <InputField label="Month" required>
          <select className="form-input" value={data.dobMonth} onChange={(e) => updateData({ dobMonth: e.target.value })}>
            <option value="">MM</option>
            {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
        </InputField>
        <InputField label="Year" required>
          <select className="form-input" value={data.dobYear} onChange={(e) => updateData({ dobYear: e.target.value })}>
            <option value="">YYYY</option>
            {[...Array(50)].map((_, i) => <option key={2010-i} value={2010-i}>{2010-i}</option>)}
          </select>
        </InputField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Gender" required>
          <select className="form-input" value={data.gender} onChange={(e) => updateData({ gender: e.target.value })}>
            <option value="">Select Gender</option>
            {['Male', 'Female', 'Other'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </InputField>
        <InputField label="Category" required>
          <select className="form-input" value={data.caste} onChange={(e) => updateData({ caste: e.target.value })}>
            <option value="">Select Category</option>
            {CASTE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </InputField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Father's Name">
          <input className="form-input" type="text" value={data.father} onChange={(e) => updateData({ father: e.target.value })} />
        </InputField>
        <InputField label="Mother's Name">
          <input className="form-input" type="text" value={data.mother} onChange={(e) => updateData({ mother: e.target.value })} />
        </InputField>
      </div>

      <div className="space-y-4">
        <InputField label="Address Line 1" required>
          <input className="form-input" type="text" value={data.address1} onChange={(e) => updateData({ address1: e.target.value })} />
        </InputField>
        <div className="grid grid-cols-3 gap-4">
          <InputField label="City" required>
            <select className="form-input" value={data.city} onChange={(e) => updateData({ city: e.target.value })}>
              <option value="">Select City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </InputField>
          <InputField label="State" required>
            <select className="form-input" value={data.state} onChange={(e) => updateData({ state: e.target.value })}>
              <option value="">Select State</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </InputField>
          <InputField label="PIN Code" required>
            <input className="form-input" type="text" maxLength={6} value={data.pincode} onChange={(e) => updateData({ pincode: e.target.value })} />
          </InputField>
        </div>
      </div>

      <InputField label="Family Annual Income" required>
        <select className="form-input" value={data.family_income} onChange={(e) => updateData({ family_income: e.target.value })}>
          <option value="">Select Range</option>
          <option value="< 2L">Less than 2 Lakhs</option>
          <option value="2L - 5L">2 Lakhs - 5 Lakhs</option>
          <option value="5L - 8L">5 Lakhs - 8 Lakhs</option>
          <option value="> 8L">More than 8 Lakhs</option>
        </select>
      </InputField>

      <button onClick={onConfirm} className="btn-primary w-full">Confirm Personal Details</button>
    </motion.div>
  );
};

// --- Main App Component ---

const ContactSection = ({ data, updateData, onConfirm, isPreview, onEdit }) => {
  if (isPreview) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card relative">
        <button onClick={onEdit} className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-accent border border-accent rounded px-2 py-1 hover:bg-accent hover:text-white transition-colors">Edit</button>
        <h3 className="mb-6 flex items-center gap-2"><Phone size={20} /> Contact Information</h3>
        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
          <PreviewItem label="Primary Mobile" value={`+91 ${data.mobile.slice(0, 2)}****${data.mobile.slice(6)}`} icon={Phone} />
          <PreviewItem label="Email Address" value={data.email} icon={Mail} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Primary Mobile" required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary text-sm">+91</span>
            <input 
              className="form-input pl-14" 
              type="text" 
              value={data.mobile} 
              onChange={(e) => updateData({ mobile: e.target.value })} 
              placeholder="9876543210"
            />
          </div>
        </InputField>
        <InputField label="Email Address" required>
          <input 
            className="form-input" 
            type="email" 
            value={data.email} 
            onChange={(e) => updateData({ email: e.target.value })} 
            placeholder="john@example.com"
          />
        </InputField>
      </div>
      <button onClick={onConfirm} className="btn-primary w-full">Confirm Contact Details</button>
    </motion.div>
  );
};

const EducationSection = ({ data, updateData, onConfirm, isPreview, onEdit }) => {
  const [currentEdu, setCurrentEdu] = useState({ 
    qualification: '', course: '', specialization: '', institute: '', year: '', scoreType: '', score: '' 
  });

  const addEducation = () => {
    if (currentEdu.qualification && currentEdu.course) {
      updateData({ education: [...data.education, currentEdu] });
      setCurrentEdu({ qualification: '', course: '', specialization: '', institute: '', year: '', scoreType: '', score: '' });
    }
  };

  const removeEdu = (index) => {
    updateData({ education: data.education.filter((_, i) => i !== index) });
  };

  if (isPreview) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card relative">
        <button onClick={onEdit} className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-accent border border-accent rounded px-2 py-1 hover:bg-accent hover:text-white transition-colors">Edit</button>
        <h3 className="mb-6 flex items-center gap-2"><GraduationCap size={20} /> Education</h3>
        <div className="space-y-4">
          {data.education.map((edu, idx) => (
            <div key={idx} className="p-4 border border-border rounded-input bg-offWhite/50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-primary">{edu.qualification} - {edu.course}</h4>
                <span className="text-xs font-medium text-textSecondary">{edu.year}</span>
              </div>
              <p className="text-xs text-textSecondary">{edu.institute}</p>
              <p className="text-xs font-bold text-accent mt-2">{edu.scoreType}: {edu.score}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="space-y-4">
        {data.education.map((edu, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 border border-border rounded bg-offWhite/30">
            <span className="text-sm font-medium">{edu.qualification} - {edu.course}</span>
            <button onClick={() => removeEdu(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      <div className="card border-dashed border-2 bg-transparent">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Qualification" required>
            <select className="form-input" value={currentEdu.qualification} onChange={e => setCurrentEdu({...currentEdu, qualification: e.target.value})}>
              <option value="">Select</option>
              {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </InputField>
          <InputField label="Course" required>
            <select className="form-input" value={currentEdu.course} onChange={e => setCurrentEdu({...currentEdu, course: e.target.value})}>
              <option value="">Select Course</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </InputField>
          <InputField label="Institute" required>
            <input className="form-input" type="text" value={currentEdu.institute} onChange={e => setCurrentEdu({...currentEdu, institute: e.target.value})} />
          </InputField>
          <InputField label="Year of Passing" required>
            <select className="form-input" value={currentEdu.year} onChange={e => setCurrentEdu({...currentEdu, year: e.target.value})}>
              <option value="">Year</option>
              {[...Array(20)].map((_, i) => <option key={2026-i} value={2026-i}>{2026-i}</option>)}
            </select>
          </InputField>
          <InputField label="Score Type" required>
            <select className="form-input" value={currentEdu.scoreType} onChange={e => setCurrentEdu({...currentEdu, scoreType: e.target.value})}>
              <option value="Percentage">Percentage</option>
              <option value="CGPA">CGPA</option>
            </select>
          </InputField>
          <InputField label="Score" required>
            <input className="form-input" type="text" value={currentEdu.score} onChange={e => setCurrentEdu({...currentEdu, score: e.target.value})} />
          </InputField>
        </div>
        <button onClick={addEducation} className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary border border-primary rounded-input px-4 py-2 hover:bg-primary hover:text-white transition-all">
          <Plus size={14} /> Add Education
        </button>
      </div>

      <button onClick={onConfirm} disabled={data.education.length === 0} className="btn-primary w-full">Confirm Education Details</button>
    </motion.div>
  );
};

const TagInput = ({ label, items, setItems, suggestions, max }) => {
  const [input, setInput] = useState('');
  const [filtered, setFiltered] = useState([]);

  const handleInput = (val) => {
    setInput(val);
    if (val.length > 0) {
      setFiltered(suggestions.filter(s => s.toLowerCase().includes(val.toLowerCase()) && !items.includes(s)));
    } else {
      setFiltered([]);
    }
  };

  const addItem = (item) => {
    if (items.length < max && !items.includes(item)) {
      setItems([...items, item]);
      setInput('');
      setFiltered([]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="input-label">{label} ({items.length}/{max})</label>
      <div className="relative">
        <input 
          className="form-input" 
          value={input} 
          onChange={e => handleInput(e.target.value)} 
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              if (input.trim()) addItem(input.trim().replace(',', ''));
            }
          }}
          onBlur={() => {
            if (input.trim()) addItem(input.trim());
          }}
          placeholder={`Search or add ${label.toLowerCase()}...`}
        />
        {filtered.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-input shadow-lg overflow-hidden">
            {filtered.map(s => (
              <button key={s} onClick={() => addItem(s)} className="w-full text-left px-4 py-2 text-sm hover:bg-offWhite transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map(t => (
          <motion.span 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            key={t} 
            className="flex items-center gap-1.5 bg-primary text-white text-[11px] font-bold uppercase px-2.5 py-1 rounded-full"
          >
            {t} <button onClick={() => setItems(items.filter(i => i !== t))}><X size={12} /></button>
          </motion.span>
        ))}
      </div>
    </div>
  );
};

const SkillsSection = ({ data, updateData, onConfirm, isPreview, onEdit }) => {
  if (isPreview) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card relative">
        <button onClick={onEdit} className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-accent border border-accent rounded px-2 py-1 hover:bg-accent hover:text-white transition-colors">Edit</button>
        <h3 className="mb-6 flex items-center gap-2"><Briefcase size={20} /> Skills & Experience</h3>
        <div className="space-y-6">
          <div>
            <p className="text-[10px] uppercase font-bold text-textSecondary mb-2">Technical Skills</p>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(s => <span key={s} className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{s}</span>)}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-textSecondary mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {data.languages.map(l => <span key={l} className="bg-offWhite border border-border text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{l}</span>)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div exit={{ opacity: 0, y: -20 }} className="space-y-8">
      <InputField label="Major / Specialization" required>
        <select className="form-input" value={data.major} onChange={e => updateData({ major: e.target.value })}>
          <option value="">Select Major</option>
          {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </InputField>
      
      <TagInput 
        label="Skills" 
        items={data.skills} 
        setItems={(val) => updateData({ skills: val })} 
        suggestions={PREDEFINED_SKILLS} 
        max={20} 
      />

      <TagInput 
        label="Languages" 
        items={data.languages} 
        setItems={(val) => updateData({ languages: val })} 
        suggestions={PREDEFINED_LANGUAGES} 
        max={10} 
      />

      <button onClick={onConfirm} className="btn-primary w-full">Save & Review All</button>
    </motion.div>
  );
};

const SuccessScreen = ({ onViewFeed }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 px-6 card border-success bg-green-50/10">
    <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
      <Check size={32} />
    </div>
    <h2 className="text-2xl font-heading mb-3">Application Submitted!</h2>
    <p className="text-textSecondary mb-8 max-w-sm mx-auto">Your registration is successful. We've analyzed your profile and found 30 matches.</p>
    <button onClick={onViewFeed} className="btn-primary flex items-center gap-2 mx-auto">
      View Your Matches <ArrowRight size={18} />
    </button>
  </motion.div>
);

// --- Main App Component ---

const Register = ({ onRegistrationSuccess }) => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState({ 0: false, 1: false, 2: false, 3: false });
  const [formData, setFormData] = useState({
    name: '', dobDay: '', dobMonth: '', dobYear: '', gender: '', caste: '', father: '', mother: '', address1: '', city: '', state: '', pincode: '', family_income: '',
    mobile: '', email: '',
    education: [],
    skills: [],
    languages: [],
    experience: [],
    major: ''
  });

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const currentSectionConfirmed = previews[step];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        caste: formData.caste,
        location: formData.city, // using city for location
        family_income: formData.family_income,
        major: formData.major,
        skills: formData.skills.join(', ')
      };

      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        setRegisteredUserId(result.user_id);
        setSubmitted(true);
      } else {
        alert('Failed to register. Please ensure backend is running.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Is the backend server running at localhost:8000?');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return (
    <div className="max-w-2xl mx-auto py-24">
      <SuccessScreen onViewFeed={() => onRegistrationSuccess(registeredUserId)} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <header className="mb-12">
        <h1 className="text-3xl font-heading mb-2">Registration Portal</h1>
        <p className="text-textSecondary">Complete your profile to find the perfect internship.</p>
      </header>

      <ProgressBar currentStep={step} />

      <main className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <PersonalSection 
              key="step0"
              data={formData} 
              updateData={updateFormData} 
              isPreview={previews[0]}
              onConfirm={() => setPreviews(prev => ({...prev, 0: true}))}
              onEdit={() => setPreviews(prev => ({...prev, 0: false}))}
            />
          )}
          {step === 1 && (
             <ContactSection 
                key="step1"
                data={formData} 
                updateData={updateFormData} 
                isPreview={previews[1]}
                onConfirm={() => setPreviews(prev => ({...prev, 1: true}))}
                onEdit={() => setPreviews(prev => ({...prev, 1: false}))}
             />
          )}
          {step === 2 && (
             <EducationSection 
                key="step2"
                data={formData} 
                updateData={updateFormData} 
                isPreview={previews[2]}
                onConfirm={() => setPreviews(prev => ({...prev, 2: true}))}
                onEdit={() => setPreviews(prev => ({...prev, 2: false}))}
             />
          )}
          {step === 3 && (
             <SkillsSection 
                key="step3"
                data={formData} 
                updateData={updateFormData} 
                isPreview={previews[3]}
                onConfirm={() => setPreviews(prev => ({...prev, 3: true}))}
                onEdit={() => setPreviews(prev => ({...prev, 3: false}))}
             />
          )}
        </AnimatePresence>

        {currentSectionConfirmed && step < 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-between items-center"
          >
            <button onClick={handleBack} className="btn-secondary flex items-center gap-2">
              <ChevronLeft size={16} /> Previous
            </button>
            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
              Continue to {step === 0 ? 'Contact' : step === 1 ? 'Education' : 'Skills'} <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {Object.values(previews).every(v => v === true) && step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 space-y-4">
            <p className="text-center text-xs font-bold text-textSecondary uppercase tracking-widest">Ready to submit?</p>
            <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary w-full py-4 text-lg">
              {isSubmitting ? 'Submitting...' : 'Submit Final Application'}
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Register;

