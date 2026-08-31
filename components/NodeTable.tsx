import React from 'react';
import {ArchipelagoGraph,TraversalEvent} from '../lib/types';

interface NodeTableProps{
  graph: ArchipelagoGraph;
  currentEvent: TraversalEvent | null;
}

export default function NodeTable({graph,currentEvent}:NodeTableProps){
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-slate-50">
        <h3 className="text-sm font-bold text-slate-800">Node Traversal Table</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-mono">
          <thead className="bg-slate-50 text-slate-500 border-b">
            <tr>
              <th className="py-2 px-4 font-semibold">ID</th>
              <th className="py-2 px-4 font-semibold">Parent</th>
              <th className="py-2 px-4 font-semibold">Disc</th>
              <th className="py-2 px-4 font-semibold">Low</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {graph.nodes.map((node) => {
              const p = currentEvent?.parentState[node.id];
              const d = currentEvent?.discoveryState[node.id];
              const l = currentEvent?.lowState[node.id];
              const isCurrent = currentEvent?.nodeId === node.id;
              
              return (
                <tr key={node.id} className={isCurrent ? "bg-amber-50" : ""}>
                  <td className="py-2 px-4 font-medium text-slate-700">{node.id}</td>
                  <td className="py-2 px-4 text-slate-500">{p === null ? "null" : p ?? "-"}</td>
                  <td className="py-2 px-4 text-blue-600">{d ?? "-"}</td>
                  <td className="py-2 px-4 text-emerald-600">{l ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}