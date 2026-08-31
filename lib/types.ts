export interface GraphNode {
  id: string;
  name: string;
  x: number; // 0 to 100
  y: number; // 0 to 100
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface ArchipelagoGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type EventType =
  | "START_COMPONENT"
  | "VISIT_NODE"
  | "INSPECT_EDGE_TREE"
  | "INSPECT_EDGE_BACK"
  | "INSPECT_EDGE_PARENT"
  | "RETURN_FROM_CHILD"
  | "CLASSIFY_BRIDGE"
  | "CLASSIFY_ARTICULATION"
  | "COMPLETE_NODE"
  | "FINISH";

export interface TraversalEvent {
  step: number;
  type: EventType;
  nodeId?: string;
  neighborId?: string;
  edgeId?: string;
  clock: number;
  oldLow?: number;
  newLow?: number;
  explanation: string;
  // Snapshot of state at this event
  discoveryState: Record<string, number | null>;
  lowState: Record<string, number | null>;
  parentState: Record<string, string | null>;
  visitedOrder: string[];
  bridgesFound: string[];
  articulationPointsFound: string[];
}

export interface TraversalResult {
  events: TraversalEvent[];
  discovery: Record<string, number>;
  low: Record<string, number>;
  parent: Record<string, string | null>;
  discoveryOrder: string[];
  bridgeIds: string[];
  articulationIds: string[];
  componentCount: number;
}