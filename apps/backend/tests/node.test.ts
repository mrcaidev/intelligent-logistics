import { app } from "app";
import supertest from "supertest";
import { query } from "utils/database";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const request = supertest(app);

describe("GET /nodes", () => {
  it("finds all nodes", async () => {
    const response = await request.get("/nodes");
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
      });
    }
  });
});

describe("POST /nodes", () => {
  let nodeId: string;

  afterAll(async () => {
    await query(
      `
        DELETE FROM node
        WHERE id = $1
      `,
      [nodeId]
    );
  });

  it("creates node", async () => {
    const response = await request.post("/nodes").send({ name: "test" });
    expect(response.status).toEqual(201);
    expect(response.body.data).toEqual({
      id: expect.any(String),
      name: "test",
    });

    nodeId = response.body.data.id;

    const nodes = await query(
      `
        SELECT *
        FROM node
        WHERE id = $1
      `,
      [nodeId]
    );
    expect(nodes).toHaveLength(1);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.post("/nodes").send({ name: 0 });
    expect(response.status).toEqual(400);
  });
});

describe("PATCH /nodes/:id", () => {
  beforeAll(async () => {
    await query(
      `
        INSERT INTO node VALUES
        ('n5', 'test')
      `
    );
  });

  afterAll(async () => {
    await query(
      `
        DELETE FROM node
        WHERE id = 'n5'
      `
    );
  });

  it("updates node", async () => {
    const response = await request.patch("/nodes/n5").send({ name: "test_" });
    expect(response.status).toEqual(204);

    const nodes = await query(
      `
        SELECT *
        FROM node
        WHERE id = 'n5' AND name = 'test_'
      `
    );
    expect(nodes).toHaveLength(1);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.patch("/nodes/n5").send({ name: 0 });
    expect(response.status).toEqual(400);
  });

  it("returns 404 when node does not exist", async () => {
    const response = await request.patch("/nodes/n0").send({ name: "test_" });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /nodes/:id", () => {
  beforeAll(async () => {
    await query(
      `
        INSERT INTO node VALUES
        ('n6', 'test');
        INSERT INTO edge VALUES
        ('e101', 'n1', 'n6', 1, 'g1'),
        ('e102', 'n6', 'n1', 1, 'g1');
        INSERT INTO good VALUES
        ('101', 'test', 1682153000101, 'n1', 'n6', FALSE, 'g1'),
        ('102', 'test', 1682153000102, 'n6', 'n1', FALSE, 'g1');
      `
    );
  });

  it("removes node", async () => {
    const response = await request.delete("/nodes/n6");
    expect(response.status).toEqual(204);

    const nodes = await query(
      `
        SELECT *
        FROM node
        WHERE id = 'n6'
      `
    );
    expect(nodes).toHaveLength(0);
  });

  it("removes edges and goods in cascade", async () => {
    const edges = await query(
      `
        SELECT *
        FROM edge
        WHERE sourceId = 'n6' OR targetId = 'n6'
      `
    );
    expect(edges).toHaveLength(0);

    const goods = await query(
      `
        SELECT *
        FROM good
        WHERE sourceId = 'n6' OR targetId = 'n6'
      `
    );
    expect(goods).toHaveLength(0);
  });

  it("returns 404 when node does not exist", async () => {
    const response = await request.delete("/nodes/n0");
    expect(response.status).toEqual(404);
  });
});
