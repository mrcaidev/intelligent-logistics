import { PriorityQueue } from "src/priority-queue";
import { expect, it } from "vitest";

it("does not sort by default", () => {
  const queue = new PriorityQueue();
  queue.push(1);
  queue.push(2);
  queue.push(3);
  expect(queue.pop()).toEqual(1);
  expect(queue.pop()).toEqual(2);
  expect(queue.pop()).toEqual(3);
});

it("sorts when a compare function is provided", () => {
  const queue = new PriorityQueue((a: number, b: number) => b - a);
  queue.push(1);
  queue.push(2);
  queue.push(3);
  expect(queue.pop()).toEqual(3);
  expect(queue.pop()).toEqual(2);
  expect(queue.pop()).toEqual(1);
});
