import { Edge, getShortestPath } from "graph";
import { expect, it } from "vitest";

it("can find the shortest path in graph #1", () => {
  const edges = [
    { source: "A", target: "B", cost: 2 },
    { source: "A", target: "C", cost: 1 },
    { source: "A", target: "D", cost: 6 },
    { source: "B", target: "C", cost: 7 },
    { source: "C", target: "D", cost: 4 },
  ];
  expect(getShortestPath(edges, "A", "A")).toEqual(["A"]);
  expect(getShortestPath(edges, "A", "B")).toEqual(["A", "B"]);
  expect(getShortestPath(edges, "A", "C")).toEqual(["A", "C"]);
  expect(getShortestPath(edges, "A", "D")).toEqual(["A", "C", "D"]);
  expect(getShortestPath(edges, "B", "A")).toEqual(["B", "A"]);
  expect(getShortestPath(edges, "B", "B")).toEqual(["B"]);
  expect(getShortestPath(edges, "B", "C")).toEqual(["B", "A", "C"]);
  expect(getShortestPath(edges, "B", "D")).toEqual(["B", "A", "C", "D"]);
  expect(getShortestPath(edges, "C", "A")).toEqual(["C", "A"]);
  expect(getShortestPath(edges, "C", "B")).toEqual(["C", "A", "B"]);
  expect(getShortestPath(edges, "C", "C")).toEqual(["C"]);
  expect(getShortestPath(edges, "C", "D")).toEqual(["C", "D"]);
  expect(getShortestPath(edges, "D", "A")).toEqual(["D", "C", "A"]);
  expect(getShortestPath(edges, "D", "B")).toEqual(["D", "C", "A", "B"]);
  expect(getShortestPath(edges, "D", "C")).toEqual(["D", "C"]);
  expect(getShortestPath(edges, "D", "D")).toEqual(["D"]);
});

it("can find the shortest path in graph #2", () => {
  const edges = [
    { source: "A", target: "B", cost: 3 },
    { source: "A", target: "C", cost: 1 },
    { source: "B", target: "C", cost: 7 },
    { source: "B", target: "D", cost: 5 },
    { source: "B", target: "E", cost: 1 },
    { source: "C", target: "D", cost: 2 },
    { source: "D", target: "E", cost: 7 },
  ];
  expect(getShortestPath(edges, "A", "A")).toEqual(["A"]);
  expect(getShortestPath(edges, "A", "B")).toEqual(["A", "B"]);
  expect(getShortestPath(edges, "A", "C")).toEqual(["A", "C"]);
  expect(getShortestPath(edges, "A", "D")).toEqual(["A", "C", "D"]);
  expect(getShortestPath(edges, "A", "E")).toEqual(["A", "B", "E"]);
  expect(getShortestPath(edges, "B", "A")).toEqual(["B", "A"]);
  expect(getShortestPath(edges, "B", "B")).toEqual(["B"]);
  expect(getShortestPath(edges, "B", "C")).toEqual(["B", "A", "C"]);
  expect(getShortestPath(edges, "B", "D")).toEqual(["B", "D"]);
  expect(getShortestPath(edges, "B", "E")).toEqual(["B", "E"]);
  expect(getShortestPath(edges, "C", "A")).toEqual(["C", "A"]);
  expect(getShortestPath(edges, "C", "B")).toEqual(["C", "A", "B"]);
  expect(getShortestPath(edges, "C", "C")).toEqual(["C"]);
  expect(getShortestPath(edges, "C", "D")).toEqual(["C", "D"]);
  expect(getShortestPath(edges, "C", "E")).toEqual(["C", "A", "B", "E"]);
  expect(getShortestPath(edges, "D", "A")).toEqual(["D", "C", "A"]);
  expect(getShortestPath(edges, "D", "B")).toEqual(["D", "B"]);
  expect(getShortestPath(edges, "D", "C")).toEqual(["D", "C"]);
  expect(getShortestPath(edges, "D", "D")).toEqual(["D"]);
  expect(getShortestPath(edges, "D", "E")).toEqual(["D", "B", "E"]);
});

