import { getShortestPath } from "graph";
import { expect, it } from "vitest";

it("finds the shortest path in graph #1", () => {
  const edges = [
    { id: "1", sourceId: "A", targetId: "B", cost: 2, graphId: "0" },
    { id: "2", sourceId: "A", targetId: "C", cost: 1, graphId: "0" },
    { id: "3", sourceId: "A", targetId: "D", cost: 6, graphId: "0" },
    { id: "4", sourceId: "B", targetId: "C", cost: 7, graphId: "0" },
    { id: "5", sourceId: "C", targetId: "D", cost: 4, graphId: "0" },
  ];
  expect(getShortestPath(edges, "A", "A")).toEqual(["A"]);
  expect(getShortestPath(edges, "A", "B")).toEqual(["A", "1", "B"]);
  expect(getShortestPath(edges, "A", "C")).toEqual(["A", "2", "C"]);
  expect(getShortestPath(edges, "A", "D")).toEqual(["A", "2", "C", "5", "D"]);
  expect(getShortestPath(edges, "B", "A")).toEqual(["B", "1", "A"]);
  expect(getShortestPath(edges, "B", "B")).toEqual(["B"]);
  expect(getShortestPath(edges, "B", "C")).toEqual(["B", "1", "A", "2", "C"]);
  expect(getShortestPath(edges, "B", "D")).toEqual([
    "B",
    "1",
    "A",
    "2",
    "C",
    "5",
    "D",
  ]);
  expect(getShortestPath(edges, "C", "A")).toEqual(["C", "2", "A"]);
  expect(getShortestPath(edges, "C", "B")).toEqual(["C", "2", "A", "1", "B"]);
  expect(getShortestPath(edges, "C", "C")).toEqual(["C"]);
  expect(getShortestPath(edges, "C", "D")).toEqual(["C", "5", "D"]);
  expect(getShortestPath(edges, "D", "A")).toEqual(["D", "5", "C", "2", "A"]);
  expect(getShortestPath(edges, "D", "B")).toEqual([
    "D",
    "5",
    "C",
    "2",
    "A",
    "1",
    "B",
  ]);
  expect(getShortestPath(edges, "D", "C")).toEqual(["D", "5", "C"]);
  expect(getShortestPath(edges, "D", "D")).toEqual(["D"]);
});

it("finds the shortest path in graph #2", () => {
  const edges = [
    { id: "1", sourceId: "A", targetId: "B", cost: 3, graphId: "0" },
    { id: "2", sourceId: "A", targetId: "C", cost: 1, graphId: "0" },
    { id: "3", sourceId: "B", targetId: "C", cost: 7, graphId: "0" },
    { id: "4", sourceId: "B", targetId: "D", cost: 5, graphId: "0" },
    { id: "5", sourceId: "B", targetId: "E", cost: 1, graphId: "0" },
    { id: "6", sourceId: "C", targetId: "D", cost: 2, graphId: "0" },
    { id: "7", sourceId: "D", targetId: "E", cost: 7, graphId: "0" },
  ];
  expect(getShortestPath(edges, "A", "A")).toEqual(["A"]);
  expect(getShortestPath(edges, "A", "B")).toEqual(["A", "1", "B"]);
  expect(getShortestPath(edges, "A", "C")).toEqual(["A", "2", "C"]);
  expect(getShortestPath(edges, "A", "D")).toEqual(["A", "2", "C", "6", "D"]);
  expect(getShortestPath(edges, "A", "E")).toEqual(["A", "1", "B", "5", "E"]);
  expect(getShortestPath(edges, "B", "A")).toEqual(["B", "1", "A"]);
  expect(getShortestPath(edges, "B", "B")).toEqual(["B"]);
  expect(getShortestPath(edges, "B", "C")).toEqual(["B", "1", "A", "2", "C"]);
  expect(getShortestPath(edges, "B", "D")).toEqual(["B", "4", "D"]);
  expect(getShortestPath(edges, "B", "E")).toEqual(["B", "5", "E"]);
  expect(getShortestPath(edges, "C", "A")).toEqual(["C", "2", "A"]);
  expect(getShortestPath(edges, "C", "B")).toEqual(["C", "2", "A", "1", "B"]);
  expect(getShortestPath(edges, "C", "C")).toEqual(["C"]);
  expect(getShortestPath(edges, "C", "D")).toEqual(["C", "6", "D"]);
  expect(getShortestPath(edges, "C", "E")).toEqual([
    "C",
    "2",
    "A",
    "1",
    "B",
    "5",
    "E",
  ]);
  expect(getShortestPath(edges, "D", "A")).toEqual(["D", "6", "C", "2", "A"]);
  expect(getShortestPath(edges, "D", "B")).toEqual(["D", "4", "B"]);
  expect(getShortestPath(edges, "D", "C")).toEqual(["D", "6", "C"]);
  expect(getShortestPath(edges, "D", "D")).toEqual(["D"]);
  expect(getShortestPath(edges, "D", "E")).toEqual(["D", "4", "B", "5", "E"]);
});

