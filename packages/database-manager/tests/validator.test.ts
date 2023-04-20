import { DatabaseManagerError } from "error";
import { Validator } from "validator";
import { describe, expect, it } from "vitest";

const schema = [
  { field: "id", type: "NUMERIC" },
  { field: "name", type: "TEXT" },
  { field: "age", type: "NUMERIC" },
];

const validator = new Validator(schema);

describe("field", () => {
  it("permits wildcard fields", () => {
    expect(() => {
      validator.validate({
        type: "select",
        table: "users",
        fields: "*",
        conditions: [],
      });
    }).not.toThrowError(DatabaseManagerError);
  });

  it("permits valid fields", () => {
    expect(() => {
      validator.validate({
        type: "select",
        table: "users",
        fields: ["id", "name"],
        conditions: [],
      });
    }).not.toThrowError(DatabaseManagerError);
  });

  it("throws error when names are invalid", () => {
    expect(() => {
      validator.validate({
        type: "select",
        table: "users",
        fields: ["id", "email"],
        conditions: [],
      });
    }).toThrowError(DatabaseManagerError);
  });
});

describe("condition", () => {
  it("permits valid conditions", () => {
    expect(() => {
      validator.validate({
        type: "delete",
        table: "users",
        conditions: [[{ field: "id", operator: "=", value: 1 }]],
      });
    }).not.toThrowError(DatabaseManagerError);
  });

  it("throws error when fields are invalid", () => {
    expect(() => {
      validator.validate({
        type: "delete",
        table: "users",
        conditions: [[{ field: "unknown", operator: "=", value: 1 }]],
      });
    }).toThrowError(DatabaseManagerError);
  });

  it("throws error when values are invalid", () => {
    expect(() => {
      validator.validate({
        type: "delete",
        table: "users",
        conditions: [[{ field: "id", operator: "=", value: "John" }]],
      });
    }).toThrowError(DatabaseManagerError);
  });
});

describe("ordered values", () => {
  it("permits valid values", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: "*",
        values: [
          [1, "John", 20],
          [2, "Jane", 25],
        ],
      });
    }).not.toThrowError(DatabaseManagerError);
  });

  it("throws error when values have wrong length", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: "*",
        values: [[1]],
      });
    }).toThrowError(DatabaseManagerError);
  });

  it("throws error when values are invalid", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: "*",
        values: [["1", 20, "John"]],
      });
    }).toThrowError(DatabaseManagerError);
  });
});

describe("named values", () => {
  it("permits valid fields and values", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: ["id", "name"],
        values: [[1, "John"]],
      });
    }).not.toThrowError(DatabaseManagerError);
  });

  it("throws error when fields are invalid", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: ["email"],
        values: [["test"]],
      });
    }).toThrowError(DatabaseManagerError);
  });

  it("throws error when values are invalid", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: ["id"],
        values: [["1"]],
      });
    }).toThrowError(DatabaseManagerError);
  });

  it("throws error when fields and values have different length", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: ["id", "name"],
        values: [[1]],
      });
    }).toThrowError(DatabaseManagerError);
  });
});

describe("validates assignments", () => {
  it("permits valid fields and values", () => {
    expect(() => {
      validator.validate({
        type: "update",
        table: "users",
        assignments: [{ field: "id", value: 1 }],
        conditions: [],
      });
    }).not.toThrowError(DatabaseManagerError);
  });

  it("throws error when fields are invalid", () => {
    expect(() => {
      validator.validate({
        type: "update",
        table: "users",
        assignments: [{ field: "email", value: "test" }],
        conditions: [],
      });
    }).toThrowError(DatabaseManagerError);
  });

  it("throws error when values are invalid", () => {
    expect(() => {
      validator.validate({
        type: "update",
        table: "users",
        assignments: [{ field: "name", value: 1 }],
        conditions: [],
      });
    }).toThrowError(DatabaseManagerError);
  });
});

describe("validates definitions", () => {
  it("permits valid definitions", () => {
    expect(() => {
      validator.validate({
        type: "create",
        table: "cars",
        ifNotExists: false,
        definitions: [
          { field: "id", type: "NUMERIC" },
          { field: "name", type: "TEXT" },
        ],
      });
    }).not.toThrowError(DatabaseManagerError);
  });

  it("throws error when fields are duplicated", () => {
    expect(() => {
      validator.validate({
        type: "create",
        table: "cars",
        ifNotExists: false,
        definitions: [
          { field: "id", type: "NUMERIC" },
          { field: "id", type: "TEXT" },
        ],
      });
    }).toThrowError(DatabaseManagerError);
  });
});
