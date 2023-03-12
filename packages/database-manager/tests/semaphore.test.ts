import { Semaphore } from "src";
import { afterAll, afterEach, beforeAll, expect, it, vi } from "vitest";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const results: string[] = [];

function createPush(semaphore: Semaphore) {
  return async (item: string) => {
    await semaphore.acquire();

    await sleep(1000);
    results.push(item);

    semaphore.release();
  };
}

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

afterEach(() => {
  results.length = 0;
  vi.clearAllTimers();
});

it("defaults to a binary semaphore", async () => {
  const semaphore = new Semaphore();
  const push = createPush(semaphore);
  push("a");
  push("b");
  push("c");

  expect(results).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(results).toEqual(["a"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(results).toEqual(["a", "b"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(results).toEqual(["a", "b", "c"]);
});

it("can set concurrency limit", async () => {
  const semaphore = new Semaphore(2);
  const push = createPush(semaphore);
  push("a");
  push("b");
  push("c");

  expect(results).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(results).toEqual(["a", "b"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(results).toEqual(["a", "b", "c"]);
});
