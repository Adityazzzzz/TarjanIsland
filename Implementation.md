Implementation Plan

Graph Validation and Adjacency Construction: 
We will define a strict TypeScript schema for the nodes (6–9 islands) and undirected edges (6–13 bridges). The initial calculation engine will validate finite x and y coordinates, ensure unique IDs, reject self-loops, and build deterministic adjacency lists sorted in ascending ASCII order.

Low-Link DFS Traversal and Event Logging: 
We will implement Tarjan's algorithm using a zero-based discovery clock to identify critical bridges and articulation points. Instead of just returning the final arrays, this DFS function will push structured event objects (e.g., node discovered, edge inspected, low value updated) to an array, capturing every numerical change for the visualizer.

Replay Engine and State Management: 
We will build a custom React hook to manage the event array, exposing the required Load My Archipelago, Step, Run to End, and Reset controls. This controller will keep the active event, the map highlights, and the numeric node table perfectly synchronized during playback

Visualization and Node Table UI: 
We will construct a frontend workspace featuring an SVG-based island map that distinguishes unvisited, current, and classified states. Alongside the map, we will render a compact node table displaying IDs, parents, discovery/low values, component counts, and sorted critical-item summaries.

// ----------------------------------------------------------------------------------------------------
Think of our code as a team organizing a festival:

1. types.ts (The Rulebook): This file just defines our vocabulary. It says, "An Island must have an ID and coordinates," and "A Bridge connects exactly two islands." It also lists every possible event our explorer can report, like discovering an island or finding a critical bridge.

2. data.ts (The Paper Map): This is our actual festival layout. It lists our 7 specific islands (like "Food Stalls" and "Main Stage") and the 8 bridges connecting them.

3. graph.ts (The Safety Inspector): Before anyone walks the islands, this inspector checks the paper map for mistakes. It makes sure no bridge connects an island to itself and that no islands share the same name. Then, it creates a neat, alphabetical list for every island showing exactly which other islands it connects to.

4. tarjan.ts (The Explorer with a Camera): This is the heavy algorithm. Imagine a person walking the bridges with a stopwatch and a camera. They step on an island and write down the exact time. If they walk down a path, hit a dead end, and realize they can't circle back to the start, they flag that path as a dangerous bridge. Every single time they take a step or make a decision, they snap a photo of their notebook. By the end, they hand us a massive stack of photos detailing the entire journey.

5. useReplay.ts (The TV Remote): This file takes that stack of photos from the Explorer and puts them on a screen. It gives the user the exact controls required: Step (show the next photo), Run to End (fast forward to the final photo), and Reset (rewind to the beginning).