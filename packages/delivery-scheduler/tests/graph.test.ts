import { Graph } from "src/graph";
import { expect, it } from "vitest";

it("initializes shortest paths", () => {
  const graph = new Graph([
    { from: "A", to: "B", cost: 2 },
    { from: "A", to: "C", cost: 1 },
    { from: "A", to: "D", cost: 6 },
    { from: "B", to: "C", cost: 7 },
    { from: "C", to: "D", cost: 4 },
  ]);
  expect(graph.getShortestPath("A", "A")).toEqual({
    path: ["A", "A"],
    cost: 0,
  });
  expect(graph.getShortestPath("A", "B")).toEqual({
    path: ["A", "B"],
    cost: 2,
  });
  expect(graph.getShortestPath("A", "C")).toEqual({
    path: ["A", "C"],
    cost: 1,
  });
  expect(graph.getShortestPath("A", "D")).toEqual({
    path: ["A", "C", "D"],
    cost: 5,
  });
  expect(graph.getShortestPath("B", "A")).toEqual({
    path: ["B", "A"],
    cost: 2,
  });
  expect(graph.getShortestPath("B", "B")).toEqual({
    path: ["B", "B"],
    cost: 0,
  });
  expect(graph.getShortestPath("B", "C")).toEqual({
    path: ["B", "A", "C"],
    cost: 3,
  });
  expect(graph.getShortestPath("B", "D")).toEqual({
    path: ["B", "A", "C", "D"],
    cost: 7,
  });
  expect(graph.getShortestPath("C", "A")).toEqual({
    path: ["C", "A"],
    cost: 1,
  });
  expect(graph.getShortestPath("C", "B")).toEqual({
    path: ["C", "A", "B"],
    cost: 3,
  });
  expect(graph.getShortestPath("C", "C")).toEqual({
    path: ["C", "C"],
    cost: 0,
  });
  expect(graph.getShortestPath("C", "D")).toEqual({
    path: ["C", "D"],
    cost: 4,
  });
  expect(graph.getShortestPath("D", "A")).toEqual({
    path: ["D", "C", "A"],
    cost: 5,
  });
  expect(graph.getShortestPath("D", "B")).toEqual({
    path: ["D", "C", "A", "B"],
    cost: 7,
  });
  expect(graph.getShortestPath("D", "C")).toEqual({
    path: ["D", "C"],
    cost: 4,
  });
  expect(graph.getShortestPath("D", "D")).toEqual({
    path: ["D", "D"],
    cost: 0,
  });
});

it("can update cost of an edge", () => {
  const graph = new Graph([
    { from: "A", to: "B", cost: 2 },
    { from: "A", to: "C", cost: 1 },
    { from: "A", to: "D", cost: 6 },
    { from: "B", to: "C", cost: 7 },
    { from: "C", to: "D", cost: 4 },
  ]);
  expect(graph.getShortestPath("A", "D")).toEqual({
    path: ["A", "C", "D"],
    cost: 5,
  });

  graph.setEdge("A", "D", 3);
  expect(graph.getShortestPath("A", "D")).toEqual({
    path: ["A", "D"],
    cost: 3,
  });
});

it("can add an edge", () => {
  const graph = new Graph([
    { from: "A", to: "B", cost: 2 },
    { from: "A", to: "C", cost: 1 },
    { from: "A", to: "D", cost: 6 },
    { from: "B", to: "C", cost: 7 },
    { from: "C", to: "D", cost: 4 },
  ]);
  expect(graph.getShortestPath("B", "D")).toEqual({
    path: ["B", "A", "C", "D"],
    cost: 7,
  });

  graph.setEdge("B", "D", 2);
  expect(graph.getShortestPath("B", "D")).toEqual({
    path: ["B", "D"],
    cost: 2,
  });
});
