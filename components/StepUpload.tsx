
import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface StepUploadProps {
  onDataLoaded: (data: any[], rawSample: string) => void;
}

const StepUpload: React.FC<StepUploadProps> = ({ onDataLoaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a valid CSV file");
    }
  };

  const processFile = async () => {
    if (!file) return;
    setLoading(true);
    
    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0].map(h => h.trim());
      const data = rows.slice(1)
        .filter(row => row.length === headers.length)
        .map(row => {
          const obj: any = {};
          headers.forEach((header, i) => {
            obj[header] = isNaN(Number(row[i])) ? row[i] : Number(row[i]);
          });
          return obj;
        });

      // Pass first 50 rows as sample for Gemini analysis
      const sampleText = text.split('\n').slice(0, 50).join('\n');
      
      // Simulate network delay
      setTimeout(() => {
        onDataLoaded(data, sampleText);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError("Failed to parse file");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white">Ingest Transaction Data</h2>
        <p className="text-slate-400">Upload your credit card transaction dataset to begin the analysis and training pipeline.</p>
      </div>

      <div className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-300 ${
        file ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
      }`}>
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {file ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="text-xl font-semibold text-white mb-1">{file.name}</p>
            <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for processing</p>
            <button 
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="mt-4 p-2 text-slate-500 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-200 mb-1">Click or drag CSV file to upload</p>
            <p className="text-slate-500 text-sm">Supports large datasets for robust model training</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {file && (
        <button
          onClick={processFile}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Parsing & Profiling...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-6 h-6" />
              Continue to Data Profiling
            </>
          )}
        </button>
      )}

      <div className="grid grid-cols-3 gap-4 pt-4">
        {[
          { label: 'Standard Schema', desc: 'Auto-detect features' },
          { label: 'Time-Series Ready', desc: 'Detect temporal shifts' },
          { label: 'Privacy Compliant', desc: 'Local processing only' }
        ].map((feat, idx) => (
          <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">{feat.label}</p>
            <p className="text-xs text-slate-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepUpload;
