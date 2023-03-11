import { Graph } from "src/graph";
import { expect, it } from "vitest";

it("initialize shortest paths", () => {
  const graph = new Graph([
    { from: "1", to: "2", weight: 3 },
    { from: "1", to: "4", weight: 5 },
    { from: "2", to: "1", weight: 2 },
    { from: "2", to: "4", weight: 4 },
    { from: "3", to: "2", weight: 1 },
    { from: "4", to: "3", weight: 2 },
  ]);
  expect(graph.getShortestPath("1", "1")).toEqual({
    path: ["1", "1"],
    weight: 0,
  });
  expect(graph.getShortestPath("1", "2")).toEqual({
    path: ["1", "2"],
    weight: 3,
  });
  expect(graph.getShortestPath("1", "3")).toEqual({
    path: ["1", "4", "3"],
    weight: 7,
  });
  expect(graph.getShortestPath("1", "4")).toEqual({
    path: ["1", "4"],
    weight: 5,
  });
  expect(graph.getShortestPath("2", "1")).toEqual({
    path: ["2", "1"],
    weight: 2,
  });
  expect(graph.getShortestPath("2", "2")).toEqual({
    path: ["2", "2"],
    weight: 0,
  });
  expect(graph.getShortestPath("2", "3")).toEqual({
    path: ["2", "4", "3"],
    weight: 6,
  });
  expect(graph.getShortestPath("2", "4")).toEqual({
    path: ["2", "4"],
    weight: 4,
  });
  expect(graph.getShortestPath("3", "1")).toEqual({
    path: ["3", "2", "1"],
    weight: 3,
  });
  expect(graph.getShortestPath("3", "2")).toEqual({
    path: ["3", "2"],
    weight: 1,
  });
  expect(graph.getShortestPath("3", "3")).toEqual({
    path: ["3", "3"],
    weight: 0,
  });
  expect(graph.getShortestPath("3", "4")).toEqual({
    path: ["3", "2", "4"],
    weight: 5,
  });
  expect(graph.getShortestPath("4", "1")).toEqual({
    path: ["4", "3", "2", "1"],
    weight: 5,
  });
  expect(graph.getShortestPath("4", "2")).toEqual({
    path: ["4", "3", "2"],
    weight: 3,
  });
  expect(graph.getShortestPath("4", "3")).toEqual({
    path: ["4", "3"],
    weight: 2,
  });
  expect(graph.getShortestPath("4", "4")).toEqual({
    path: ["4", "4"],
    weight: 0,
  });
});

it("can update weight of an edge", () => {
  const graph = new Graph([
    { from: "1", to: "2", weight: 3 },
    { from: "1", to: "4", weight: 5 },
    { from: "2", to: "1", weight: 2 },
    { from: "2", to: "4", weight: 4 },
    { from: "3", to: "2", weight: 1 },
    { from: "4", to: "3", weight: 2 },
  ]);
  expect(graph.getShortestPath("1", "3")).toEqual({
    path: ["1", "4", "3"],
    weight: 7,
  });

  graph.setEdge("2", "4", 1);
  expect(graph.getShortestPath("1", "3")).toEqual({
    path: ["1", "2", "4", "3"],
    weight: 6,
  });
});

it("can add an edge", () => {
  const graph = new Graph([
    { from: "1", to: "2", weight: 3 },
    { from: "1", to: "4", weight: 5 },
    { from: "2", to: "1", weight: 2 },
    { from: "2", to: "4", weight: 4 },
    { from: "3", to: "2", weight: 1 },
    { from: "4", to: "3", weight: 2 },
  ]);
  expect(graph.getShortestPath("1", "3")).toEqual({
    path: ["1", "4", "3"],
    weight: 7,
  });

  graph.setEdge("1", "3", 1);
  expect(graph.getShortestPath("1", "3")).toEqual({
    path: ["1", "3"],
    weight: 1,
  });
});
