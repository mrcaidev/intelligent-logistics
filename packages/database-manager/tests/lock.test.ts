import { LockManager } from "lock";
import { afterAll, beforeAll, beforeEach, expect, it, vi } from "vitest";

const items: string[] = [];

function createRead(manager: LockManager) {
  return async (item: string) => {
    await manager.acquireSharedLock();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    items.push(item);

    manager.releaseSharedLock();
  };
}

function createWrite(manager: LockManager) {
  return async (item: string) => {
    await manager.acquireExclusiveLock();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    items.push(item);

    manager.releaseExclusiveLock();
  };
}

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  items.length = 0;
  vi.clearAllTimers();
});

it("S-S locks are compatible", async () => {
  const manager = new LockManager();
  const read = createRead(manager);
  read("a");
  read("b");
  read("c");

  expect(items).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
});

it("S-X locks are incompatible", async () => {
  const manager = new LockManager();
  const read = createRead(manager);
  const write = createWrite(manager);
  read("a");
  read("b");
  write("c");

  expect(items).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
});

it("X-S locks are incompatible", async () => {
  const manager = new LockManager();
  const read = createRead(manager);
  const write = createWrite(manager);
  write("a");
  read("b");
  read("c");

  expect(items).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
});

it("X-X locks are incompatible", async () => {
  const manager = new LockManager();
  const write = createWrite(manager);
  write("a");
  write("b");
  write("c");

  expect(items).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
});

it("uses fair read-write policy", async () => {
  const manager = new LockManager();
  const read = createRead(manager);
  const write = createWrite(manager);
  read("a");
  write("b");
  read("c");

  expect(items).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
});
