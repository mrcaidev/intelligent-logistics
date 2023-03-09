import { Cursor } from "src/cursor";
import { expect, it } from "vitest";

it("starts at first item", () => {
  const cursor = new Cursor(["a", "b", "c"]);
  expect(cursor.current).toEqual("a");
});

it("can consume items", () => {
  const cursor = new Cursor(["a", "b", "c"]);
  expect(cursor.current).toEqual("a");

  const result = cursor.consume();
  expect(result).toEqual("a");
  expect(cursor.current).toEqual("b");
});

it("manages open/closed state correctly", () => {
  const cursor = new Cursor(["a"]);
  expect(cursor.isOpen()).toEqual(true);
  expect(cursor.isClosed()).toEqual(false);

  cursor.consume();
  expect(cursor.isOpen()).toEqual(false);
  expect(cursor.isClosed()).toEqual(true);
});
