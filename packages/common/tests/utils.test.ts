import { generateRandomId } from "src";
import { describe, expect, it } from "vitest";

describe("generateRandomId", () => {
  it("has a length of 10", () => {
    const id = generateRandomId();
    expect(id.length).toEqual(10);
  });

  it("hardly collides", () => {
    const ids = new Set();
    for (let i = 0; i < 1000; i++) {
      ids.add(generateRandomId());
    }
    expect(ids.size).toEqual(1000);
  });
});
