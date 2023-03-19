import { Good } from "src/good";
import { Graph } from "src/graph";
import { expect, it } from "vitest";

const strategyA = new Graph([
  { from: "A", to: "B", cost: 2 },
  { from: "A", to: "C", cost: 1 },
  { from: "A", to: "D", cost: 6 },
  { from: "B", to: "C", cost: 7 },
  { from: "C", to: "D", cost: 4 },
]);

const strategyB = new Graph([
  { from: "A", to: "B", cost: 1 },
  { from: "A", to: "C", cost: 1 },
  { from: "A", to: "D", cost: 1 },
  { from: "B", to: "C", cost: 1 },
  { from: "C", to: "D", cost: 1 },
]);

it("knows the best path", () => {
  const good = new Good({
    name: "good",
    source: "B",
    target: "C",
    strategy: strategyA,
  });
  expect(good.getPath()).toEqual({ path: ["B", "A", "C"], cost: 3 });
});

it("can change strategy", () => {
  const good = new Good({
    name: "good",
    source: "B",
    target: "C",
    strategy: strategyA,
  });
  expect(good.getPath()).toEqual({ path: ["B", "A", "C"], cost: 3 });

  good.setStrategy(strategyB);
  expect(good.getPath()).toEqual({ path: ["B", "C"], cost: 1 });
});
