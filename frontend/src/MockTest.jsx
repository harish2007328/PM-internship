import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Play, Award, HelpCircle, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { insforge } from './lib/insforge';

const MockTest = ({ job, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isStepFeedback, setIsStepFeedback] = useState(false);

  useEffect(() => {
    const fetchAIQuestions = async () => {
      try {
        const response = await insforge.ai.chat.completions.create({
          model: "openai/gpt-4o-mini",
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
          temperature: 0.8
        });

        if (!response || !response.choices || !response.choices[0]) {
          throw new Error("API Request Failed");
        }

        let content;
        const rawContent = response.choices[0].message.content;
        try {
          content = JSON.parse(rawContent);
        } catch (parseError) {
          const match = rawContent.match(/\{[\s\S]*\}/);
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
    if (isStepFeedback) return;
    setSelectedIdx(idx);
    setIsStepFeedback(true);
    if (idx === questions[currentStep].correct) {
      setScore(s => s + 1);
    }
  };

  const goToNextStep = () => {
    setSelectedIdx(null);
    setIsStepFeedback(false);
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
          Final Score: <span className="text-[#1C2340] font-black">{score} / {questions.length}</span>
          <br />
          Accuracy: <span className="text-[#E05C2A] font-black">{Math.round((score/questions.length)*100)}%</span>
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
          {questions[currentStep].a.map((ans, i) => {
            const isCorrect = i === questions[currentStep].correct;
            const isSelected = i === selectedIdx;
            
            let btnClass = "border-[#E2E0DC] bg-white";
            if (isStepFeedback) {
              if (isCorrect) btnClass = "border-green-500 bg-green-50";
              else if (isSelected) btnClass = "border-red-500 bg-red-50";
              else btnClass = "border-[#E2E0DC] bg-white opacity-50";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={isStepFeedback}
                className={`w-full text-left p-4 rounded-xl border transition-all group relative overflow-hidden ${btnClass}`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black transition-colors
                    ${isStepFeedback && isCorrect ? 'bg-green-600 text-white' : 
                      isStepFeedback && isSelected ? 'bg-red-600 text-white' : 
                      'bg-[#F5F4F2] text-[#6B7280] group-hover:bg-[#E05C2A] group-hover:text-white'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <div className="text-sm font-bold text-[#1C2340] markdown-content-mini">
                    <ReactMarkdown>{ans}</ReactMarkdown>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {isStepFeedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <button 
              onClick={goToNextStep}
              className="w-full bg-[#E05C2A] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
              {currentStep < questions.length - 1 ? "Next Question" : "View Final Results"} <ChevronRight size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MockTest;
