import { Cursor } from "cursor";
import { expect, it } from "vitest";

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

it("manages open/closed state", () => {
  const cursor = new Cursor(["a", "b"]);
  expect(cursor.isOpen()).toEqual(true);

  cursor.consume();
  expect(cursor.isOpen()).toEqual(true);

  cursor.consume();
  expect(cursor.isOpen()).toEqual(false);
});