it("finds the shortest path in graph #3", () => {
  const edges = [
    { id: "1", sourceId: "A", targetId: "B", cost: 4, graphId: "0" },
    { id: "2", sourceId: "A", targetId: "C", cost: 4, graphId: "0" },
    { id: "3", sourceId: "B", targetId: "C", cost: 2, graphId: "0" },
    { id: "4", sourceId: "C", targetId: "D", cost: 3, graphId: "0" },
    { id: "5", sourceId: "C", targetId: "E", cost: 1, graphId: "0" },
    { id: "6", sourceId: "C", targetId: "F", cost: 6, graphId: "0" },
    { id: "7", sourceId: "D", targetId: "F", cost: 2, graphId: "0" },
    { id: "8", sourceId: "E", targetId: "F", cost: 3, graphId: "0" },
  ];
  expect(getShortestPath(edges, "A", "A")).toEqual(["A"]);
  expect(getShortestPath(edges, "A", "B")).toEqual(["A", "1", "B"]);
  expect(getShortestPath(edges, "A", "C")).toEqual(["A", "2", "C"]);
  expect(getShortestPath(edges, "A", "D")).toEqual(["A", "2", "C", "4", "D"]);
  expect(getShortestPath(edges, "A", "E")).toEqual(["A", "2", "C", "5", "E"]);
  expect(getShortestPath(edges, "A", "F")).toEqual([
    "A",
    "2",
    "C",
    "5",
    "E",
    "8",
    "F",
  ]);
  expect(getShortestPath(edges, "B", "A")).toEqual(["B", "1", "A"]);
  expect(getShortestPath(edges, "B", "B")).toEqual(["B"]);
  expect(getShortestPath(edges, "B", "C")).toEqual(["B", "3", "C"]);
  expect(getShortestPath(edges, "B", "D")).toEqual(["B", "3", "C", "4", "D"]);
  expect(getShortestPath(edges, "B", "E")).toEqual(["B", "3", "C", "5", "E"]);
  expect(getShortestPath(edges, "B", "F")).toEqual([
    "B",
    "3",
    "C",
    "5",
    "E",
    "8",
    "F",
  ]);
  expect(getShortestPath(edges, "C", "A")).toEqual(["C", "2", "A"]);
  expect(getShortestPath(edges, "C", "B")).toEqual(["C", "3", "B"]);
  expect(getShortestPath(edges, "C", "C")).toEqual(["C"]);
  expect(getShortestPath(edges, "C", "D")).toEqual(["C", "4", "D"]);
  expect(getShortestPath(edges, "C", "E")).toEqual(["C", "5", "E"]);
  expect(getShortestPath(edges, "C", "F")).toEqual(["C", "5", "E", "8", "F"]);
  expect(getShortestPath(edges, "D", "A")).toEqual(["D", "4", "C", "2", "A"]);
  expect(getShortestPath(edges, "D", "B")).toEqual(["D", "4", "C", "3", "B"]);
  expect(getShortestPath(edges, "D", "C")).toEqual(["D", "4", "C"]);
  expect(getShortestPath(edges, "D", "D")).toEqual(["D"]);
  expect(getShortestPath(edges, "D", "E")).toEqual(["D", "4", "C", "5", "E"]);
  expect(getShortestPath(edges, "D", "F")).toEqual(["D", "7", "F"]);
  expect(getShortestPath(edges, "E", "A")).toEqual(["E", "5", "C", "2", "A"]);
  expect(getShortestPath(edges, "E", "B")).toEqual(["E", "5", "C", "3", "B"]);
  expect(getShortestPath(edges, "E", "C")).toEqual(["E", "5", "C"]);
  expect(getShortestPath(edges, "E", "D")).toEqual(["E", "5", "C", "4", "D"]);
  expect(getShortestPath(edges, "E", "E")).toEqual(["E"]);
  expect(getShortestPath(edges, "E", "F")).toEqual(["E", "8", "F"]);
  expect(getShortestPath(edges, "F", "A")).toEqual([
    "F",
    "8",
    "E",
    "5",
    "C",
    "2",
    "A",
  ]);
  expect(getShortestPath(edges, "F", "B")).toEqual([
    "F",
    "8",
    "E",
    "5",
    "C",
    "3",
    "B",
  ]);
  expect(getShortestPath(edges, "F", "C")).toEqual(["F", "8", "E", "5", "C"]);
  expect(getShortestPath(edges, "F", "D")).toEqual(["F", "7", "D"]);
  expect(getShortestPath(edges, "F", "E")).toEqual(["F", "8", "E"]);
  expect(getShortestPath(edges, "F", "F")).toEqual(["F"]);
});

it("returns an empty array when nodes do not exist", () => {
  expect(getShortestPath([], "A", "B")).toEqual([]);
});
