import { ArchipelagoGraph } from "./types";

export const MAIN_ARCHIPELAGO: ArchipelagoGraph = {
  nodes: [
    { id: "ENTRY", name: "Welcome Dock", x: 15, y: 50 },
    { id: "FOOD", name: "Food Stalls", x: 35, y: 50 },
    { id: "GAMES", name: "Game Loop", x: 55, y: 25 },
    { id: "STAGE", name: "Main Stage", x: 55, y: 75 },
    { id: "MERCH", name: "Merch Tent", x: 75, y: 50 },
    { id: "FIRSTAID", name: "First Aid Post", x: 92, y: 30 },
    { id: "VIP", name: "VIP Lounge", x: 92, y: 70 },
  ],
  edges: [
    { id: "BR-1", source: "ENTRY", target: "FOOD" },
    { id: "BR-2", source: "FOOD", target: "GAMES" },
    { id: "BR-3", source: "FOOD", target: "STAGE" },
    { id: "BR-4", source: "GAMES", target: "MERCH" },
    { id: "BR-5", source: "STAGE", target: "MERCH" },
    { id: "BR-6", source: "MERCH", target: "FIRSTAID" },
    { id: "BR-7", source: "MERCH", target: "VIP" },
    { id: "BR-8", source: "GAMES", target: "STAGE" }, // Cross-chord in cycle to show multiple non-bridge cycle edges
  ],
};