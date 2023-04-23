import { getShortestPath } from "graph";
import { expect, it } from "vitest";

it("can find the shortest path in graph #1", () => {
  const edges = [
    { id: "1", source: "A", target: "B", cost: 2, graphId: "0" },
    { id: "2", source: "A", target: "C", cost: 1, graphId: "0" },
    { id: "3", source: "A", target: "D", cost: 6, graphId: "0" },
    { id: "4", source: "B", target: "C", cost: 7, graphId: "0" },
    { id: "5", source: "C", target: "D", cost: 4, graphId: "0" },
  ];
  expect(getShortestPath(edges, "A", "A")).toEqual({
    nodes: ["A"],
    edges: [],
  });
  expect(getShortestPath(edges, "A", "B")).toEqual({
    nodes: ["A", "B"],
    edges: ["1"],
  });
  expect(getShortestPath(edges, "A", "C")).toEqual({
    nodes: ["A", "C"],
    edges: ["2"],
  });
  expect(getShortestPath(edges, "A", "D")).toEqual({
    nodes: ["A", "C", "D"],
    edges: ["2", "5"],
  });
  expect(getShortestPath(edges, "B", "A")).toEqual({
    nodes: ["B", "A"],
    edges: ["1"],
  });
  expect(getShortestPath(edges, "B", "B")).toEqual({
    nodes: ["B"],
    edges: [],
  });
  expect(getShortestPath(edges, "B", "C")).toEqual({
    nodes: ["B", "A", "C"],
    edges: ["1", "2"],
  });
  expect(getShortestPath(edges, "B", "D")).toEqual({
    nodes: ["B", "A", "C", "D"],
    edges: ["1", "2", "5"],
  });
  expect(getShortestPath(edges, "C", "A")).toEqual({
    nodes: ["C", "A"],
    edges: ["2"],
  });
  expect(getShortestPath(edges, "C", "B")).toEqual({
    nodes: ["C", "A", "B"],
    edges: ["2", "1"],
  });
  expect(getShortestPath(edges, "C", "C")).toEqual({
    nodes: ["C"],
    edges: [],
  });
  expect(getShortestPath(edges, "C", "D")).toEqual({
    nodes: ["C", "D"],
    edges: ["5"],
  });
  expect(getShortestPath(edges, "D", "A")).toEqual({
    nodes: ["D", "C", "A"],
    edges: ["5", "2"],
  });
  expect(getShortestPath(edges, "D", "B")).toEqual({
    nodes: ["D", "C", "A", "B"],
    edges: ["5", "2", "1"],
  });
  expect(getShortestPath(edges, "D", "C")).toEqual({
    nodes: ["D", "C"],
    edges: ["5"],
  });
  expect(getShortestPath(edges, "D", "D")).toEqual({
    nodes: ["D"],
    edges: [],
  });
});

