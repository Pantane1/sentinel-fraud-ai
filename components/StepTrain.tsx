
import React, { useState } from 'react';
import { ModelConfig, ModelMetrics } from '../types';
import { geminiService } from '../services/geminiService';
import { Settings, Play, BrainCircuit, Activity, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StepTrainProps {
  analysis: any;
  onTrainingComplete: (metrics: ModelMetrics, config: ModelConfig) => void;
}

const StepTrain: React.FC<StepTrainProps> = ({ analysis, onTrainingComplete }) => {
  const [config, setConfig] = useState<ModelConfig>({
    algorithm: 'XGBoost',
    testSize: 0.2,
    learningRate: 0.01,
    epochs: 100
  });

  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trainData, setTrainData] = useState<{ epoch: number; loss: number; val_loss: number }[]>([]);

  const startTraining = async () => {
    setIsTraining(true);
    setProgress(0);
    setTrainData([]);

    // Simulate real-time training metrics
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        const newEpoch = Math.floor(prev / (100 / (config.epochs || 10)));
        setTrainData(current => [
          ...current,
          {
            epoch: newEpoch,
            loss: Math.max(0.1, 0.9 * Math.pow(0.95, newEpoch) + Math.random() * 0.05),
            val_loss: Math.max(0.12, 0.95 * Math.pow(0.96, newEpoch) + Math.random() * 0.07)
          }
        ]);
        
        return prev + 2;
      });
    }, 100);

    // Call Gemini to simulate the final model performance
    try {
      const metrics = await geminiService.simulateTraining(config, analysis);
      setTimeout(() => {
        onTrainingComplete(metrics, config);
      }, 5500); // Give enough time for the animation to look "real"
    } catch (err) {
      console.error(err);
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white">Hyperparameter Tuning</h2>
        <p className="text-slate-400">Configure the ensemble architecture and training parameters for optimal fraud detection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Settings className="w-5 h-5 text-blue-400" />
            Model Settings
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Algorithm</label>
              <select 
                value={config.algorithm}
                onChange={(e) => setConfig({...config, algorithm: e.target.value as any})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="XGBoost">XGBoost (Gradient Boosting)</option>
                <option value="RandomForest">Random Forest Ensemble</option>
                <option value="LogisticRegression">Logistic Regression</option>
                <option value="NeuralNetwork">Deep Neural Network</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Test Split</label>
                <span className="text-xs text-blue-400 font-mono">{(config.testSize * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="0.4" step="0.05"
                value={config.testSize}
                onChange={(e) => setConfig({...config, testSize: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Learning Rate</label>
              <input 
                type="number" step="0.001"
                value={config.learningRate}
                onChange={(e) => setConfig({...config, learningRate: parseFloat(e.target.value)})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-mono"
              />
            </div>
          </div>

          <button
            onClick={startTraining}
            disabled={isTraining}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
          >
            {isTraining ? <Activity className="w-5 h-5 animate-pulse" /> : <Play className="w-5 h-5 fill-current" />}
            {isTraining ? 'Training in Progress...' : 'Start Training Engine'}
          </button>
        </div>

        {/* Live Visualization Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-white font-semibold">
              <BrainCircuit className="w-5 h-5 text-purple-400" />
              Live Optimization Metrics
            </div>
            {isTraining && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500">Progress: {progress}%</span>
                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 w-full min-h-0">
            {isTraining || trainData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="epoch" stroke="#64748b" fontSize={10} label={{ value: 'Epoch', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={10} label={{ value: 'Loss', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="loss" stroke="#3b82f6" strokeWidth={2} dot={false} name="Training Loss" />
                  <Line type="monotone" dataKey="val_loss" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Validation Loss" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center">
                  <Zap className="w-10 h-10 opacity-20" />
                </div>
                <p className="text-sm font-medium">Waiting for training initialization...</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Training Loss</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Validation Loss</span>
            </div>
            <span className="text-slate-500 font-mono">Status: {isTraining ? 'ACTIVE' : 'IDLE'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepTrain;
