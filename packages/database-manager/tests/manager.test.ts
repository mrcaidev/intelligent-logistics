import type { Database } from "common";
import { DatabaseManagerError, Manager } from "src";
import { describe, expect, it } from "vitest";

class TestManager extends Manager {
  private _database: Database = {};

  constructor() {
    super("Test");
  }

  protected async readDatabase() {
    return this._database;
  }

  protected async writeDatabase(database: Database) {
    this._database = database;
  }

  public get database() {
    return this._database;
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

describe("SELECT", () => {
  it("can select all fields", async () => {
    const result = await createManager().run({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [],
    });
    expect(result).toEqual([
      { id: 1, name: "John", age: 20 },
      { id: 2, name: "Jane", age: 25 },
      { id: 3, name: "Jack", age: 30 },
    ]);
  });

  it("can select specific fields", async () => {
    const result = await createManager().run({
      type: "select",
      table: "users",
      fields: ["id", "name"],
      conditions: [],
    });
    expect(result).toEqual([
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Jack" },
    ]);
  });

  it("can filter rows with single condition", async () => {
    const result = await createManager().run({
      type: "select",
      table: "users",
      fields: ["name"],
      conditions: [[{ field: "id", operator: "!=", value: 1 }]],
    });
    expect(result).toEqual([{ name: "Jane" }, { name: "Jack" }]);
  });

  it("can filter rows with multiple conditions", async () => {
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
    expect(result).toEqual([
      { id: 1, name: "John", age: 20 },
      { id: 2, name: "Jane", age: 25 },
    ]);
  });

  it("throws error when table does not exist", async () => {
    const result = () =>
      createManager().run({
        type: "select",
        table: "posts",
        fields: "*",
        conditions: [],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });

  it("throws error with invalid operator", async () => {
    const result = () =>
      createManager().run({
        type: "select",
        table: "users",
        fields: "*",
        conditions: [[{ field: "id", operator: "@", value: 1 }]],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});

describe("INSERT", () => {
  it("can insert into every field", async () => {
    const manager = createManager();
    const result = await manager.run({
      type: "insert",
      table: "users",
      fields: "*",
      values: [4, "July", 35],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows.length).toEqual(4);
  });

  it("can insert into specific fields", async () => {
    const manager = createManager();
    const result = await manager.run({
      type: "insert",
      table: "users",
      fields: ["id", "name", "age"],
      values: [4, "July", 35],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows.length).toEqual(4);
  });

  it("throws error when table does not exist", async () => {
    const result = () =>
      createManager().run({
        type: "insert",
        table: "posts",
        fields: "*",
        values: [4, "July", 35],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});

describe("UPDATE", () => {
  it("can update rows", async () => {
    const manager = createManager();
    const result = await manager.run({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 35 }],
      conditions: [[{ field: "id", operator: "=", value: 2 }]],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows[1]?.age).toEqual(35);
  });

  it("can filter rows to update", async () => {
    const manager = createManager();
    const result = await manager.run({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 40 }],
      conditions: [[{ field: "id", operator: ">=", value: 2 }]],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows[1]?.age).toEqual(40);
    expect(manager.database.users?.rows[2]?.age).toEqual(40);
  });

  it("throws error when table does not exist", async () => {
    const result = () =>
      createManager().run({
        type: "update",
        table: "posts",
        assignments: [{ field: "age", value: 40 }],
        conditions: [[{ field: "id", operator: ">", value: 1 }]],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});

describe("runs DELETE", () => {
  it("can delete all rows", async () => {
    const manager = createManager();
    const result = await manager.run({
      type: "delete",
      table: "users",
      conditions: [],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows.length).toEqual(0);
  });

  it("can filter rows to delete", async () => {
    const manager = createManager();
    const result = await manager.run({
      type: "delete",
      table: "users",
      conditions: [[{ field: "id", operator: "<=", value: 1 }]],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows.length).toEqual(2);
  });

  it("throws error when table does not exist", async () => {
    const result = () =>
      createManager().run({
        type: "delete",
        table: "posts",
        conditions: [[{ field: "id", operator: ">", value: 1 }]],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});

describe("CREATE", () => {
  it("can create table", async () => {
    const manager = createManager();
    const createResult = await manager.run({
      type: "create",
      table: "posts",
      definitions: [
        { field: "id", type: "NUMERIC" },
        { field: "author", type: "TEXT" },
      ],
    });
    expect(createResult).toEqual([]);
    expect(manager.database.posts).not.toEqual(undefined);
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
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});