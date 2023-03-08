import { Cursor } from "src/cursor";
import { expect, it } from "vitest";

it("starts at first item", () => {
  const cursor = new Cursor(["a", "b", "c"]);
  expect(cursor.position()).toEqual(0);
  expect(cursor.current()).toEqual("a");
});

it("can move around", () => {
  const cursor = new Cursor(["a", "b", "c"]);
  expect(cursor.position()).toEqual(0);
  expect(cursor.current()).toEqual("a");

  cursor.forward();
  expect(cursor.position()).toEqual(1);
  expect(cursor.current()).toEqual("b");

  cursor.backward();
  expect(cursor.position()).toEqual(0);
  expect(cursor.current()).toEqual("a");
});

it("manages open/closed state correctly", () => {
  const cursor = new Cursor(["a"]);
  expect(cursor.position()).toEqual(0);
  expect(cursor.isOpen()).toEqual(true);

  cursor.forward();
  expect(cursor.position()).toEqual(1);
  expect(cursor.isOpen()).toEqual(false);
});

it("can close", () => {
  const cursor = new Cursor(["a", "b", "c"]);
  expect(cursor.position()).toEqual(0);
  expect(cursor.isOpen()).toEqual(true);

  cursor.close();
  expect(cursor.position()).toEqual(3);
  expect(cursor.isOpen()).toEqual(false);
});
