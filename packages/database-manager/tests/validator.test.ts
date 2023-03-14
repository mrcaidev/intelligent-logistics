import { Validator } from "src/validator";
import { describe, expect, it } from "vitest";

const schema = [
  { field: "id", type: "NUMERIC" },
  { field: "name", type: "TEXT" },
  { field: "age", type: "NUMERIC" },
];

const validator = new Validator(schema);

describe("validates fields", () => {
  it("permits wildcard fields", () => {
    expect(() => {
      validator.validate({
        type: "select",
        table: "users",
        fields: "*",
        conditions: [],
      });
    }).not.toThrowError();
  });

  it("permits valid field names", () => {
    expect(() => {
      validator.validate({
        type: "select",
        table: "users",
        fields: ["id", "name"],
        conditions: [],
      });
    }).not.toThrowError();
  });

  it("throws error on invalid field names", () => {
    expect(() => {
      validator.validate({
        type: "select",
        table: "users",
        fields: ["email"],
        conditions: [],
      });
    }).toThrowError();
  });
});

describe("validates conditions", () => {
  it("permits valid conditions", () => {
    expect(() => {
      validator.validate({
        type: "delete",
        table: "users",
        conditions: [[{ field: "id", operator: "=", value: 1 }]],
      });
    }).not.toThrowError();
  });

  it("throws error on invalid condition fields", () => {
    expect(() => {
      validator.validate({
        type: "delete",
        table: "users",
        conditions: [[{ field: "unknown", operator: "=", value: 1 }]],
      });
    }).toThrowError();
  });

  it("throws error on invalid condition values", () => {
    expect(() => {
      validator.validate({
        type: "delete",
        table: "users",
        conditions: [[{ field: "id", operator: "=", value: "John" }]],
      });
    }).toThrowError();
  });
});

describe("validates values with wildcard fields", () => {
  it("permits valid values", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: "*",
        values: [1, "John", 20],
      });
    }).not.toThrowError();
  });

  it("throws error on wrong number of values", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: "*",
        values: [1],
      });
    }).toThrowError();
  });

  it("throws error on invalid values", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: "*",
        values: ["1", "John", 20],
      });
    }).toThrowError();
  });
});

describe("validates values with field names", () => {
  it("permits valid field names and values", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: ["id", "name"],
        values: [1, "John"],
      });
    });
  });

  it("throws error on invalid field names", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: ["email"],
        values: ["test"],
      });
    }).toThrowError();
  });

  it("throws error on invalid values", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: ["id"],
        values: ["1"],
      });
    }).toThrowError();
  });

  it("throws error on inconsistent number of fields and values", () => {
    expect(() => {
      validator.validate({
        type: "insert",
        table: "users",
        fields: ["id", "name"],
        values: [1],
      });
    }).toThrowError();
  });
});

describe("validates assignments", () => {
  it("permits valid field names and values", () => {
    expect(() => {
      validator.validate({
        type: "update",
        table: "users",
        assignments: [{ field: "id", value: 1 }],
        conditions: [],
      });
    }).not.toThrowError();
  });

  it("throws error on invalid field names", () => {
    expect(() => {
      validator.validate({
        type: "update",
        table: "users",
        assignments: [{ field: "email", value: "test" }],
        conditions: [],
      });
    }).toThrowError();
  });

  it("throws error on invalid values", () => {
    expect(() => {
      validator.validate({
        type: "update",
        table: "users",
        assignments: [{ field: "name", value: 1 }],
        conditions: [],
      });
    }).toThrowError();
  });
});

describe("validates definitions", () => {
  it("permits valid definitions", () => {
    expect(() => {
      validator.validate({
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
      validator.validate({
        type: "create",
        table: "cars",
        definitions: [
          { field: "id", type: "NUMERIC" },
          { field: "id", type: "TEXT" },
        ],
      });
    }).toThrowError();
  });
});
