import { getShortestPath } from "graph";
import { expect, it } from "vitest";

it("finds the shortest path in graph #1", () => {
  const edges = [
    { id: "1", source: "A", target: "B", cost: 2, graphId: "0" },
    { id: "2", source: "A", target: "C", cost: 1, graphId: "0" },
    { id: "3", source: "A", target: "D", cost: 6, graphId: "0" },
    { id: "4", source: "B", target: "C", cost: 7, graphId: "0" },
    { id: "5", source: "C", target: "D", cost: 4, graphId: "0" },
  ];
  expect(getShortestPath(edges, "A", "A")).toEqual({
    nodes: ["A"],
    edgeIds: [],
  });
  expect(getShortestPath(edges, "A", "B")).toEqual({
    nodes: ["A", "B"],
    edgeIds: ["1"],
  });
  expect(getShortestPath(edges, "A", "C")).toEqual({
    nodes: ["A", "C"],
    edgeIds: ["2"],
  });
  expect(getShortestPath(edges, "A", "D")).toEqual({
    nodes: ["A", "C", "D"],
    edgeIds: ["2", "5"],
  });
  expect(getShortestPath(edges, "B", "A")).toEqual({
    nodes: ["B", "A"],
    edgeIds: ["1"],
  });
  expect(getShortestPath(edges, "B", "B")).toEqual({
    nodes: ["B"],
    edgeIds: [],
  });
  expect(getShortestPath(edges, "B", "C")).toEqual({
    nodes: ["B", "A", "C"],
    edgeIds: ["1", "2"],
  });
  expect(getShortestPath(edges, "B", "D")).toEqual({
    nodes: ["B", "A", "C", "D"],
    edgeIds: ["1", "2", "5"],
  });
  expect(getShortestPath(edges, "C", "A")).toEqual({
    nodes: ["C", "A"],
    edgeIds: ["2"],
  });
  expect(getShortestPath(edges, "C", "B")).toEqual({
    nodes: ["C", "A", "B"],
    edgeIds: ["2", "1"],
  });
  expect(getShortestPath(edges, "C", "C")).toEqual({
    nodes: ["C"],
    edgeIds: [],
  });
  expect(getShortestPath(edges, "C", "D")).toEqual({
    nodes: ["C", "D"],
    edgeIds: ["5"],
  });
  expect(getShortestPath(edges, "D", "A")).toEqual({
    nodes: ["D", "C", "A"],
    edgeIds: ["5", "2"],
  });
  expect(getShortestPath(edges, "D", "B")).toEqual({
    nodes: ["D", "C", "A", "B"],
    edgeIds: ["5", "2", "1"],
  });
  expect(getShortestPath(edges, "D", "C")).toEqual({
    nodes: ["D", "C"],
    edgeIds: ["5"],
  });
  expect(getShortestPath(edges, "D", "D")).toEqual({
    nodes: ["D"],
    edgeIds: [],
  });
});

it("finds the shortest path in graph #2", () => {
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
    edgeIds: [],
  });
  expect(getShortestPath(edges, "A", "B")).toEqual({
    nodes: ["A", "B"],
    edgeIds: ["1"],
  });
  expect(getShortestPath(edges, "A", "C")).toEqual({
    nodes: ["A", "C"],
    edgeIds: ["2"],
  });
  expect(getShortestPath(edges, "A", "D")).toEqual({
    nodes: ["A", "C", "D"],
    edgeIds: ["2", "6"],
  });
  expect(getShortestPath(edges, "A", "E")).toEqual({
    nodes: ["A", "B", "E"],
    edgeIds: ["1", "5"],
  });
  expect(getShortestPath(edges, "B", "A")).toEqual({
    nodes: ["B", "A"],
    edgeIds: ["1"],
  });
  expect(getShortestPath(edges, "B", "B")).toEqual({
    nodes: ["B"],
    edgeIds: [],
  });
  expect(getShortestPath(edges, "B", "C")).toEqual({
    nodes: ["B", "A", "C"],
    edgeIds: ["1", "2"],
  });
  expect(getShortestPath(edges, "B", "D")).toEqual({
    nodes: ["B", "D"],
    edgeIds: ["4"],
  });
  expect(getShortestPath(edges, "B", "E")).toEqual({
    nodes: ["B", "E"],
    edgeIds: ["5"],
  });
  expect(getShortestPath(edges, "C", "A")).toEqual({
    nodes: ["C", "A"],
    edgeIds: ["2"],
  });
  expect(getShortestPath(edges, "C", "B")).toEqual({
    nodes: ["C", "A", "B"],
    edgeIds: ["2", "1"],
  });
  expect(getShortestPath(edges, "C", "C")).toEqual({
    nodes: ["C"],
    edgeIds: [],
  });
  expect(getShortestPath(edges, "C", "D")).toEqual({
    nodes: ["C", "D"],
    edgeIds: ["6"],
  });
  expect(getShortestPath(edges, "C", "E")).toEqual({
    nodes: ["C", "A", "B", "E"],
    edgeIds: ["2", "1", "5"],
  });
  expect(getShortestPath(edges, "D", "A")).toEqual({
    nodes: ["D", "C", "A"],
    edgeIds: ["6", "2"],
  });
  expect(getShortestPath(edges, "D", "B")).toEqual({
    nodes: ["D", "B"],
    edgeIds: ["4"],
  });
  expect(getShortestPath(edges, "D", "C")).toEqual({
    nodes: ["D", "C"],
    edgeIds: ["6"],
  });
  expect(getShortestPath(edges, "D", "D")).toEqual({
    nodes: ["D"],
    edgeIds: [],
  });
  expect(getShortestPath(edges, "D", "E")).toEqual({
    nodes: ["D", "B", "E"],
    edgeIds: ["4", "5"],
  });
});

