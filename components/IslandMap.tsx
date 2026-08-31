import React from 'react';
import {ArchipelagoGraph,TraversalEvent} from '../lib/types';

interface IslandMapProps{
  graph:ArchipelagoGraph;
  currentEvent:TraversalEvent | null;
}

export default function IslandMap({graph,currentEvent}:IslandMapProps){
  // Helpers to determine visual state based on the current event snapshot
  const isVisited = (nodeId:string) => 
    currentEvent?.discoveryState[nodeId] !== undefined;
  
  const isCurrentNode = (nodeId:string) => 
    currentEvent?.nodeId === nodeId;
  
  const isArticulation = (nodeId:string) => 
    currentEvent?.articulationPointsFound.includes(nodeId);
  
  const isBridge = (edgeId:string) => 
    currentEvent?.bridgesFound.includes(edgeId);
  
  const isCurrentEdge = (edgeId:string) => 
    currentEvent?.edgeId === edgeId;

  const isInspectedEdge = (u:string,v:string) =>{
    if(!currentEvent) return false;
    // An edge is inspected if both endpoints are visited and one is the parent of the other
    const parentU = currentEvent.parentState[u];
    const parentV = currentEvent.parentState[v];
    return parentU === v || parentV === u;
  };

  return(
    <div className="w-full aspect-video bg-slate-50 border-2 border-slate-200 rounded-xl overflow-hidden shadow-inner relative">
      <svg 
        viewBox="-10 -10 120 120" 
        className="w-full h-full drop-shadow-sm"
        preserveAspectRatio="xMidYMid meet"
      >
    {/* Draw Edges */}
    {graph.edges.map((edge) =>{
          const source = graph.nodes.find(n => n.id === edge.source)!;
          const target = graph.nodes.find(n => n.id === edge.target)!;
          
          let strokeColor = "#cbd5e1";
          let strokeWidth = "1.5";
          let strokeDasharray = "none";
          
          if(isBridge(edge.id)){
            strokeColor = "#ef4444";
            strokeWidth = "3";
          } else if(isCurrentEdge(edge.id)){
            strokeColor = "#f59e0b";
            strokeWidth = "3";
            strokeDasharray = "4 2";
          } 
          else if(isInspectedEdge(edge.source,edge.target)){
            strokeColor = "#3b82f6";
            strokeWidth = "2";
          }

          return(
            <line
              key={edge.id}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              className="transition-all duration-300 ease-in-out"
            />
          );
        })}

    {/* Draw Nodes */}
    {graph.nodes.map((node) =>{
          let fillColor = "#ffffff";
          let strokeColor = "#94a3b8";
          let strokeWidth = "2";

          if(isCurrentNode(node.id)){
            fillColor = "#fef3c7";
            strokeColor = "#f59e0b";
            strokeWidth = "3";
          } 
          else if(isArticulation(node.id)){
            fillColor = "#fee2e2";
            strokeColor = "#ef4444";
            strokeWidth = "3";
          } 
          else if(isVisited(node.id)){
            fillColor = "#dbeafe";
            strokeColor = "#3b82f6";
          }

          return(
            <g key={node.id} className="transition-all duration-300 ease-in-out">
              <circle
                cx={node.x}
                cy={node.y}
                r="6"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              <text
                x={node.x}
                y={node.y - 8}
                textAnchor="middle"
                className="text-[4px] font-semibold fill-slate-700 font-sans tracking-wide"
              >
            {node.name}
              </text>
            {/* Show Discovery/Low values if visited */}
            {isVisited(node.id) && (
                <text
                  x={node.x}
                  y={node.y + 10}
                  textAnchor="middle"
                  className="text-[3.5px] font-mono fill-slate-500"
                >
                {currentEvent?.discoveryState[node.id]}/{currentEvent?.lowState[node.id]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
    {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg border border-slate-200 text-xs font-mono shadow-sm">
        <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full border-2 border-red-500 bg-red-100 inline-block"></span> 
            Articulation Point
        </div>
        <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-1 bg-red-500 inline-block"></span> 
            Critical Bridge
        </div>
        <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-1 bg-blue-500 inline-block"></span> 
            Tree Edge
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-amber-500 bg-amber-100 inline-block"></span> 
            Current Node
        </div>
      </div>
    </div>
  );
}