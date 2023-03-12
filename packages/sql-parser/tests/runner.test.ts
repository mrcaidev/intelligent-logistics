import { Runner, RunnerError, type ORM } from "src/runner";
import { describe, expect, it } from "vitest";

const orm: ORM = {
  getSchema: () => [
    { field: "id", type: "NUMERIC" },
    { field: "name", type: "TEXT" },
    { field: "age", type: "NUMERIC" },
  ],
  select: () => [],
  insert: () => [],
  update: () => [],
  delete: () => [],
  create: () => [],
};

const runner = new Runner(orm);

describe("validates fields", () => {
  it("permits wildcard fields", () => {
    expect(() => {
      runner.run({
        type: "select",
        table: "users",
        fields: "*",
        conditions: [],
      });
    }).not.toThrowError();
  });

  it("permits valid field names", () => {
    expect(() => {
      runner.run({
        type: "select",
        table: "users",
        fields: ["id", "name"],
        conditions: [],
      });
    }).not.toThrowError();
  });

  it("throws error on invalid field names", () => {
    expect(() => {
      runner.run({
        type: "select",
        table: "users",
        fields: ["email"],
        conditions: [],
      });
    }).toThrowError(RunnerError);
  });
});

describe("validates conditions", () => {
  it("permits valid conditions", () => {
    expect(() => {
      runner.run({
        type: "select",
        table: "users",
        fields: "*",
        conditions: [[{ field: "id", operator: "=", value: 1 }]],
      });
    }).not.toThrowError();
  });

  it("throws error on invalid condition fields", () => {
    expect(() => {
      runner.run({
        type: "select",
        table: "users",
        fields: "*",
        conditions: [[{ field: "unknown", operator: "=", value: 1 }]],
      });
    }).toThrowError(RunnerError);
  });

  it("throws error on invalid condition values", () => {
    expect(() => {
      runner.run({
        type: "select",
        table: "users",
        fields: "*",
        conditions: [[{ field: "id", operator: "=", value: "John" }]],
      });
    }).toThrowError(RunnerError);
  });
});

describe("validates values with wildcard fields", () => {
  it("permits valid values", () => {
    expect(() => {
      runner.run({
        type: "insert",
        table: "users",
        fields: "*",
        values: [1, "John", 20],
      });
    }).not.toThrowError();
  });

  it("throws error on wrong number of values", () => {
    expect(() => {
      runner.run({
        type: "insert",
        table: "users",
        fields: "*",
        values: [1],
      });
    }).toThrowError(RunnerError);
  });

  it("throws error on invalid values", () => {
    expect(() => {
      runner.run({
        type: "insert",
        table: "users",
        fields: "*",
        values: ["1", "John", 20],
      });
    }).toThrowError(RunnerError);
  });
});

describe("validates values with field names", () => {
  it("permits valid field names and values", () => {
    expect(() => {
      runner.run({
        type: "insert",
        table: "users",
        fields: ["id", "name"],
        values: [1, "John"],
      });
    });
  });

  it("throws error on invalid field names", () => {
    expect(() => {
      runner.run({
        type: "insert",
        table: "users",
        fields: ["email"],
        values: ["test"],
      });
    }).toThrowError(RunnerError);
  });

  it("throws error on invalid values", () => {
    expect(() => {
      runner.run({
        type: "insert",
        table: "users",
        fields: ["id"],
        values: ["1"],
      });
    }).toThrowError(RunnerError);
  });
});

describe("validates assignments", () => {
  it("permits valid field names and values", () => {
    expect(() => {
      runner.run({
        type: "update",
        table: "users",
        assignments: [{ field: "id", value: 1 }],
        conditions: [],
      });
    }).not.toThrowError();
  });

  it("throws error on invalid field names", () => {
    expect(() => {
      runner.run({
        type: "update",
        table: "users",
        assignments: [{ field: "email", value: "test" }],
        conditions: [],
      });
    }).toThrowError(RunnerError);
  });

  it("throws error on invalid values", () => {
    expect(() => {
      runner.run({
        type: "update",
        table: "users",
        assignments: [{ field: "name", value: 1 }],
        conditions: [],
      });
    }).toThrowError(RunnerError);
  });
});

describe("validates definitions", () => {
  it("permits valid definitions", () => {
    expect(() => {
      runner.run({
        type: "create",
        table: "cars",
        definitions: [
          { field: "id", type: "NUMERIC" },
          { field: "name", type: "TEXT" },
        ],
      });
    }).not.toThrowError();
  });

  it("throws error on duplicate field names", () => {
    expect(() => {
      runner.run({
        type: "create",
        table: "cars",
        definitions: [
          { field: "id", type: "NUMERIC" },
          { field: "id", type: "TEXT" },
        ],
      });
    }).toThrowError(RunnerError);
  });
});
