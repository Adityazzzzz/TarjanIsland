import {ArchipelagoGraph,TraversalResult,TraversalEvent,EventType} from "./types";

export function runTarjan(
  graph:ArchipelagoGraph,
  adjList:Map<string,string[]>

):TraversalResult{
  const discovery:Record<string,number> = {};
  const low:Record<string,number> = {};
  const parent:Record<string,string | null> = {};
  
  const discoveryOrder:string[] = [];
  const bridgeIds:Set<string> = new Set();
  const articulationIds:Set<string> = new Set();
  const events:TraversalEvent[] = [];
  
  let clock = 0;
  let componentCount = 0;

  // Helper to find edge ID between two nodes
  const getEdgeId = (u:string,v:string) => {
    return graph.edges.find(
      (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
    )?.id;
  };

  // Helper to snapshot current state for the replay engine
  const recordEvent = (
    type:EventType,
    explanation:string,
    overrides:Partial<TraversalEvent> ={}
  ) => {
    events.push({
      step:events.length + 1,
      type,
      explanation,
      clock,
      discoveryState:{...discovery},
      lowState:{...low},
      parentState:{...parent},
      visitedOrder:[...discoveryOrder],
      bridgesFound:Array.from(bridgeIds).sort(),
      articulationPointsFound:Array.from(articulationIds).sort(),
      ...overrides,
    });
  };

  const dfs = (u:string,rootId:string) => {
    discovery[u] = low[u] = clock;
    clock++;
    discoveryOrder.push(u);
    
    let childrenCount = 0;
    let isArticulation = false;

    recordEvent("VISIT_NODE",`Discovered island ${u}. Set discovery and low to ${discovery[u]}.`,{ nodeId:u });

    const neighbors = adjList.get(u) || [];
    for(const v of neighbors){
      const edgeId = getEdgeId(u,v);

      if(discovery[v] === undefined){
        // Tree Edge
        childrenCount++;
        parent[v] = u;
        recordEvent("INSPECT_EDGE_TREE",`Inspecting unvisited neighbor ${v} via bridge ${edgeId}.`,{ nodeId:u,neighborId:v,edgeId });
        
        dfs(v,rootId);

        const oldLow = low[u];
        low[u] = Math.min(low[u],low[v]);
        recordEvent("RETURN_FROM_CHILD",`Returned to ${u} from ${v}. Updated low[${u}] = min(${oldLow},${low[v]}) = ${low[u]}.`,{ nodeId:u,neighborId:v,oldLow,newLow:low[u] });

        // Bridge classification
        if(low[v] > discovery[u]){
          bridgeIds.add(edgeId!);
          
          recordEvent("CLASSIFY_BRIDGE",`Bridge identified:${edgeId}. low[${v}] (${low[v]}) > discovery[${u}] (${discovery[u]}).`,{ nodeId:u,neighborId:v,edgeId });
        }

        // Articulation classification (Non-root)
        if(u !== rootId && low[v] >= discovery[u]){
          isArticulation = true;
          articulationIds.add(u);

          recordEvent("CLASSIFY_ARTICULATION",`Island ${u} is an articulation point. DFS child ${v} cannot reach above ${u}.`,{ nodeId:u });
        }

      } 
      else if(v !== parent[u]){
        // Back Edge
        recordEvent("INSPECT_EDGE_BACK",`Inspecting visited neighbor ${v} (not parent).`,{ nodeId:u,neighborId:v,edgeId });

        const oldLow = low[u];
        low[u] = Math.min(low[u],discovery[v]);

        recordEvent("RETURN_FROM_CHILD",`Updated low[${u}] = min(${oldLow},discovery[${v}]) = ${low[u]}.`,{ nodeId:u,neighborId:v,oldLow,newLow:low[u],edgeId });
      } 
      else{
        // Parent Edge
        recordEvent("INSPECT_EDGE_PARENT",`Ignoring bridge ${edgeId} back to parent ${v}.`,{ nodeId:u,neighborId:v,edgeId });
      }
    }

    // Articulation classification (Root)
    if(u === rootId && childrenCount > 1){
      isArticulation = true;
      articulationIds.add(u);
      recordEvent("CLASSIFY_ARTICULATION",`Root island ${u} is an articulation point (has ${childrenCount} disconnected children).`,{ nodeId:u });
    }

    recordEvent("COMPLETE_NODE",`Finished inspecting all bridges from ${u}.`,{ nodeId:u });
  };

  // Sort nodes by ID to ensure deterministic root selection
  const sortedNodeIds = [...graph.nodes].map(n => n.id).sort();

  for(const nodeId of sortedNodeIds){
    if(discovery[nodeId] === undefined){
      componentCount++;
      parent[nodeId] = null;
      recordEvent("START_COMPONENT",`Starting new component analysis at root ${nodeId}.`,{ nodeId });
      dfs(nodeId,nodeId);
    }
  }

  recordEvent("FINISH",`Traversal complete. Found ${bridgeIds.size} critical bridges and ${articulationIds.size} articulation islands.`);

  return {
    events,
    discovery,
    low,
    parent,
    discoveryOrder,
    bridgeIds:Array.from(bridgeIds).sort(),
    articulationIds:Array.from(articulationIds).sort(),
    componentCount
  };
}