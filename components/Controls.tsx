import React from 'react';

interface ControlsProps{
  onLoad: () => void;
  onStep: () => void;
  onRunToEnd: () => void;
  onReset: () => void;
  hasResult: boolean;
  isFinished: boolean;
}

export default function Controls({onLoad,onStep,onRunToEnd,onReset,hasResult,isFinished}:ControlsProps){
  return (
    <div className="flex gap-2">
      <button onClick={onLoad} className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 font-semibold text-sm transition-colors">
        Load My Archipelago
      </button>
      <button onClick={onStep} disabled={!hasResult || isFinished} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 font-semibold text-sm transition-colors">
        Step
      </button>
      <button onClick={onRunToEnd} disabled={!hasResult || isFinished} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 disabled:opacity-50 font-semibold text-sm transition-colors">
        Run to End
      </button>
      <button onClick={onReset} disabled={!hasResult} className="px-4 py-2 bg-slate-200 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-300 disabled:opacity-50 font-semibold text-sm transition-colors">
        Reset
      </button>
    </div>
  );
}