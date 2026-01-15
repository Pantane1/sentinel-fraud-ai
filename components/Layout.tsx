
import React, { useState } from 'react';
import { AppStep } from '../types';
import FeedbackModal from './FeedbackModal';
import PantaneAssistant from './PantaneAssistant';
import { 
  LayoutDashboard, 
  Upload, 
  Settings2, 
  Cpu, 
  BarChart3, 
  Zap,
  ShieldCheck,
  MessageCircleQuestion
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeStep: AppStep;
  onStepChange: (step: AppStep) => void;
  canNavigate: (step: AppStep) => boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeStep, onStepChange, canNavigate }) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const menuItems = [
    { id: AppStep.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppStep.UPLOAD, label: 'Data Ingestion', icon: Upload },
    { id: AppStep.PREPROCESS, label: 'Preprocessing', icon: Settings2 },
    { id: AppStep.TRAIN, label: 'Model Training', icon: Cpu },
    { id: AppStep.EVALUATE, label: 'Evaluation', icon: BarChart3 },
    { id: AppStep.DEPLOY, label: 'Deployment', icon: Zap },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Sentinel AI
          </h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeStep === item.id;
            const disabled = !canNavigate(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => !disabled && onStepChange(item.id)}
                disabled={disabled}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                    : disabled
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors group"
          >
            <MessageCircleQuestion className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
            Send Feedback
          </button>
          
          <div className="bg-slate-800/50 rounded-xl p-4 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Model Engine Online</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              V3.4.1 Active | Powered by{' '}
              <a 
                href="https://wamuhu-martin.vercel.app/#contact" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-bold tracking-tight hover:underline underline-offset-2 decoration-blue-500/30"
              >
                PANTANE
              </a>
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 relative">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
        
        {/* Pantane AI Assistant */}
        <PantaneAssistant />
      </main>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </div>
  );
};

export default Layout;
