import React from 'react';
import { TraversalResult, TraversalEvent } from '../lib/types';

interface SafetySummaryProps {
  result: TraversalResult | null;
  currentEvent: TraversalEvent | null;
}

export default function SafetySummary({ result, currentEvent }: SafetySummaryProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Safety Summary</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="block text-slate-500 mb-1">Component Count</span>
          <span className="font-mono font-bold text-lg">{result ? result.componentCount : "-"}</span>
        </div>
        <div>
          <span className="block text-slate-500 mb-1">Event Clock</span>
          <span className="font-mono font-bold text-lg">{currentEvent ? currentEvent.clock : "-"}</span>
        </div>
      </div>
      
      <div>
        <span className="block text-slate-500 text-sm mb-1">Critical Bridges</span>
        <div className="font-mono text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 min-h-10">
          {currentEvent?.bridgesFound.join(", ") || "None"}
        </div>
      </div>
      <div>
        <span className="block text-slate-500 text-sm mb-1">Articulation Points</span>
        <div className="font-mono text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 min-h-10">
          {currentEvent?.articulationPointsFound.join(", ") || "None"}
        </div>
      </div>
    </div>
  );
}