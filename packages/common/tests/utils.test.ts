import { generateRandomId } from "utils";
import { describe, expect, it } from "vitest";

describe("generateRandomId", () => {
  it("is 10 characters long", () => {
    const id = generateRandomId();
    expect(id).toHaveLength(10);
  });

  it("hardly collides", () => {
    const ids = new Set();
    for (let i = 0; i < 1000; i++) {
      ids.add(generateRandomId());
    }
    expect(ids.size).toEqual(1000);
  });
});