it("can find the shortest path in graph #2", () => {
  const edges = [
    { id: "1", source: "A", target: "B", cost: 3, graphId: "0" },
    { id: "2", source: "A", target: "C", cost: 1, graphId: "0" },
    { id: "3", source: "B", target: "C", cost: 7, graphId: "0" },
    { id: "4", source: "B", target: "D", cost: 5, graphId: "0" },
    { id: "5", source: "B", target: "E", cost: 1, graphId: "0" },
    { id: "6", source: "C", target: "D", cost: 2, graphId: "0" },
    { id: "7", source: "D", target: "E", cost: 7, graphId: "0" },
  ];
  expect(getShortestPath(edges, "A", "A")).toEqual({
    nodes: ["A"],
    edges: [],
  });
  expect(getShortestPath(edges, "A", "B")).toEqual({
    nodes: ["A", "B"],
    edges: ["1"],
  });
  expect(getShortestPath(edges, "A", "C")).toEqual({
    nodes: ["A", "C"],
    edges: ["2"],
  });
  expect(getShortestPath(edges, "A", "D")).toEqual({
    nodes: ["A", "C", "D"],
    edges: ["2", "6"],
  });
  expect(getShortestPath(edges, "A", "E")).toEqual({
    nodes: ["A", "B", "E"],
    edges: ["1", "5"],
  });
  expect(getShortestPath(edges, "B", "A")).toEqual({
    nodes: ["B", "A"],
    edges: ["1"],
  });
  expect(getShortestPath(edges, "B", "B")).toEqual({
    nodes: ["B"],
    edges: [],
  });
  expect(getShortestPath(edges, "B", "C")).toEqual({
    nodes: ["B", "A", "C"],
    edges: ["1", "2"],
  });
  expect(getShortestPath(edges, "B", "D")).toEqual({
    nodes: ["B", "D"],
    edges: ["4"],
  });
  expect(getShortestPath(edges, "B", "E")).toEqual({
    nodes: ["B", "E"],
    edges: ["5"],
  });
  expect(getShortestPath(edges, "C", "A")).toEqual({
    nodes: ["C", "A"],
    edges: ["2"],
  });
  expect(getShortestPath(edges, "C", "B")).toEqual({
    nodes: ["C", "A", "B"],
    edges: ["2", "1"],
  });
  expect(getShortestPath(edges, "C", "C")).toEqual({
    nodes: ["C"],
    edges: [],
  });
  expect(getShortestPath(edges, "C", "D")).toEqual({
    nodes: ["C", "D"],
    edges: ["6"],
  });
  expect(getShortestPath(edges, "C", "E")).toEqual({
    nodes: ["C", "A", "B", "E"],
    edges: ["2", "1", "5"],
  });
  expect(getShortestPath(edges, "D", "A")).toEqual({
    nodes: ["D", "C", "A"],
    edges: ["6", "2"],
  });
  expect(getShortestPath(edges, "D", "B")).toEqual({
    nodes: ["D", "B"],
    edges: ["4"],
  });
  expect(getShortestPath(edges, "D", "C")).toEqual({
    nodes: ["D", "C"],
    edges: ["6"],
  });
  expect(getShortestPath(edges, "D", "D")).toEqual({
    nodes: ["D"],
    edges: [],
  });
  expect(getShortestPath(edges, "D", "E")).toEqual({
    nodes: ["D", "B", "E"],
    edges: ["4", "5"],
  });
});

