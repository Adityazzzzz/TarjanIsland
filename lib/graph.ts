import { ArchipelagoGraph,GraphNode,GraphEdge } from "./types";

const ID_REGEX = /^[A-Z][A-Z0-9_-]{0,15}$/;

export function validateGraph(graph:ArchipelagoGraph):void{
    const {nodes,edges} = graph;

    // 1. Check constraints on counts
    if(nodes.length < 1 || nodes.length > 12){
        throw new Error(`Invalid node count: ${nodes.length}. Must be between 1 and 12.`);
    }
    if(edges.length < 0 || edges.length > 20){
        throw new Error(`Invalid edge count: ${edges.length}. Must be between 0 and 20.`);
    }

    const nodeIds = new Set<string>();
  
    // 2. Validate Nodes
    for(const node of nodes){
        if(!ID_REGEX.test(node.id)){
            throw new Error(`Invalid node ID format: ${node.id}`);
        }
        if(nodeIds.has(node.id)){
            throw new Error(`Duplicate node ID: ${node.id}`);
        }
        if(!node.name || node.name.trim() === ""){
            throw new Error(`Node ${node.id} has an empty name.`);
        }
        if(node.x < 0 || node.x > 100 || node.y < 0 || node.y > 100){
            throw new Error(`Node ${node.id} coordinates out of range(0-100).`);
        }
        nodeIds.add(node.id);
    }

    const edgeIds = new Set<string>();
    const endpointPairs = new Set<string>();

    // 3. Validate Edges
    for(const edge of edges){
        if(!ID_REGEX.test(edge.id)){
            throw new Error(`Invalid edge ID format: ${edge.id}`);
        }
        if(edgeIds.has(edge.id)){
            throw new Error(`Duplicate edge ID: ${edge.id}`);
        }
        if(!nodeIds.has(edge.source) || !nodeIds.has(edge.target)){
            throw new Error(`Edge ${edge.id} references unknown endpoints.`);
        }
        if(edge.source === edge.target){
            throw new Error(`Edge ${edge.id} is a self-loop,which is invalid.`);
        }

        // Check for parallel edges(unordered pair)
        const [u,v] = edge.source < edge.target 
            ? [edge.source,edge.target] 
            : [edge.target,edge.source];
        
        const pairKey = `${u}::${v}`;
        if(endpointPairs.has(pairKey)){
            throw new Error(`Parallel edges detected between ${u} and ${v}.`);
        }
        
        edgeIds.add(edge.id);
        endpointPairs.add(pairKey);
    }
}

export function buildAdjacencyList(graph: ArchipelagoGraph): Map<string,string[]>{
    const adj = new Map<string,string[]>();

    // Initialize empty arrays for all nodes
    for(const node of graph.nodes){
        adj.set(node.id,[]);
    }
    // Populate undirected edges
    for(const edge of graph.edges){
        adj.get(edge.source)!.push(edge.target);
        adj.get(edge.target)!.push(edge.source);
    }
    // Sort neighbors in ascending node-ID order to ensure deterministic traversal
    for(const [nodeId,neighbors] of adj.entries()){
        neighbors.sort((a,b) =>(a < b ? -1 : a > b ? 1 : 0));
    }

    return adj;
}