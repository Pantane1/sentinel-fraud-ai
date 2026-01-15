
import React from 'react';
import { ModelMetrics } from '../types';
import { Award, Target, Zap, ShieldAlert, TrendingUp, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface StepEvaluateProps {
  metrics: ModelMetrics;
  onDeploy: () => void;
}

const StepEvaluate: React.FC<StepEvaluateProps> = ({ metrics, onDeploy }) => {
  const confusionData = [
    { name: 'True Positives', value: metrics.confusionMatrix.tp, color: '#22c55e' },
    { name: 'False Positives', value: metrics.confusionMatrix.fp, color: '#ef4444' },
    { name: 'True Negatives', value: metrics.confusionMatrix.tn, color: '#3b82f6' },
    { name: 'False Negatives', value: metrics.confusionMatrix.fn, color: '#f59e0b' },
  ];

  const mainMetrics = [
    { label: 'Precision', value: (metrics.precision * 100).toFixed(1) + '%', icon: Target, color: 'text-blue-400' },
    { label: 'Recall', value: (metrics.recall * 100).toFixed(1) + '%', icon: Zap, color: 'text-yellow-400' },
    { label: 'F1 Score', value: (metrics.f1Score * 100).toFixed(1) + '%', icon: Award, color: 'text-green-400' },
    { label: 'AUC-ROC', value: (metrics.auc).toFixed(3), icon: TrendingUp, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white">Performance Analytics</h2>
        <p className="text-slate-400">Comprehensive evaluation of the trained model using industry-standard fraud detection metrics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className={`w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center mb-4 ${m.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
              <p className="text-2xl font-bold text-white">{m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix Visualization */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-white mb-8 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            Confusion Matrix Analysis
          </h3>
          
          <div className="flex h-[300px]">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={confusionData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {confusionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col justify-center space-y-4">
              {confusionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{item.name}</p>
                    <p className="text-sm font-bold text-white">{item.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evaluation Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">AI Model Report</h3>
            <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
              <p>
                The model achieved an outstanding <span className="text-white font-bold">{mainMetrics[3].value} AUC</span>, 
                demonstrating high discriminative power between legitimate transactions and fraudulent activity.
              </p>
              <p>
                The Recall of <span className="text-white font-bold">{mainMetrics[1].value}</span> indicates that 
                out of all actual fraud cases, the model correctly identified nearly {mainMetrics[1].value}.
              </p>
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl text-yellow-200/80">
                <strong>Deployment Recommendation:</strong> This model is ready for shadow-mode deployment to monitor real-time traffic and further validate the False Positive Rate in production settings.
              </div>
            </div>
          </div>

          <button
            onClick={onDeploy}
            className="w-full mt-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-green-600/20 transition-all"
          >
            Promote to Production
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepEvaluate;
