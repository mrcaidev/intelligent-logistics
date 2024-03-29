import { DatabaseManagerError } from "error";
import { Manager } from "manager";
import { Database } from "shared-types";
import { describe, expect, it } from "vitest";

class TestManager extends Manager {
  private _database: Database = {};

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

async function createManager() {
  const manager = new TestManager();
  await manager.run({
    type: "create",
    table: "users",
    ifNotExists: false,
    definitions: [
      { field: "id", type: "NUMERIC" },
      { field: "name", type: "TEXT" },
      { field: "age", type: "NUMERIC" },
    ],
  });
  await manager.run({
    type: "insert",
    table: "users",
    fields: "*",
    values: [
      [1, "John", 20],
      [2, "Jane", 25],
      [3, "Jack", 30],
    ],
    returning: [],
  });
  return manager;
}

describe("SELECT", () => {
  it("can select wildcard fields", async () => {
    const manager = await createManager();
    const result = await manager.run({
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
    const manager = await createManager();
    const result = await manager.run({
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
    const manager = await createManager();
    const result = await manager.run({
      type: "select",
      table: "users",
      fields: ["name"],
      conditions: [[{ field: "id", operator: "!=", value: 1 }]],
    });
    expect(result).toEqual([{ name: "Jane" }, { name: "Jack" }]);
  });

  it("can filter rows with multiple conditions", async () => {
    const manager = await createManager();
    const result = await manager.run({
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
    const manager = await createManager();
    const result = () =>
      manager.run({
        type: "select",
        table: "posts",
        fields: "*",
        conditions: [],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });

  it("throws error when operators are invalid", async () => {
    const manager = await createManager();
    const result = () =>
      manager.run({
        type: "select",
        table: "users",
        fields: "*",
        conditions: [[{ field: "id", operator: "@", value: 1 }]],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});

describe("INSERT", () => {
  it("can insert into wildcard fields", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[4, "July", 35]],
      returning: [],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows.length).toEqual(4);
  });

  it("can insert into specific fields", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "insert",
      table: "users",
      fields: ["id", "name", "age"],
      values: [[4, "July", 35]],
      returning: [],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows.length).toEqual(4);
  });

  it("can return wildcard fields", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[4, "July", 35]],
      returning: "*",
    });
    expect(result).toEqual([{ id: 4, name: "July", age: 35 }]);
  });

  it("can return specific fields", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[4, "July", 35]],
      returning: ["id"],
    });
    expect(result).toEqual([{ id: 4 }]);
  });

  it("throws error when table does not exist", async () => {
    const manager = await createManager();
    const result = () =>
      manager.run({
        type: "insert",
        table: "posts",
        fields: "*",
        values: [[4, "July", 35]],
        returning: [],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});

describe("UPDATE", () => {
  it("can update rows", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 35 }],
      conditions: [[{ field: "id", operator: "=", value: 2 }]],
      returning: [],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows[1]?.age).toEqual(35);
  });

  it("can filter rows", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 40 }],
      conditions: [[{ field: "id", operator: ">=", value: 2 }]],
      returning: [],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows[1]?.age).toEqual(40);
    expect(manager.database.users?.rows[2]?.age).toEqual(40);
  });

  it("can return wildcard fields", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 35 }],
      conditions: [[{ field: "id", operator: "=", value: 2 }]],
      returning: "*",
    });
    expect(result).toEqual([{ id: 2, name: "Jane", age: 35 }]);
  });

  it("can return specific fields", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 35 }],
      conditions: [[{ field: "id", operator: "=", value: 2 }]],
      returning: ["id"],
    });
    expect(result).toEqual([{ id: 2 }]);
  });

  it("throws error when table does not exist", async () => {
    const manager = await createManager();
    const result = () =>
      manager.run({
        type: "update",
        table: "posts",
        assignments: [{ field: "age", value: 40 }],
        conditions: [[{ field: "id", operator: ">", value: 1 }]],
        returning: [],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});

describe("DELETE", () => {
  it("can delete all rows", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "delete",
      table: "users",
      conditions: [],
      returning: [],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows.length).toEqual(0);
  });

  it("can filter rows", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "delete",
      table: "users",
      conditions: [[{ field: "id", operator: "<=", value: 1 }]],
      returning: [],
    });
    expect(result).toEqual([]);
    expect(manager.database.users?.rows.length).toEqual(2);
  });

  it("can return wildcard fields", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "delete",
      table: "users",
      conditions: [[{ field: "id", operator: "=", value: 3 }]],
      returning: "*",
    });
    expect(result).toEqual([{ id: 3, name: "Jack", age: 30 }]);
  });

  it("can return specific fields", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "delete",
      table: "users",
      conditions: [[{ field: "id", operator: "=", value: 3 }]],
      returning: ["id"],
    });
    expect(result).toEqual([{ id: 3 }]);
  });

  it("throws error when table does not exist", async () => {
    const manager = await createManager();
    const result = () =>
      manager.run({
        type: "delete",
        table: "posts",
        conditions: [[{ field: "id", operator: ">", value: 1 }]],
        returning: [],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});

describe("CREATE", () => {
  it("can create table", async () => {
    const manager = await createManager();
    const createResult = await manager.run({
      type: "create",
      table: "posts",
      ifNotExists: false,
      definitions: [
        { field: "id", type: "NUMERIC" },
        { field: "author", type: "TEXT" },
      ],
    });
    expect(createResult).toEqual([]);
    expect(manager.database.posts).not.toEqual(undefined);
  });

  it("can skip creating", async () => {
    const manager = await createManager();
    const createResult = manager.run({
      type: "create",
      table: "users",
      ifNotExists: true,
      definitions: [
        { field: "id", type: "NUMERIC" },
        { field: "name", type: "TEXT" },
        { field: "age", type: "NUMERIC" },
      ],
    });
    expect(createResult).resolves.toEqual([]);
    expect(manager.database.users).not.toEqual(undefined);
  });

  it("throws error when table already exists", async () => {
    const manager = await createManager();
    const result = () =>
      manager.run({
        type: "create",
        table: "users",
        ifNotExists: false,
        definitions: [
          { field: "id", type: "NUMERIC" },
          { field: "name", type: "TEXT" },
          { field: "age", type: "NUMERIC" },
        ],
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});

describe("DROP", () => {
  it("can drop table", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "drop",
      table: "users",
      ifExists: false,
    });
    expect(result).toEqual([]);
    expect(manager.database.users).toEqual(undefined);
  });

  it("can skip dropping", async () => {
    const manager = await createManager();
    const result = await manager.run({
      type: "drop",
      table: "posts",
      ifExists: true,
    });
    expect(result).toEqual([]);
    expect(manager.database.posts).toEqual(undefined);
  });

  it("throws error when table does not exist", async () => {
    const manager = await createManager();
    const result = () =>
      manager.run({
        type: "drop",
        table: "posts",
        ifExists: false,
      });
    await expect(result).rejects.toThrowError(DatabaseManagerError);
  });
});
