import { Semaphore } from "src/semaphore";
import { afterAll, afterEach, beforeAll, expect, it, vi } from "vitest";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const items: string[] = [];

function createPush(semaphore: Semaphore) {
  return async (item: string) => {
    await semaphore.acquire();

    await sleep(1000);
    items.push(item);

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
  items.length = 0;
  vi.clearAllTimers();
});

it("defaults to a binary semaphore", async () => {
  const semaphore = new Semaphore();
  const push = createPush(semaphore);
  push("a");
  push("b");
  push("c");

  expect(items).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
});

it("can customize concurrency limit", async () => {
  const semaphore = new Semaphore(2);
  const push = createPush(semaphore);
  push("a");
  push("b");
  push("c");

  expect(items).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
});
