import { Cursor } from "src/cursor";
import { expect, it } from "vitest";

it("starts at the first element", () => {
  const cursor = new Cursor(["a", "b", "c"]);
  expect(cursor.current).toEqual("a");
});

it("can consume elements", () => {
  const cursor = new Cursor(["a", "b", "c"]);
  expect(cursor.current).toEqual("a");

  const elementA = cursor.consume();
  expect(elementA).toEqual("a");
  expect(cursor.current).toEqual("b");

  const elementB = cursor.consume();
  expect(elementB).toEqual("b");
  expect(cursor.current).toEqual("c");
});

it("manages state correctly", () => {
  const cursor = new Cursor(["a", "b"]);
  expect(cursor.isOpen()).toEqual(true);

  cursor.consume();
  expect(cursor.isOpen()).toEqual(true);

  cursor.consume();
  expect(cursor.isOpen()).toEqual(false);
});
