
import React, { useEffect, useState } from 'react';
import { geminiService } from '../services/geminiService';
import { CheckCircle2, Loader2, Database, Layers, ArrowRight } from 'lucide-react';

interface StepPreprocessProps {
  data: any[];
  sample: string;
  onComplete: (analysis: any) => void;
}

const StepPreprocess: React.FC<StepPreprocessProps> = ({ data, sample, onComplete }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([
    { name: 'Schema Discovery', status: 'pending' },
    { name: 'Missing Value Imputation', status: 'pending' },
    { name: 'Feature Scaling (StandardScaler)', status: 'pending' },
    { name: 'Synthetic Minority Over-sampling (SMOTE)', status: 'pending' }
  ]);

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const result = await geminiService.analyzeDataSchema(sample);
        setAnalysis(result);
        
        // Simulate processing steps
        for (let i = 0; i < steps.length; i++) {
          await new Promise(r => setTimeout(r, 800));
          setSteps(prev => {
            const newSteps = [...prev];
            newSteps[i].status = 'complete';
            return newSteps;
          });
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    runAnalysis();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white">Automated Data Pipeline</h2>
        <p className="text-slate-400">Transforming raw transactions into optimized model features using AI-driven preprocessing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Progress */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 h-fit">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Preprocessing Pipeline
          </h3>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                step.status === 'complete' ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-800/30 border-slate-700/50'
              }`}>
                <div className="flex items-center gap-3">
                  {step.status === 'complete' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  )}
                  <span className={`text-sm font-medium ${step.status === 'complete' ? 'text-green-100' : 'text-slate-400'}`}>
                    {step.name}
                  </span>
                </div>
                {step.status === 'complete' && <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Done</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            AI Dataset Analysis
          </h3>
          
          {analysis ? (
            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">Summary</p>
                <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-3">Identified Target</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 font-mono text-sm">
                  {analysis.targetVariable}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-3">Data Integrity Observations</p>
                <ul className="space-y-2">
                  {analysis.dataIssues.map((issue: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-400">
                      <span className="text-purple-500">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-slate-700 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">Generating AI Profiling Report...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!loading && (
        <button
          onClick={() => onComplete(analysis)}
          className="w-full py-4 bg-white hover:bg-slate-100 text-slate-950 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 mt-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          Initialize Model Training
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default StepPreprocess;
