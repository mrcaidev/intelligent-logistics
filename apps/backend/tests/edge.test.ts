import { app } from "app";
import supertest from "supertest";
import { query } from "utils/database";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const request = supertest(app);

describe("GET /edges", () => {
  it("finds all edges", async () => {
    const response = await request.get("/edges");
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        sourceId: expect.any(String),
        targetId: expect.any(String),
        cost: expect.any(Number),
        graphId: expect.any(String),
      });
    }
  });

  it("finds all edges with specified graph id", async () => {
    const response = await request.get("/edges").query({ graphId: "g1" });
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        sourceId: expect.any(String),
        targetId: expect.any(String),
        cost: expect.any(Number),
        graphId: "g1",
      });
    }
  });
});

describe("POST /edges", () => {
  let edgeId: string;

  afterAll(async () => {
    await query(
      `
        DELETE FROM edge
        WHERE id = $1
      `,
      [edgeId]
    );
  });

  it("creates edge", async () => {
    const response = await request.post("/edges").send({
      sourceId: "n1",
      targetId: "n1",
      cost: 1,
      graphId: "g1",
    });
    expect(response.status).toEqual(201);
    expect(response.body.data).toEqual({
      id: expect.any(String),
      sourceId: "n1",
      targetId: "n1",
      cost: 1,
      graphId: "g1",
    });

    edgeId = response.body.data.id;

    const edges = await query(
      `
        SELECT *
        FROM edge
        WHERE id = $1
      `,
      [edgeId]
    );
    expect(edges).toHaveLength(1);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.post("/edges").send({
      sourceId: 0,
      targetId: 0,
      cost: "1",
      graphId: 0,
    });
    expect(response.status).toEqual(400);
  });

  it("returns 404 when source node does not exist", async () => {
    const response = await request.post("/edges").send({
      sourceId: "n0",
      targetId: "n1",
      cost: 1,
      graphId: "g1",
    });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when target node does not exist", async () => {
    const response = await request.post("/edges").send({
      sourceId: "n1",
      targetId: "n0",
      cost: 1,
      graphId: "g1",
    });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when graph does not exist", async () => {
    const response = await request.post("/edges").send({
      sourceId: "n1",
      targetId: "n1",
      cost: 1,
      graphId: "g0",
    });
    expect(response.status).toEqual(404);
  });
});

describe("PATCH /edges/:id", () => {
  beforeAll(async () => {
    await query(
      `
        INSERT INTO edge VALUES
        ('e6', 'n2', 'n2', 1, 'g1')
      `
    );
  });

  afterAll(async () => {
    await query(
      `
        DELETE FROM edge
        WHERE id = 'e6'
      `
    );
  });

  it("updates edge", async () => {
    const response = await request.patch("/edges/e6").send({ cost: 2 });
    expect(response.status).toEqual(204);

    const edges = await query(
      `
        SELECT *
        FROM edge
        WHERE id = 'e6' AND cost = 2
      `
    );
    expect(edges).toHaveLength(1);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.patch("/edges/e6").send({ cost: "2" });
    expect(response.status).toEqual(400);
  });

  it("returns 404 when edge does not exist", async () => {
    const response = await request.patch("/edges/e0").send({ cost: 2 });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when source node does not exist", async () => {
    const response = await request.patch("/edges/e6").send({ sourceId: "n0" });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when target node does not exist", async () => {
    const response = await request.patch("/edges/e6").send({ targetId: "n0" });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when graph does not exist", async () => {
    const response = await request.patch("/edges/e6").send({ graphId: "g0" });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /edges/:id", () => {
  beforeAll(async () => {
    await query(
      `
        INSERT INTO edge VALUES
        ('e7', 'n3', 'n3', 1, 'g1')
      `
    );
  });

  it("removes edge", async () => {
    const response = await request.delete("/edges/e7");
    expect(response.status).toEqual(204);

    const edges = await query(
      `
        SELECT *
        FROM edge
        WHERE id = 'e7'
      `
    );
    expect(edges).toHaveLength(0);
  });

  it("returns 404 when edge does not exist", async () => {
    const response = await request.delete("/edges/e0");
    expect(response.status).toEqual(404);
  });
});
