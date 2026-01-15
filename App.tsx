
import React, { useState } from 'react';
import Layout from './components/Layout';
import { AppStep, ModelMetrics, ModelConfig } from './types';
import StepUpload from './components/StepUpload';
import StepPreprocess from './components/StepPreprocess';
import StepTrain from './components/StepTrain';
import StepEvaluate from './components/StepEvaluate';
import StepDeploy from './components/StepDeploy';
import { 
  Activity, 
  ShieldCheck, 
  Users, 
  Database,
  ArrowRight,
  Code2,
  Cpu,
  Lock,
  Zap as ZapIcon
} from 'lucide-react';

const Badge: React.FC<{ icon: any; label: string; color: string; sub: string }> = ({ icon: Icon, label, color, sub }) => (
  <div className={`flex items-center gap-3 px-4 py-2 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all cursor-default group`}>
    <div className={`p-2 rounded-lg bg-slate-950 ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{sub}</span>
      <span className="text-xs font-semibold text-slate-200 leading-none">{label}</span>
    </div>
  </div>
);

const Dashboard: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="space-y-12 py-6">
    <div className="max-w-4xl">
      <div className="flex flex-wrap gap-3 mb-8">
        <Badge icon={Cpu} label="Gemini 3 Pro" sub="Engine" color="text-purple-400" />
        <Badge icon={Code2} label="React 19" sub="Stack" color="text-blue-400" />
        <Badge icon={ZapIcon} label="99.4% Recall" sub="Performance" color="text-yellow-400" />
        <Badge icon={Lock} label="Enterprise" sub="Security" color="text-green-400" />
      </div>

      <h1 className="text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
        Autonomous <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Fraud Detection</span>
      </h1>
      <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl">
        Sentinel AI streamlines the entire machine learning lifecycle for financial security. Ingest, train, and deploy enterprise-grade models in minutes.
      </p>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onStart}
          className="group relative px-10 py-5 bg-white text-slate-950 font-bold rounded-2xl flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.15)] active:scale-95"
        >
          Initialize Pipeline
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="px-6 py-5 border border-slate-800 rounded-2xl bg-slate-900/20 text-slate-500 text-sm font-medium">
          v3.4.1-stable
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: 'Platform Status', value: 'Nominal', icon: Activity, color: 'text-green-500' },
        { label: 'Global Fraud Prevented', value: '$2.4M', icon: ShieldCheck, color: 'text-blue-500' },
        { label: 'Active Deployments', value: '1,284', icon: Database, color: 'text-purple-500' },
        { label: 'Analyst Network', value: '84 countries', icon: Users, color: 'text-orange-500' }
      ].map((stat, i) => (
        <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:bg-slate-900/80 transition-all group">
          <div className={`${stat.color} mb-4 group-hover:scale-110 transition-transform`}><stat.icon className="w-6 h-6" /></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
          <p className="text-xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-8 rounded-[40px] relative overflow-hidden group">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-4">Enterprise-Grade Security</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Our models utilize SMOTE over-sampling and XGBoost ensembles to handle highly imbalanced datasets, typically found in real-world credit card transactions.
          </p>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">XGBOOST V3</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">AES-256</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <ShieldCheck className="w-48 h-48 text-white rotate-12" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px]">
        <h3 className="text-2xl font-bold text-white mb-4">Live Performance</h3>
        <div className="space-y-4">
          {[
            { label: 'Inference Latency', value: '14ms', progress: 95 },
            { label: 'Detection Recall', value: '99.4%', progress: 99 },
            { label: 'System Uptime', value: '99.99%', progress: 100 }
          ].map((bar, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                <span>{bar.label}</span>
                <span className="text-white font-mono">{bar.value}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${bar.progress}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.DASHBOARD);
  const [dataset, setDataset] = useState<any[]>([]);
  const [sampleText, setSampleText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [trainedMetrics, setTrainedMetrics] = useState<ModelMetrics | null>(null);
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);

  const canNavigate = (step: AppStep): boolean => {
    switch (step) {
      case AppStep.DASHBOARD: return true;
      case AppStep.UPLOAD: return true;
      case AppStep.PREPROCESS: return dataset.length > 0;
      case AppStep.TRAIN: return analysis !== null;
      case AppStep.EVALUATE: return trainedMetrics !== null;
      case AppStep.DEPLOY: return trainedMetrics !== null;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.DASHBOARD:
        return <Dashboard onStart={() => setCurrentStep(AppStep.UPLOAD)} />;
      case AppStep.UPLOAD:
        return <StepUpload onDataLoaded={(data, sample) => {
          setDataset(data);
          setSampleText(sample);
          setCurrentStep(AppStep.PREPROCESS);
        }} />;
      case AppStep.PREPROCESS:
        return <StepPreprocess data={dataset} sample={sampleText} onComplete={(res) => {
          setAnalysis(res);
          setCurrentStep(AppStep.TRAIN);
        }} />;
      case AppStep.TRAIN:
        return <StepTrain analysis={analysis} onTrainingComplete={(metrics, config) => {
          setTrainedMetrics(metrics);
          setModelConfig(config);
          setCurrentStep(AppStep.EVALUATE);
        }} />;
      case AppStep.EVALUATE:
        return <StepEvaluate metrics={trainedMetrics!} onDeploy={() => setCurrentStep(AppStep.DEPLOY)} />;
      case AppStep.DEPLOY:
        return <StepDeploy metrics={trainedMetrics!} />;
      default:
        return <Dashboard onStart={() => setCurrentStep(AppStep.UPLOAD)} />;
    }
  };

  return (
    <Layout 
      activeStep={currentStep} 
      onStepChange={setCurrentStep} 
      canNavigate={canNavigate}
    >
      {renderStep()}
    </Layout>
  );
};

export default App;
