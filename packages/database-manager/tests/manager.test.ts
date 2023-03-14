import type { Database } from "common";
import { Manager } from "src/manager";
import { describe, expect, it } from "vitest";

class TestManager extends Manager {
  private database: Database = {};

  constructor() {
    super("Test");
  }

  protected async readDatabase() {
    return this.database;
  }

  protected async writeDatabase(database: Database) {
    this.database = database;
  }
}

function createManager() {
  const manager = new TestManager();
  manager.run({
    type: "create",
    table: "users",
    definitions: [
      { field: "id", type: "NUMERIC" },
      { field: "name", type: "TEXT" },
      { field: "age", type: "NUMERIC" },
    ],
  });
  manager.run({
    type: "insert",
    table: "users",
    fields: "*",
    values: [1, "John", 20],
  });
  manager.run({
    type: "insert",
    table: "users",
    fields: "*",
    values: [2, "Jane", 25],
  });
  manager.run({
    type: "insert",
    table: "users",
    fields: "*",
    values: [3, "Jack", 30],
  });
  return manager;
}

describe("runs SELECT", () => {
  it("runs SELECT * FROM users", async () => {
    const result = await createManager().run({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [],
    });
    expect(result).toEqual({
      rows: [
        { id: 1, name: "John", age: 20 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Jack", age: 30 },
      ],
      rowCount: 3,
    });
  });

  it("runs SELECT id, name FROM users", async () => {
    const result = await createManager().run({
      type: "select",
      table: "users",
      fields: ["id", "name"],
      conditions: [],
    });
    expect(result).toEqual({
      rows: [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Jack" },
      ],
      rowCount: 3,
    });
  });

  it("runs SELECT name FROM users WHERE id = 1", async () => {
    const result = await createManager().run({
      type: "select",
      table: "users",
      fields: ["name"],
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
    });
    expect(result).toEqual({
      rows: [{ name: "John" }],
      rowCount: 1,
    });
  });

  it("runs SELECT * FROM users WHERE age > 20 AND age < 30 OR name = 'John'", async () => {
    const result = await createManager().run({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [
        [
          { field: "age", operator: ">", value: 20 },
          { field: "age", operator: "<", value: 30 },
        ],
        [{ field: "name", operator: "=", value: "John" }],
      ],
    });
    expect(result).toEqual({
      rows: [
        { id: 1, name: "John", age: 20 },
        { id: 2, name: "Jane", age: 25 },
      ],
      rowCount: 2,
    });
  });

  it("throws error when table does not exist", async () => {
    const result = () =>
      createManager().run({
        type: "select",
        table: "posts",
        fields: "*",
        conditions: [],
      });
    await expect(result).rejects.toThrowError();
  });
});

describe("runs INSERT", () => {
  it("runs INSERT INTO users VALUES (4, 'July', 35)", async () => {
    const result = await createManager().run({
      type: "insert",
      table: "users",
      fields: "*",
      values: [4, "July", 35],
    });
    expect(result).toEqual({
      rows: [],
      rowCount: 1,
    });
  });

  it("runs INSERT INTO users (id, name, age) VALUES (4, 'July', 35)", async () => {
    const result = await createManager().run({
      type: "insert",
      table: "users",
      fields: ["id", "name", "age"],
      values: [4, "July", 35],
    });
    expect(result).toEqual({
      rows: [],
      rowCount: 1,
    });
  });

  it("throws error when table does not exist", async () => {
    const result = () =>
      createManager().run({
        type: "insert",
        table: "posts",
        fields: "*",
        values: [4, "July", 35],
      });
    await expect(result).rejects.toThrowError();
  });
});

describe("runs UPDATE", () => {
  it("runs UPDATE users SET name = 'July', age = 35 WHERE id = 2", async () => {
    const result = await createManager().run({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 35 }],
      conditions: [[{ field: "id", operator: "=", value: 2 }]],
    });
    expect(result).toEqual({
      rows: [],
      rowCount: 1,
    });
  });

  it("runs UPDATE users SET age = 40 WHERE id > 1", async () => {
    const result = await createManager().run({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 40 }],
      conditions: [[{ field: "id", operator: ">", value: 1 }]],
    });
    expect(result).toEqual({
      rows: [],
      rowCount: 2,
    });
  });

  it("throws error when table does not exist", async () => {
    const result = () =>
      createManager().run({
        type: "update",
        table: "posts",
        assignments: [{ field: "age", value: 40 }],
        conditions: [[{ field: "id", operator: ">", value: 1 }]],
      });
    await expect(result).rejects.toThrowError();
  });
});

describe("runs DELETE", () => {
  it("runs DELETE FROM users WHERE id = 2", async () => {
    const result = await createManager().run({
      type: "delete",
      table: "users",
      conditions: [[{ field: "id", operator: "=", value: 2 }]],
    });
    expect(result).toEqual({
      rows: [],
      rowCount: 1,
    });
  });

  it("runs DELETE FROM users WHERE id > 1", async () => {
    const result = await createManager().run({
      type: "delete",
      table: "users",
      conditions: [[{ field: "id", operator: ">", value: 1 }]],
    });
    expect(result).toEqual({
      rows: [],
      rowCount: 2,
    });
  });

  it("throws error when table does not exist", async () => {
    const result = () =>
      createManager().run({
        type: "delete",
        table: "posts",
        conditions: [[{ field: "id", operator: ">", value: 1 }]],
      });
    await expect(result).rejects.toThrowError();
  });
});

describe("runs CREATE", () => {
  it("runs CREATE TABLE posts (id NUMERIC, author TEXT)", async () => {
    const manager = createManager();
    const createResult = await manager.run({
      type: "create",
      table: "posts",
      definitions: [
        { field: "id", type: "NUMERIC" },
        { field: "author", type: "TEXT" },
      ],
    });
    expect(createResult).toEqual({
      rows: [],
      rowCount: 0,
    });

    const selectResult = async () =>
      await manager.run({
        type: "select",
        table: "posts",
        fields: "*",
        conditions: [],
      });
    expect(selectResult).not.toThrowError();
  });

  it("throws error when table already exists", async () => {
    const result = () =>
      createManager().run({
        type: "create",
        table: "users",
        definitions: [
          { field: "id", type: "NUMERIC" },
          { field: "name", type: "TEXT" },
          { field: "age", type: "NUMERIC" },
        ],
      });
    await expect(result).rejects.toThrowError();
  });
});
