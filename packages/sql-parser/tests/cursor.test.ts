import { Cursor } from "src/cursor";
import { expect, it } from "vitest";

it("starts at first item", () => {
  const cursor = new Cursor(["a", "b", "c"]);
  expect(cursor.current).toEqual("a");
});

it("can consume items", () => {
  const cursor = new Cursor(["a", "b", "c"]);
  expect(cursor.current).toEqual("a");

  const itemA = cursor.consume();
  expect(itemA).toEqual("a");
  expect(cursor.current).toEqual("b");

  const itemB = cursor.consume();
  expect(itemB).toEqual("b");
  expect(cursor.current).toEqual("c");
});

it("manages open/closed state correctly", () => {
  const cursor = new Cursor(["a", "b"]);
  expect(cursor.isOpen()).toEqual(true);
  expect(cursor.isClosed()).toEqual(false);

  cursor.consume();
  expect(cursor.isOpen()).toEqual(true);
  expect(cursor.isClosed()).toEqual(false);

  cursor.consume();
  expect(cursor.isOpen()).toEqual(false);
  expect(cursor.isClosed()).toEqual(true);
});
