import { parse } from "api";
import { expect, it } from "vitest";

it("parses an input into a list of ASTs", () => {
  const result = parse(`
    -- We create a simplified table for testing purpose.
    CREATE TABLE IF NOT EXISTS goods (
      id TEXT,
      name TEXT
    );

    INSERT INTO goods VALUES
    (1, 'Beef'),
    (2, 'Pork');

    SELECT * -- Check all information about the goods we have.
    FROM goods;

    INSERT INTO goods (id, name) VALUES
    (3, 'Chicken');

    UPDATE goods
    SET name = 'Milk'
    WHERE id = 1 AND name != 'Milk';

    SELECT id, name -- Specify some columns.
    FROM goods;

    DELETE FROM goods
    WHERE id > 3;

    DROP TABLE IF EXISTS goods;
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
      fields: "*",
      values: [
        [1, "Beef"],
        [2, "Pork"],
      ],
    },
    {
      type: "select",
      fields: "*",
      table: "goods",
      conditions: [],
    },
    {
      type: "insert",
      table: "goods",
      fields: ["id", "name"],
      values: [[3, "Chicken"]],
    },
    {
      type: "update",
      table: "goods",
      assignments: [{ field: "name", value: "Milk" }],
      conditions: [
        [
          { field: "id", operator: "=", value: 1 },
          { field: "name", operator: "!=", value: "Milk" },
        ],
      ],
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
      conditions: [[{ field: "id", operator: ">", value: 3 }]],
    },
    {
      type: "drop",
      table: "goods",
      ifExists: true,
    },
  ]);
});
