import { Good } from "src/good";
import { GoodQueue } from "src/good-queue";
import { Graph } from "src/graph";
import { expect, it, vi } from "vitest";

const graph = new Graph([]);
const fakeGood = (name: string, isVip = false) =>
  new Good({ name, departure: "A", destination: "B", isVip, strategy: graph });

it("first delivers goods that arrived earliest", () => {
  const queue = new GoodQueue();
  queue.push(fakeGood("1"));
  queue.push(fakeGood("2"));
  queue.push(fakeGood("3"));

  expect(queue.pop()?.name).toEqual("1");
  expect(queue.pop()?.name).toEqual("2");
  expect(queue.pop()?.name).toEqual("3");
});

it("put VIP goods first", () => {
  vi.useFakeTimers();

  const queue = new GoodQueue();
  queue.push(fakeGood("1"));
  vi.advanceTimersByTime(86400000);
  queue.push(fakeGood("2"));
  queue.push(fakeGood("3", true));
  vi.advanceTimersByTime(86400000);
  queue.push(fakeGood("4", true));

  expect(queue.pop()?.name).toEqual("1");
  expect(queue.pop()?.name).toEqual("3");
  expect(queue.pop()?.name).toEqual("2");
  expect(queue.pop()?.name).toEqual("4");

  vi.useRealTimers();
});
