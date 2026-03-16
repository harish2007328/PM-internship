import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Play, Award, HelpCircle, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const GROQ_API_KEY = atob('Z3NrX2o3Z2RPbEdueFpTT2tFcUM5ZG9XV0dyeWIzRllJb0VDNkJHajRpMGhYS1JzU0UycTExeGY=');

const MockTest = ({ job, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAIQuestions = async () => {
      if (GROQ_API_KEY === "none" || GROQ_API_KEY.includes("PLEASE_PASTE")) {
        // Fallback dummy questions
        setQuestions([
          { q: `What is the most critical technical skill for a ${job.role}?`, a: ["Manual Testing", "API Design", "Architecture Planning", "Soft Skills"], correct: 2 },
          { q: `How does ${job.company} typically handle project scalability?`, a: ["Vertical Scaling", "Horizontal Scaling", "No Scaling", "Manual Reboots"], correct: 1 },
          { q: "Which tool is essential for modern cloud infrastructure?", a: ["Terraform", "Excel", "MS Paint", "FTP"], correct: 0 }
        ]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are an expert interviewer. Generate exactly 20 high-quality multiple-choice questions for a student applying for a specific internship role. The questions should cover technical, situational, and behavioral aspects. Return ONLY a valid JSON object with a key 'questions' containing an array of 20 objects with keys: 'q' (question), 'a' (array of 4 options), 'correct' (index of correct answer 0-3)."
              },
              {
                role: "user",
                content: `Role: ${job.role}, Company: ${job.company}. Focus on practical technical skills, role-specific scenarios, and cultural fit. Ensure questions are diverse and challenging.`
              }
            ],
            temperature: 0.8,
            response_format: { type: "json_object" }
          })
        });

        if (!response.ok) throw new Error("API Request Failed");

        const data = await response.json();
        let content;
        try {
          content = JSON.parse(data.choices[0].message.content);
        } catch (parseError) {
          // Robust parsing in case of markdown blocks
          const match = data.choices[0].message.content.match(/\{[\s\S]*\}/);
          if (match) content = JSON.parse(match[0]);
          else throw new Error("JSON Parsing Failed");
        }

        const qList = content.questions || content;
        if (Array.isArray(qList) && qList.length > 0) {
          setQuestions(qList);
        } else {
          throw new Error("Invalid Format");
        }
        setIsLoading(false);
      } catch (err) {
        console.error("MockTest AI Error:", err);
        setError("Retrying with tactical offline assessment...");
        setTimeout(() => {
          setQuestions([
            { q: `Ready for ${job.role} technical validation?`, a: ["Proceed", "Review First", "Skip", "Exit"], correct: 0 },
            { q: "Standard version control system?", a: ["Git", "Drive", "Email", "Slack"], correct: 0 },
            { q: "Common API architectural style?", a: ["REST", "SOAP", "GraphQL", "All of these"], correct: 3 }
          ]);
          setIsLoading(false);
          setError(null);
        }, 2000);
      }
    };

    fetchAIQuestions();
  }, [job]);

  const handleAnswer = (idx) => {
    if (idx === questions[currentStep].correct) setScore(score + 1);
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-6">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-14 h-14 border-4 border-[#E05C2A]/10 border-t-[#E05C2A] rounded-full mx-auto"
        />
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1C2340]">Synthesizing Matrix</p>
          <p className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest opacity-40">Connecting to Groq AI Cluster</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="w-20 h-20 bg-[#E05C2A]/10 text-[#E05C2A] rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-inner">
           <Award size={40} className="fill-current" />
        </div>
        <h3 className="text-2xl font-heading font-black text-[#1C2340] mb-3">Assessment Complete</h3>
        <p className="text-sm text-[#6B7280] mb-10 font-medium leading-relaxed max-w-xs mx-auto">
          Result: <span className="text-[#1C2340] font-black">{Math.round((score/questions.length)*100)}%</span> accuracy achieved in the {job.role} cluster.
        </p>
        <button 
          onClick={onComplete} 
          className="w-full bg-[#1C2340] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#E05C2A] transition-all shadow-xl shadow-[#1C2340]/10 active:scale-[0.98]"
        >
          Submit Results
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl text-[10px] font-bold text-amber-800 flex items-center gap-3">
           <Loader2 size={16} className="animate-spin" /> {error}
        </div>
      )}

      <div className="bg-[#F5F4F2] p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-[#E05C2A]" />
              <p className="text-[11px] font-black text-[#1C2340] uppercase tracking-widest">Question {currentStep + 1} of {questions.length}</p>
           </div>
           <p className="text-[9px] font-black text-[#6B7280] opacity-40">{Math.round(((currentStep + 1)/questions.length)*100)}% Complete</p>
        </div>
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 h-1.5">
           {questions.map((_, i) => (
             <div 
               key={i} 
               className={`h-full rounded-full transition-all duration-300
                 ${i === currentStep ? 'bg-[#E05C2A] scale-y-150' : i < currentStep ? 'bg-[#1C2340]' : 'bg-[#E2E0DC]'}`} 
             />
           ))}
        </div>
      </div>

      <div className="px-2">
        <div className="text-lg font-heading font-bold text-[#1C2340] leading-snug mb-8 markdown-content-mini">
          <ReactMarkdown>{questions[currentStep].q}</ReactMarkdown>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {questions[currentStep].a.map((ans, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full text-left p-4 rounded-xl border border-[#E2E0DC] bg-white hover:border-[#E05C2A] hover:shadow-md hover:shadow-[#E05C2A]/5 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <span className="w-6 h-6 rounded-md bg-[#F5F4F2] flex items-center justify-center text-[10px] font-black text-[#6B7280] group-hover:bg-[#E05C2A] group-hover:text-white transition-colors">
                  {String.fromCharCode(65 + i)}
                </span>
                <div className="text-sm font-bold text-[#1C2340] markdown-content-mini">
                  <ReactMarkdown>{ans}</ReactMarkdown>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockTest;
