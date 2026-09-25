import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { uploadCricsheetMatch } from '../services/api.ts';

interface DataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const DataUploadModal: React.FC<DataUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        setJsonText(content);
        setStatusMessage(null);
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Failed to read JSON file' });
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!jsonText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste or upload a Cricsheet JSON file' });
      return;
    }

    setUploading(true);
    setStatusMessage(null);

    try {
      const parsed = JSON.parse(jsonText);
      const res = await uploadCricsheetMatch(parsed);
      setStatusMessage({ type: 'success', text: res.message || 'Match ingested successfully!' });
      setTimeout(() => {
        onUploadSuccess();
        onClose();
      }, 1400);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Invalid JSON format or schema error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl border border-slate-800 bg-slate-950 p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Import Cricsheet Match JSON</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <p className="text-slate-400 leading-relaxed">
            Ingest ball-by-ball Cricsheet IPL JSON files (v1.1.0) into the local analysis engine. The optimizer parses overs, deliveries, bowler disciplines, and updates all batsman profiles dynamically.
          </p>

          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-800 p-4 hover:border-slate-700 transition-colors">
            <label className="flex flex-col items-center gap-1.5 cursor-pointer text-center">
              <FileText className="h-6 w-6 text-slate-400" />
              <span className="text-xs font-medium text-slate-300">
                Click to browse a Cricsheet <code className="text-emerald-400">.json</code> file
              </span>
              <span className="text-[11px] text-slate-500">Supports single match or array of matches</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-400">Or paste raw match JSON:</span>
              <a
                href="https://cricsheet.org/downloads/#ipl"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
              >
                <span>Download free IPL files from Cricsheet</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <textarea
              rows={6}
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              placeholder='{ "meta": { "data_version": "1.1.0" }, "info": { ... }, "innings": [ ... ] }'
              className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 font-mono text-[11px] text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {statusMessage && (
            <div
              className={`flex items-center gap-2 rounded-lg p-2.5 text-xs ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {uploading ? 'Processing...' : 'Ingest Match'}
          </button>
        </div>
      </div>
    </div>
  );
};
