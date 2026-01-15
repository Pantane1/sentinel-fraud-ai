
import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { FeedbackData, FeedbackCategory } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData>({
    category: 'General',
    message: '',
    email: ''
  });
  const [aiResponse, setAiResponse] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.message) return;
    
    setLoading(true);
    try {
      const response = await geminiService.processFeedback(feedback);
      setAiResponse(response.acknowledgment);
      setStep('success');
    } catch (err) {
      console.error("Failed to submit feedback", err);
      setAiResponse("Thank you for your feedback. We have received it and will look into it.");
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('form');
    setFeedback({ category: 'General', message: '', email: '' });
    setAiResponse('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl shadow-blue-500/10">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 rounded-xl">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Platform Feedback</h2>
          </div>
          <button onClick={reset} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['General', 'Bug Report', 'Feature Request'] as FeedbackCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFeedback({ ...feedback, category: cat })}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                        feedback.category === cat 
                          ? 'bg-blue-600 border-blue-500 text-white' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Your Message</label>
                <textarea
                  required
                  value={feedback.message}
                  onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                  placeholder="Tell us how we can improve Sentinel AI..."
                  className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={feedback.email}
                  onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                  placeholder="engineer@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !feedback.message}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Feedback
              </button>
            </form>
          ) : (
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Feedback Received</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-8">
                <p className="text-sm text-slate-400 italic leading-relaxed">
                  "{aiResponse}"
                </p>
              </div>
              <button
                onClick={reset}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