it("can find the shortest path in graph #3", () => {
  const edges = [
    { source: "A", target: "B", cost: 4 },
    { source: "A", target: "C", cost: 4 },
    { source: "B", target: "C", cost: 2 },
    { source: "C", target: "D", cost: 3 },
    { source: "C", target: "E", cost: 1 },
    { source: "C", target: "F", cost: 6 },
    { source: "D", target: "F", cost: 2 },
    { source: "E", target: "F", cost: 3 },
  ];
  expect(getShortestPath(edges, "A", "A")).toEqual(["A"]);
  expect(getShortestPath(edges, "A", "B")).toEqual(["A", "B"]);
  expect(getShortestPath(edges, "A", "C")).toEqual(["A", "C"]);
  expect(getShortestPath(edges, "A", "D")).toEqual(["A", "C", "D"]);
  expect(getShortestPath(edges, "A", "E")).toEqual(["A", "C", "E"]);
  expect(getShortestPath(edges, "A", "F")).toEqual(["A", "C", "E", "F"]);
  expect(getShortestPath(edges, "B", "A")).toEqual(["B", "A"]);
  expect(getShortestPath(edges, "B", "B")).toEqual(["B"]);
  expect(getShortestPath(edges, "B", "C")).toEqual(["B", "C"]);
  expect(getShortestPath(edges, "B", "D")).toEqual(["B", "C", "D"]);
  expect(getShortestPath(edges, "B", "E")).toEqual(["B", "C", "E"]);
  expect(getShortestPath(edges, "B", "F")).toEqual(["B", "C", "E", "F"]);
  expect(getShortestPath(edges, "C", "A")).toEqual(["C", "A"]);
  expect(getShortestPath(edges, "C", "B")).toEqual(["C", "B"]);
  expect(getShortestPath(edges, "C", "C")).toEqual(["C"]);
  expect(getShortestPath(edges, "C", "D")).toEqual(["C", "D"]);
  expect(getShortestPath(edges, "C", "E")).toEqual(["C", "E"]);
  expect(getShortestPath(edges, "C", "F")).toEqual(["C", "E", "F"]);
  expect(getShortestPath(edges, "D", "A")).toEqual(["D", "C", "A"]);
  expect(getShortestPath(edges, "D", "B")).toEqual(["D", "C", "B"]);
  expect(getShortestPath(edges, "D", "C")).toEqual(["D", "C"]);
  expect(getShortestPath(edges, "D", "D")).toEqual(["D"]);
  expect(getShortestPath(edges, "D", "E")).toEqual(["D", "C", "E"]);
  expect(getShortestPath(edges, "D", "F")).toEqual(["D", "F"]);
  expect(getShortestPath(edges, "E", "A")).toEqual(["E", "C", "A"]);
  expect(getShortestPath(edges, "E", "B")).toEqual(["E", "C", "B"]);
  expect(getShortestPath(edges, "E", "C")).toEqual(["E", "C"]);
  expect(getShortestPath(edges, "E", "D")).toEqual(["E", "C", "D"]);
  expect(getShortestPath(edges, "E", "E")).toEqual(["E"]);
  expect(getShortestPath(edges, "E", "F")).toEqual(["E", "F"]);
  expect(getShortestPath(edges, "F", "A")).toEqual(["F", "E", "C", "A"]);
  expect(getShortestPath(edges, "F", "B")).toEqual(["F", "E", "C", "B"]);
  expect(getShortestPath(edges, "F", "C")).toEqual(["F", "E", "C"]);
  expect(getShortestPath(edges, "F", "D")).toEqual(["F", "D"]);
  expect(getShortestPath(edges, "F", "E")).toEqual(["F", "E"]);
  expect(getShortestPath(edges, "F", "F")).toEqual(["F"]);
});

it("returns an empty array if no path is found", () => {
  const edges: Edge[] = [];
  expect(getShortestPath(edges, "A", "B")).toEqual([]);
});
