import { Guard } from "src/guard";
import { afterAll, beforeAll, beforeEach, expect, it, vi } from "vitest";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const items: string[] = [];

function createRead(guard: Guard) {
  return async (item: string) => {
    await guard.waitToRead();

    await sleep(1000);
    items.push(item);

    guard.finishReading();
  };
}

function createWrite(guard: Guard) {
  return async (item: string) => {
    await guard.waitToWrite();

    await sleep(1000);
    items.push(item);

    guard.finishWriting();
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

it("readers read concurrently", async () => {
  const guard = new Guard();
  const read = createRead(guard);
  read("a");
  read("b");
  read("c");

  expect(items).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
});

it("writers write sequentially", async () => {
  const guard = new Guard();
  const write = createWrite(guard);
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

it("writers wait for readers to finish", async () => {
  const guard = new Guard();
  const read = createRead(guard);
  const write = createWrite(guard);
  read("a");
  read("b");
  write("c");

  expect(items).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
});

it("readers wait for writers to finish", async () => {
  const guard = new Guard();
  const read = createRead(guard);
  const write = createWrite(guard);
  write("a");
  read("b");
  read("c");

  expect(items).toEqual([]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a"]);

  await vi.advanceTimersByTimeAsync(1000);
  expect(items).toEqual(["a", "b", "c"]);
});

it("readers and writers are treated equally", async () => {
  const guard = new Guard();
  const read = createRead(guard);
  const write = createWrite(guard);
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
