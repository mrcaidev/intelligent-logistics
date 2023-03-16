import { Good, GoodQueue, Graph } from "src";
import { beforeEach, describe, expect, it } from "vitest";

const leastCostGraph = new Graph([
  { from: "1", to: "2", weight: 1 },
  { from: "2", to: "3", weight: 1 },
  { from: "1", to: "3", weight: 3 },
]);

const fastestGraph = new Graph([
  { from: "1", to: "2", weight: 2 },
  { from: "2", to: "3", weight: 2 },
  { from: "1", to: "3", weight: 1 },
]);

describe("a real world example", () => {
  const queue = new GoodQueue();

  beforeEach(() => {
    queue.push(
      new Good({
        name: "A",
        departure: "1",
        destination: "2",
        strategy: leastCostGraph,
      })
    );
    queue.push(
      new Good({
        name: "B",
        departure: "1",
        destination: "3",
        strategy: leastCostGraph,
        isVip: true,
      })
    );
    queue.push(
      new Good({
        name: "C",
        departure: "2",
        destination: "3",
        strategy: fastestGraph,
      })
    );
  });

  it("delivers in correct order", () => {
    expect(queue.pop()?.name).toEqual("B");
    expect(queue.pop()?.name).toEqual("A");
    expect(queue.pop()?.name).toEqual("C");
  });

  it("chooses the best path", () => {
    expect(queue.pop()?.getPath().path).toEqual(["1", "2", "3"]);
    expect(queue.pop()?.getPath().path).toEqual(["1", "2"]);
    expect(queue.pop()?.getPath().path).toEqual(["2", "3"]);
  });

  it("can change strategy", () => {
    const goodB = queue.pop();
    expect(goodB?.getPath().weight).toEqual(2);

    goodB?.setStrategy(fastestGraph);
    expect(goodB?.getPath().weight).toEqual(1);
  });

  it("responds to the changes in the graph", () => {
    const goodB = queue.pop();
    expect(goodB?.getPath().path).toEqual(["1", "2", "3"]);

    leastCostGraph.setEdge("1", "2", 10);
    expect(goodB?.getPath().path).toEqual(["1", "3"]);
  });
});
