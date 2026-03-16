import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, MinusCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const GROQ_API_KEY = atob('Z3NrX2o3Z2RPbEdueFpTT2tFcUM5ZG9XV0dyeWIzRllJb0VDNkJHajRpMGhYS1JzU0UycTExeGY=');

const ChatBot = ({ userSkills, matches }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI Career Assistant. I can help you understand the PM Internship scheme, analyze how your skills match current openings, and suggest steps to improve your chances. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

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
              content: `You are a career consultant for the PM Internship Scheme. 
              CONTEXT:
              - User Skills: ${userSkills || 'Not provided'}
              - Top Match: ${matches?.[0]?.role} at ${matches?.[0]?.company} (${Math.round(matches?.[0]?.score * 100)}% match)
              - Scheme Goal: Provide 1 crore internships over 5 years in top 500 companies.
              - Monthly Stipend: ₹5,000 + ₹6,000 one-time assistance.
              
              YOUR CAPABILITIES:
              1. Answer about the PM Internship Scheme rules.
              2. Compare user's skills with the provided internship list.
              3. Suggest specific internships from the list that fit the user.
              4. Advise on skill gaps for roles they like.
              
              STYLE: Professional, encouraging, and tactical. Use bullet points and bold text for emphasis. Keep formatting clean.`
            },
            ...messages.slice(-5), // Send last 5 messages for context
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 600
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a synchronization error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#1C2340] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#E05C2A] transition-all z-[80] group"
      >
        <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[85] flex justify-end pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#1C2340]/10 backdrop-blur-sm pointer-events-auto" 
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-[450px] max-w-full h-full bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-[#E2E0DC] flex flex-col overflow-hidden pointer-events-auto"
            >
            {/* Header */}
            <div className="p-6 bg-[#1C2340] text-white flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-[#E05C2A] rounded-xl flex items-center justify-center">
                    <Bot size={20} />
                 </div>
                 <div>
                   <h3 className="text-sm font-black uppercase tracking-widest">Career AI</h3>
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-bold text-white/60">ONLINE</span>
                   </div>
                 </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
               </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#FDFCFB]">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center
                        ${msg.role === 'user' ? 'bg-[#1C2340] text-white' : 'bg-[#E2E0DC] text-[#1C2340]'}`}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={`p-4 rounded-2xl text-[11px] leading-relaxed font-medium shadow-sm markdown-content
                        ${msg.role === 'user' ? 'bg-[#1C2340] text-white rounded-tr-none' : 'bg-white border border-[#E2E0DC] text-[#1C2340] rounded-tl-none'}`}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                   </div>
                 </div>
               ))}
               {isLoading && (
                 <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-lg bg-[#E2E0DC] text-[#1C2340] flex items-center justify-center">
                         <Loader2 size={14} className="animate-spin" />
                      </div>
                      <div className="p-4 bg-white border border-[#E2E0DC] rounded-2xl rounded-tl-none italic text-[10px] text-[#6B7280]">
                         Analyzing matches...
                      </div>
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-[#F5F4F2]">
               <div className="relative">
                 <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Ask about your skill matching..."
                   className="w-full bg-[#F5F4F2] border-none rounded-2xl py-4 pl-5 pr-14 text-xs font-bold text-[#1C2340] focus:ring-2 focus:ring-[#E05C2A] transition-all"
                 />
                 <button 
                   onClick={handleSend}
                   disabled={!input.trim() || isLoading}
                   className="absolute right-2 top-2 w-10 h-10 bg-[#1C2340] text-white rounded-xl flex items-center justify-center hover:bg-[#E05C2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <Send size={16} />
                 </button>
               </div>
               <p className="text-center text-[8px] font-bold text-[#6B7280] uppercase tracking-widest mt-4 opacity-40">
                  Powered by Llama 3.3 Matrix
               </p>
             </div>
           </motion.div>
         </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
