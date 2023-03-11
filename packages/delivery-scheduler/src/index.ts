import { Graph } from "./graph";

const graph = new Graph([
  { from: "a", to: "b", weight: 4 },
  { from: "a", to: "c", weight: 11 },
  { from: "b", to: "a", weight: 6 },
  { from: "b", to: "c", weight: 2 },
  { from: "c", to: "a", weight: 3 },
]);
console.log(graph.getShortestPath("a", "a"));
console.log(graph.getShortestPath("a", "c"));
console.log(graph.getShortestPath("b", "a"));
console.log(graph.getShortestPath("c", "b"));