it("can find the shortest path in graph #3", () => {
  const edges = [
    { id: "1", source: "A", target: "B", cost: 4, graphId: "0" },
    { id: "2", source: "A", target: "C", cost: 4, graphId: "0" },
    { id: "3", source: "B", target: "C", cost: 2, graphId: "0" },
    { id: "4", source: "C", target: "D", cost: 3, graphId: "0" },
    { id: "5", source: "C", target: "E", cost: 1, graphId: "0" },
    { id: "6", source: "C", target: "F", cost: 6, graphId: "0" },
    { id: "7", source: "D", target: "F", cost: 2, graphId: "0" },
    { id: "8", source: "E", target: "F", cost: 3, graphId: "0" },
  ];
  expect(getShortestPath(edges, "A", "A")).toEqual({
    nodes: ["A"],
    edges: [],
  });
  expect(getShortestPath(edges, "A", "B")).toEqual({
    nodes: ["A", "B"],
    edges: ["1"],
  });
  expect(getShortestPath(edges, "A", "C")).toEqual({
    nodes: ["A", "C"],
    edges: ["2"],
  });
  expect(getShortestPath(edges, "A", "D")).toEqual({
    nodes: ["A", "C", "D"],
    edges: ["2", "4"],
  });
  expect(getShortestPath(edges, "A", "E")).toEqual({
    nodes: ["A", "C", "E"],
    edges: ["2", "5"],
  });
  expect(getShortestPath(edges, "A", "F")).toEqual({
    nodes: ["A", "C", "E", "F"],
    edges: ["2", "5", "8"],
  });
  expect(getShortestPath(edges, "B", "A")).toEqual({
    nodes: ["B", "A"],
    edges: ["1"],
  });
  expect(getShortestPath(edges, "B", "B")).toEqual({
    nodes: ["B"],
    edges: [],
  });
  expect(getShortestPath(edges, "B", "C")).toEqual({
    nodes: ["B", "C"],
    edges: ["3"],
  });
  expect(getShortestPath(edges, "B", "D")).toEqual({
    nodes: ["B", "C", "D"],
    edges: ["3", "4"],
  });
  expect(getShortestPath(edges, "B", "E")).toEqual({
    nodes: ["B", "C", "E"],
    edges: ["3", "5"],
  });
  expect(getShortestPath(edges, "B", "F")).toEqual({
    nodes: ["B", "C", "E", "F"],
    edges: ["3", "5", "8"],
  });
  expect(getShortestPath(edges, "C", "A")).toEqual({
    nodes: ["C", "A"],
    edges: ["2"],
  });
  expect(getShortestPath(edges, "C", "B")).toEqual({
    nodes: ["C", "B"],
    edges: ["3"],
  });
  expect(getShortestPath(edges, "C", "C")).toEqual({
    nodes: ["C"],
    edges: [],
  });
  expect(getShortestPath(edges, "C", "D")).toEqual({
    nodes: ["C", "D"],
    edges: ["4"],
  });
  expect(getShortestPath(edges, "C", "E")).toEqual({
    nodes: ["C", "E"],
    edges: ["5"],
  });
  expect(getShortestPath(edges, "C", "F")).toEqual({
    nodes: ["C", "E", "F"],
    edges: ["5", "8"],
  });
  expect(getShortestPath(edges, "D", "A")).toEqual({
    nodes: ["D", "C", "A"],
    edges: ["4", "2"],
  });
  expect(getShortestPath(edges, "D", "B")).toEqual({
    nodes: ["D", "C", "B"],
    edges: ["4", "3"],
  });
  expect(getShortestPath(edges, "D", "C")).toEqual({
    nodes: ["D", "C"],
    edges: ["4"],
  });
  expect(getShortestPath(edges, "D", "D")).toEqual({
    nodes: ["D"],
    edges: [],
  });
  expect(getShortestPath(edges, "D", "E")).toEqual({
    nodes: ["D", "C", "E"],
    edges: ["4", "5"],
  });
  expect(getShortestPath(edges, "D", "F")).toEqual({
    nodes: ["D", "F"],
    edges: ["7"],
  });
  expect(getShortestPath(edges, "E", "A")).toEqual({
    nodes: ["E", "C", "A"],
    edges: ["5", "2"],
  });
  expect(getShortestPath(edges, "E", "B")).toEqual({
    nodes: ["E", "C", "B"],
    edges: ["5", "3"],
  });
  expect(getShortestPath(edges, "E", "C")).toEqual({
    nodes: ["E", "C"],
    edges: ["5"],
  });
  expect(getShortestPath(edges, "E", "D")).toEqual({
    nodes: ["E", "C", "D"],
    edges: ["5", "4"],
  });
  expect(getShortestPath(edges, "E", "E")).toEqual({
    nodes: ["E"],
    edges: [],
  });
  expect(getShortestPath(edges, "E", "F")).toEqual({
    nodes: ["E", "F"],
    edges: ["8"],
  });
  expect(getShortestPath(edges, "F", "A")).toEqual({
    nodes: ["F", "E", "C", "A"],
    edges: ["8", "5", "2"],
  });
  expect(getShortestPath(edges, "F", "B")).toEqual({
    nodes: ["F", "E", "C", "B"],
    edges: ["8", "5", "3"],
  });
  expect(getShortestPath(edges, "F", "C")).toEqual({
    nodes: ["F", "E", "C"],
    edges: ["8", "5"],
  });
  expect(getShortestPath(edges, "F", "D")).toEqual({
    nodes: ["F", "D"],
    edges: ["7"],
  });
  expect(getShortestPath(edges, "F", "E")).toEqual({
    nodes: ["F", "E"],
    edges: ["8"],
  });
  expect(getShortestPath(edges, "F", "F")).toEqual({
    nodes: ["F"],
    edges: [],
  });
});

it("returns an empty array if no path is found", () => {
  expect(getShortestPath([], "A", "B")).toEqual({ nodes: [], edges: [] });
});
