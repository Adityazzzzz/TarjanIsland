import React from 'react';
import { TraversalEvent } from '../lib/types';

interface EventExplainerProps{
  currentEvent: TraversalEvent | null;
  hasResult: boolean;
}

export default function EventExplainer({currentEvent,hasResult}:EventExplainerProps){
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-32 flex flex-col justify-center">
      <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Current Action</h3>
      <p className="text-lg font-medium text-slate-700">
        {currentEvent 
          ? currentEvent.explanation 
          : hasResult 
            ? "Archipelago loaded. Press 'Step' to begin analysis." 
            : "No archipelago loaded."
        }
      </p>
    </div>
  );
}