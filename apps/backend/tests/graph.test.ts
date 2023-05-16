import { app } from "app";
import supertest from "supertest";
import { query } from "utils/database";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const request = supertest(app);

describe("GET /graphs", () => {
  it("finds all graphs", async () => {
    const response = await request.get("/graphs");
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
      });
    }
  });
});

describe("POST /graphs", () => {
  let graphId: string;

  afterAll(async () => {
    await query(
      `
        DELETE FROM graph
        WHERE id = $1
      `,
      [graphId]
    );
  });

  it("creates graph", async () => {
    const response = await request.post("/graphs").send({ name: "test" });
    expect(response.status).toEqual(201);
    expect(response.body.data).toEqual({
      id: expect.any(String),
      name: "test",
    });

    graphId = response.body.data.id;

    const graphs = await query(
      `
        SELECT *
        FROM graph
        WHERE id = $1
      `,
      [graphId]
    );
    expect(graphs).toHaveLength(1);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.post("/graphs").send({ name: 0 });
    expect(response.status).toEqual(400);
  });
});

describe("PATCH /graphs/:id", () => {
  beforeAll(async () => {
    await query(
      `
        INSERT INTO graph VALUES
        ('g2', 'test')
      `
    );
  });

  afterAll(async () => {
    await query(
      `
        DELETE FROM graph
        WHERE id = 'g2'
      `
    );
  });

  it("updates graph", async () => {
    const response = await request.patch("/graphs/g2").send({ name: "test_" });
    expect(response.status).toEqual(204);

    const graphs = await query(
      `
        SELECT *
        FROM graph
        WHERE id = 'g2' AND name = 'test_'
      `
    );
    expect(graphs).toHaveLength(1);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.patch("/graphs/g2").send({ name: 0 });
    expect(response.status).toEqual(400);
  });

  it("returns 404 when graph does not exist", async () => {
    const response = await request.patch("/graphs/g0").send({ name: "test_" });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /graphs/:id", () => {
  beforeAll(async () => {
    await query(
      `
        INSERT INTO graph VALUES
        ('g3', 'test');
        INSERT INTO edge VALUES
        ('e100', 'n1', 'n2', 1, 'g3');
        INSERT INTO good VALUES
        ('100', 'test', 1682153000100, 'n1', 'n2', FALSE, 'g3');
      `
    );
  });

  it("removes graph", async () => {
    const response = await request.delete("/graphs/g3");
    expect(response.status).toEqual(204);

    const graphs = await query(
      `
        SELECT *
        FROM graph
        WHERE id = 'g3'
      `
    );
    expect(graphs).toHaveLength(0);
  });

  it("removes edges and goods in cascade", async () => {
    const edges = await query(
      `
        SELECT *
        FROM edge
        WHERE graphId = 'g3'
      `
    );
    expect(edges).toHaveLength(0);

    const goods = await query(
      `
        SELECT *
        FROM good
        WHERE graphId = 'g3'
      `
    );
    expect(goods).toHaveLength(0);
  });

  it("returns 404 when graph does not exist", async () => {
    const response = await request.delete("/graphs/g0");
    expect(response.status).toEqual(404);
  });
});
