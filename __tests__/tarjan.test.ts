import {validateGraph,buildAdjacencyList} from "../lib/graph";
import {runTarjan} from "../lib/tarjan";
import {MAIN_ARCHIPELAGO} from "../lib/data";
import {ArchipelagoGraph} from "../lib/types";

describe("Treasure Island Safety Map Contracts",()=>{
  
  test("Required: Shuffle main graph arrays and obtain identical results",()=>{
    // 1. Run the baseline
    const baseAdj = buildAdjacencyList(MAIN_ARCHIPELAGO);
    const baseResult = runTarjan(MAIN_ARCHIPELAGO,baseAdj);

    // 2. Shuffle (Reverse) the nodes and edges
    const shuffledGraph: ArchipelagoGraph = {
      nodes: [...MAIN_ARCHIPELAGO.nodes].reverse(),
      edges: [...MAIN_ARCHIPELAGO.edges].reverse(),
    };

    const shuffledAdj = buildAdjacencyList(shuffledGraph);
    const shuffledResult = runTarjan(shuffledGraph,shuffledAdj);

    // 3. Prove determinism (Input array order must not change the traversal or result)
    expect(shuffledResult.bridgeIds).toEqual(baseResult.bridgeIds);
    expect(shuffledResult.articulationIds).toEqual(baseResult.articulationIds);
    expect(shuffledResult.discoveryOrder).toEqual(baseResult.discoveryOrder);
  });

  test("Required: Small cycle-only test with no critical bridge or articulation point",()=>{
    const cycleGraph: ArchipelagoGraph = {
      nodes: [
        { id: "A",name: "A",x: 10,y: 10 },
        { id: "B",name: "B",x: 20,y: 20 },
        { id: "C",name: "C",x: 30,y: 30 },
      ],
      edges: [
        { id: "E1",source: "A",target: "B" },
        { id: "E2",source: "B",target: "C" },
        { id: "E3",source: "C",target: "A" },
      ],
    };

    const adj = buildAdjacencyList(cycleGraph);
    const result = runTarjan(cycleGraph,adj);

    expect(result.bridgeIds.length).toBe(0);
    expect(result.articulationIds.length).toBe(0);
  });

  test("Required: DFS root with at least two tree children,disconnected component,and isolated node",()=>{
    const disconnectedGraph: ArchipelagoGraph = {
      nodes: [
        // Component 1: Root A with two independent children B and C
        { id: "A",name: "Root",x: 10,y: 10 },
        { id: "B",name: "Child 1",x: 20,y: 10 },
        { id: "C",name: "Child 2",x: 10,y: 20 },
        // Component 2: Disconnected pair
        { id: "D",name: "Pair 1",x: 50,y: 50 },
        { id: "E",name: "Pair 2",x: 60,y: 50 },
        // Component 3: Isolated node
        { id: "F",name: "Isolated",x: 90,y: 90 },
      ],
      edges: [
        { id: "E1",source: "A",target: "B" },
        { id: "E2",source: "A",target: "C" },
        { id: "E3",source: "D",target: "E" },
      ],
    };

    const adj = buildAdjacencyList(disconnectedGraph);
    const result = runTarjan(disconnectedGraph,adj);

    // Root 'A' has two children,so it MUST be an articulation point.
    expect(result.articulationIds).toContain("A");
    
    // There are 3 distinct components
    expect(result.componentCount).toBe(3);
    
    // Every edge in this specific graph is a bridge
    expect(result.bridgeIds.length).toBe(3);
  });

  test("Required: Materially different invalid cases (Coordinate out of range,Duplicate ID)",()=>{
    // Invalid Case 1: Coordinate out of range
    const outOfRangeGraph: ArchipelagoGraph = {
      nodes: [{ id: "A",name: "A",x: 150,y: 50 }],// x is 150 (limit is 100)
      edges: [],
    };
    expect(() => validateGraph(outOfRangeGraph)).toThrow(/out of range/);

    // Invalid Case 2: Duplicate Node ID
    const duplicateIdGraph: ArchipelagoGraph = {
      nodes: [
        { id: "A",name: "A1",x: 10,y: 10 },
        { id: "A",name: "A2",x: 20,y: 20 },
      ],
      edges: [],
    };
    expect(() => validateGraph(duplicateIdGraph)).toThrow(/Duplicate node ID/);

    // Invalid Case 3: Self-loop edge
    const selfLoopGraph: ArchipelagoGraph = {
      nodes: [{ id: "A",name: "A",x: 10,y: 10 }],
      edges: [{ id: "E1",source: "A",target: "A" }],
    };
    expect(() => validateGraph(selfLoopGraph)).toThrow(/self-loop/);
  });

});