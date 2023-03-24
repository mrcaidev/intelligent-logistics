import { parse } from "src";
import { expect, it } from "vitest";

it("parses an input into a list of ASTs", () => {
  const result = parse(`
    -- We only create a small table for simplicity.
    CREATE TABLE IF NOT EXISTS goods (
      id TEXT,
      name TEXT
    );

    INSERT INTO goods (id, name)
    VALUES (1, 'Beef');

    SELECT * -- Check all information about the goods we have.
    FROM goods;

    UPDATE goods
    SET name = 'Pork'
    WHERE id = 1;

    SELECT id, name -- Specify columns as an optimization.
    FROM goods;

    DELETE FROM goods
    WHERE name != 'Pork';
  `);
  expect(result).toEqual([
    {
      type: "create",
      table: "goods",
      ifNotExists: true,
      definitions: [
        { field: "id", type: "TEXT" },
        { field: "name", type: "TEXT" },
      ],
    },
    {
      type: "insert",
      table: "goods",
      fields: ["id", "name"],
      values: [1, "Beef"],
    },
    {
      type: "select",
      fields: "*",
      table: "goods",
      conditions: [],
    },
    {
      type: "update",
      table: "goods",
      assignments: [{ field: "name", value: "Pork" }],
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
    },
    {
      type: "select",
      fields: ["id", "name"],
      table: "goods",
      conditions: [],
    },
    {
      type: "delete",
      table: "goods",
      conditions: [[{ field: "name", operator: "!=", value: "Pork" }]],
    },
  ]);
});
