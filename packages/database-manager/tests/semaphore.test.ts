import { Semaphore } from "semaphore";
import { afterAll, afterEach, beforeAll, expect, it, vi } from "vitest";

const items: string[] = [];

function createPush(semaphore: Semaphore) {
  return async (item: string) => {
    await semaphore.acquire();

    await new Promise((resolve) => setTimeout(resolve, 1000));
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
  expect(items).toEqual([]);
  expect(semaphore.availableCount).toEqual(1);
  expect(semaphore.blockedCount).toEqual(0);

  const push = createPush(semaphore);
  push("a");
  push("b");
  push("c");

  expect(items).toEqual([]);
  expect(semaphore.availableCount).toEqual(0);
  expect(semaphore.blockedCount).toEqual(2);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a"]);
  expect(semaphore.availableCount).toEqual(0);
  expect(semaphore.blockedCount).toEqual(1);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b"]);
  expect(semaphore.availableCount).toEqual(0);
  expect(semaphore.blockedCount).toEqual(0);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
  expect(semaphore.availableCount).toEqual(1);
  expect(semaphore.blockedCount).toEqual(0);
});

it("can customize concurrency limit", async () => {
  const semaphore = new Semaphore(2);
  expect(items).toEqual([]);
  expect(semaphore.availableCount).toEqual(2);
  expect(semaphore.blockedCount).toEqual(0);

  const push = createPush(semaphore);
  push("a");
  push("b");
  push("c");

  expect(items).toEqual([]);
  expect(semaphore.availableCount).toEqual(0);
  expect(semaphore.blockedCount).toEqual(1);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b"]);
  expect(semaphore.availableCount).toEqual(1);
  expect(semaphore.blockedCount).toEqual(0);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
  expect(semaphore.availableCount).toEqual(2);
  expect(semaphore.blockedCount).toEqual(0);
});