it("finds the shortest path in graph #3", () => {
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
    edgeIds: [],
  });
  expect(getShortestPath(edges, "A", "B")).toEqual({
    nodes: ["A", "B"],
    edgeIds: ["1"],
  });
  expect(getShortestPath(edges, "A", "C")).toEqual({
    nodes: ["A", "C"],
    edgeIds: ["2"],
  });
  expect(getShortestPath(edges, "A", "D")).toEqual({
    nodes: ["A", "C", "D"],
    edgeIds: ["2", "4"],
  });
  expect(getShortestPath(edges, "A", "E")).toEqual({
    nodes: ["A", "C", "E"],
    edgeIds: ["2", "5"],
  });
  expect(getShortestPath(edges, "A", "F")).toEqual({
    nodes: ["A", "C", "E", "F"],
    edgeIds: ["2", "5", "8"],
  });
  expect(getShortestPath(edges, "B", "A")).toEqual({
    nodes: ["B", "A"],
    edgeIds: ["1"],
  });
  expect(getShortestPath(edges, "B", "B")).toEqual({
    nodes: ["B"],
    edgeIds: [],
  });
  expect(getShortestPath(edges, "B", "C")).toEqual({
    nodes: ["B", "C"],
    edgeIds: ["3"],
  });
  expect(getShortestPath(edges, "B", "D")).toEqual({
    nodes: ["B", "C", "D"],
    edgeIds: ["3", "4"],
  });
  expect(getShortestPath(edges, "B", "E")).toEqual({
    nodes: ["B", "C", "E"],
    edgeIds: ["3", "5"],
  });
  expect(getShortestPath(edges, "B", "F")).toEqual({
    nodes: ["B", "C", "E", "F"],
    edgeIds: ["3", "5", "8"],
  });
  expect(getShortestPath(edges, "C", "A")).toEqual({
    nodes: ["C", "A"],
    edgeIds: ["2"],
  });
  expect(getShortestPath(edges, "C", "B")).toEqual({
    nodes: ["C", "B"],
    edgeIds: ["3"],
  });
  expect(getShortestPath(edges, "C", "C")).toEqual({
    nodes: ["C"],
    edgeIds: [],
  });
  expect(getShortestPath(edges, "C", "D")).toEqual({
    nodes: ["C", "D"],
    edgeIds: ["4"],
  });
  expect(getShortestPath(edges, "C", "E")).toEqual({
    nodes: ["C", "E"],
    edgeIds: ["5"],
  });
  expect(getShortestPath(edges, "C", "F")).toEqual({
    nodes: ["C", "E", "F"],
    edgeIds: ["5", "8"],
  });
  expect(getShortestPath(edges, "D", "A")).toEqual({
    nodes: ["D", "C", "A"],
    edgeIds: ["4", "2"],
  });
  expect(getShortestPath(edges, "D", "B")).toEqual({
    nodes: ["D", "C", "B"],
    edgeIds: ["4", "3"],
  });
  expect(getShortestPath(edges, "D", "C")).toEqual({
    nodes: ["D", "C"],
    edgeIds: ["4"],
  });
  expect(getShortestPath(edges, "D", "D")).toEqual({
    nodes: ["D"],
    edgeIds: [],
  });
  expect(getShortestPath(edges, "D", "E")).toEqual({
    nodes: ["D", "C", "E"],
    edgeIds: ["4", "5"],
  });
  expect(getShortestPath(edges, "D", "F")).toEqual({
    nodes: ["D", "F"],
    edgeIds: ["7"],
  });
  expect(getShortestPath(edges, "E", "A")).toEqual({
    nodes: ["E", "C", "A"],
    edgeIds: ["5", "2"],
  });
  expect(getShortestPath(edges, "E", "B")).toEqual({
    nodes: ["E", "C", "B"],
    edgeIds: ["5", "3"],
  });
  expect(getShortestPath(edges, "E", "C")).toEqual({
    nodes: ["E", "C"],
    edgeIds: ["5"],
  });
  expect(getShortestPath(edges, "E", "D")).toEqual({
    nodes: ["E", "C", "D"],
    edgeIds: ["5", "4"],
  });
  expect(getShortestPath(edges, "E", "E")).toEqual({
    nodes: ["E"],
    edgeIds: [],
  });
  expect(getShortestPath(edges, "E", "F")).toEqual({
    nodes: ["E", "F"],
    edgeIds: ["8"],
  });
  expect(getShortestPath(edges, "F", "A")).toEqual({
    nodes: ["F", "E", "C", "A"],
    edgeIds: ["8", "5", "2"],
  });
  expect(getShortestPath(edges, "F", "B")).toEqual({
    nodes: ["F", "E", "C", "B"],
    edgeIds: ["8", "5", "3"],
  });
  expect(getShortestPath(edges, "F", "C")).toEqual({
    nodes: ["F", "E", "C"],
    edgeIds: ["8", "5"],
  });
  expect(getShortestPath(edges, "F", "D")).toEqual({
    nodes: ["F", "D"],
    edgeIds: ["7"],
  });
  expect(getShortestPath(edges, "F", "E")).toEqual({
    nodes: ["F", "E"],
    edgeIds: ["8"],
  });
  expect(getShortestPath(edges, "F", "F")).toEqual({
    nodes: ["F"],
    edgeIds: [],
  });
});

it("returns two empty arrays when no path is found", () => {
  expect(getShortestPath([], "A", "B")).toEqual({ nodes: [], edgeIds: [] });
});
