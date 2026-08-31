"use client";

import React, { useState } from "react";
import { MAIN_ARCHIPELAGO } from "../lib/data";
import { validateGraph, buildAdjacencyList } from "../lib/graph";
import { runTarjan } from "../lib/tarjan";
import { useReplay } from "../lib/useReplay";
import { TraversalResult } from "../lib/types";

import IslandMap from "../components/IslandMap";
import Controls from "../components/Controls";
import EventExplainer from "../components/EventExplainer";
import SafetySummary from "../components/SafetySummary";
import NodeTable from "../components/NodeTable";

export default function Home() {
  const [result, setResult] = useState<TraversalResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const replay = useReplay(result);

  const handleLoad = () => {
    try {
      setError(null);
      validateGraph(MAIN_ARCHIPELAGO);
      const adj = buildAdjacencyList(MAIN_ARCHIPELAGO);
      const output = runTarjan(MAIN_ARCHIPELAGO, adj);
      setResult(output);
      replay.reset();
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-300 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Treasure Island Safety Map</h1>
            <p className="text-slate-500 mt-1">Interactive bridge and articulation point analysis</p>
          </div>
          <Controls 
            onLoad={handleLoad} 
            onStep={replay.step} 
            onRunToEnd={replay.runToEnd} 
            onReset={replay.reset}
            hasResult={!!result}
            isFinished={replay.isFinished}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 font-mono text-sm rounded-r-md">
            Validation Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <IslandMap graph={MAIN_ARCHIPELAGO} currentEvent={replay.currentEvent} />
            <EventExplainer currentEvent={replay.currentEvent} hasResult={!!result} />
          </div>

          <div className="space-y-6">
            <SafetySummary result={result} currentEvent={replay.currentEvent} />
            <NodeTable graph={MAIN_ARCHIPELAGO} currentEvent={replay.currentEvent} />
          </div>
        </div>
      </div>
    </div>
  );
}