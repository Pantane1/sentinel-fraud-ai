
import React, { useState, useEffect, useMemo } from 'react';
import { ModelMetrics, ModelDeployment } from '../types';
import { geminiService } from '../services/geminiService';
import { 
  Zap, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  RefreshCcw,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Activity,
  Code
} from 'lucide-react';

interface StepDeployProps {
  metrics: ModelMetrics;
}

const StepDeploy: React.FC<StepDeployProps> = ({ metrics }) => {
  const [deployment, setDeployment] = useState<ModelDeployment>({
    endpoint: 'https://api.sentinel-fraud.ai/v1/predict',
    status: 'deploying',
    createdAt: new Date().toISOString(),
    version: 'SENTINEL-1.0-STABLE'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeployment(prev => ({ ...prev, status: 'active' }));
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const [copied, setCopied] = useState(false);
  const [testPayload, setTestPayload] = useState('{"V1": -1.35, "V2": 0.5, "Amount": 499.0}');
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validation = useMemo(() => {
    try {
      if (!testPayload.trim()) return { isValid: false, message: "Payload cannot be empty" };
      JSON.parse(testPayload);
      return { isValid: true, message: null };
    } catch (e: any) {
      return { isValid: false, message: e.message || "Malformed JSON structure" };
    }
  }, [testPayload]);

  const copyEndpoint = () => {
    navigator.clipboard.writeText(deployment.endpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = async () => {
    if (deployment.status !== 'active') {
      setError("Model is not active. Please wait for deployment to complete.");
      return;
    }
    if (!validation.isValid) return;

    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const payload = JSON.parse(testPayload);
      const result = await geminiService.predictFraud(payload, metrics);
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during inference.");
    } finally {
      setLoading(false);
    }
  };

  const curlExample = `curl -X POST ${deployment.endpoint} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${testPayload}'`;

  const renderStatusBadge = () => {
    const statusConfig = {
      active: { label: 'Active', color: 'bg-green-500', text: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', animation: 'animate-pulse' },
      deploying: { label: 'Deploying', color: 'bg-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', animation: 'animate-bounce' },
      inactive: { label: 'Inactive', color: 'bg-red-500', text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', animation: '' }
    };

    const config = statusConfig[deployment.status] || statusConfig.inactive;

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 ${config.bg} ${config.border} border rounded-full transition-all duration-500`}>
        <div className={`w-2 h-2 rounded-full ${config.color} ${config.animation}`} />
        <span className={`text-[11px] font-bold ${config.text} uppercase tracking-wider`}>
          {config.label}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white">Production API Engine</h2>
            {renderStatusBadge()}
          </div>
          <p className="text-slate-400">Your fraud detection model has been containerized and deployed to the high-availability edge network.</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Health Score</span>
            <span className="text-lg font-bold text-white">99.9%</span>
          </div>
          <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">Deployment Info</h3>
              <ShieldCheck className="w-5 h-5 text-slate-700" />
            </div>
            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Service Endpoint</p>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-xs text-slate-300 truncate flex-1 font-mono">{deployment.endpoint}</span>
                  <button onClick={copyEndpoint} className="text-slate-500 hover:text-white transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Version</p>
                  <p className="text-xs text-slate-200 font-mono">{deployment.version}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Runtime</p>
                  <p className="text-xs text-slate-200 font-mono">PyTorch 2.1</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-blue-400" />
              Real-time Logs
            </h3>
            <div className="space-y-3 font-mono text-[10px]">
              <div className="text-slate-500">INIT | Kernel starting...</div>
              <div className="text-slate-500">LOAD | Loading SMOTE-tuned weights</div>
              <div className={`transition-colors duration-1000 ${deployment.status === 'active' ? 'text-green-500/70' : 'text-yellow-500/70'}`}>
                {deployment.status === 'active' ? 'READY | HTTP/2 Server active at port 443' : 'WAIT | Waiting for readiness probe...'}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                API Playground
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTestPayload('{"V1": -1.35, "V2": 0.5, "Amount": 49.0}')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] text-slate-400 font-bold uppercase transition-all"
                >
                  Load Sample
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Input Body (JSON)</p>
                  {!validation.isValid && (
                    <div className="flex items-center gap-1.5 text-red-500 text-[9px] font-bold uppercase animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      Invalid Syntax
                    </div>
                  )}
                </div>
                <div className="relative">
                  <textarea 
                    value={testPayload}
                    onChange={(e) => setTestPayload(e.target.value)}
                    className={`w-full h-48 bg-slate-950 border rounded-2xl p-4 font-mono text-sm transition-all focus:outline-none focus:ring-2 ${
                      validation.isValid 
                        ? 'border-slate-800 text-blue-300 focus:ring-blue-500/20' 
                        : 'border-red-500/50 text-red-300 focus:ring-red-500/10'
                    }`}
                  />
                  {!validation.isValid && (
                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-mono leading-tight">
                      {validation.message}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTest}
                    disabled={loading || deployment.status !== 'active' || !validation.isValid}
                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                      deployment.status === 'active' && validation.isValid
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10 active:scale-95' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {deployment.status === 'active' ? (validation.isValid ? 'Invoke Endpoint' : 'Fix JSON to Invoke') : 'System Not Active'}
                  </button>
                  {loading && (
                    <div className="flex flex-col items-center gap-1 px-2 animate-in fade-in slide-in-from-left-2">
                      <RefreshCcw className="w-5 h-5 text-blue-400 animate-spin" />
                      <span className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter">Refreshing</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Model Response</p>
                <div className="h-[258px] bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-y-auto custom-scrollbar">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">Inference Error</p>
                        <p className="text-xs text-red-200/80 leading-relaxed">{error}</p>
                      </div>
                    </div>
                  )}
                  {prediction ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className={`p-4 rounded-xl flex items-center justify-between border ${
                        prediction.prediction === 'Fraud' ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'
                      }`}>
                        <div className="flex items-center gap-3">
                          {prediction.prediction === 'Fraud' ? <ShieldAlert className="text-red-500" /> : <ShieldCheck className="text-green-500" />}
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Classification</p>
                            <p className={`text-lg font-bold ${prediction.prediction === 'Fraud' ? 'text-red-400' : 'text-green-400'}`}>
                              {prediction.prediction}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Probability</p>
                          <p className="text-lg font-mono text-white">{(prediction.probability * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Decision Reasoning</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{prediction.reasoning}</p>
                      </div>
                    </div>
                  ) : !error && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700">
                      <Terminal className="w-12 h-12 opacity-20 mb-2" />
                      <p className="text-xs font-medium">Awaiting Inference Request...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              Implementation Snippet
            </h3>
            <pre className="bg-slate-900/50 p-4 rounded-xl overflow-x-auto text-[11px] font-mono text-slate-400 border border-slate-800 custom-scrollbar">
              <code>{curlExample}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDeploy;