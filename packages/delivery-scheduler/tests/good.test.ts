import { Good } from "src/good";
import { Graph } from "src/graph";
import { expect, it } from "vitest";

const strategyA = new Graph([
  { from: "1", to: "2", weight: 1 },
  { from: "2", to: "3", weight: 1 },
  { from: "1", to: "3", weight: 3 },
]);

const strategyB = new Graph([
  { from: "1", to: "2", weight: 2 },
  { from: "2", to: "3", weight: 2 },
  { from: "1", to: "3", weight: 1 },
]);

it("knows the best path", () => {
  const good = new Good({
    name: "good",
    departure: "1",
    destination: "3",
    strategy: strategyA,
  });
  expect(good.getPath()).toEqual({ path: ["1", "2", "3"], weight: 2 });
});

it("can change strategy", () => {
  const good = new Good({
    name: "good",
    departure: "1",
    destination: "3",
    strategy: strategyA,
  });
  expect(good.getPath()).toEqual({ path: ["1", "2", "3"], weight: 2 });

  good.setStrategy(strategyB);
  expect(good.getPath()).toEqual({ path: ["1", "3"], weight: 1 });
});
