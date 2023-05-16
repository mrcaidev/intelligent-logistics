import { app } from "app";
import supertest from "supertest";
import { query } from "utils/database";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const request = supertest(app);

describe("GET /goods", () => {
  it("finds all goods", async () => {
    const response = await request.get("/goods");
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        createdAt: expect.any(Number),
        sourceId: expect.any(String),
        targetId: expect.any(String),
        isVip: expect.any(Boolean),
        graphId: expect.any(String),
      });
    }
  });

  it("finds all goods with specific graph id", async () => {
    const response = await request.get("/goods").query({ graphId: "g1" });
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        createdAt: expect.any(Number),
        sourceId: expect.any(String),
        targetId: expect.any(String),
        isVip: expect.any(Boolean),
        graphId: "g1",
      });
    }
  });
});

describe("POST /goods", () => {
  let goodId: string;

  afterAll(async () => {
    await query(
      `
        DELETE FROM good
        WHERE id = $1
      `,
      [goodId]
    );
  });

  it("creates good", async () => {
    const response = await request.post("/goods").send({
      name: "test",
      sourceId: "n1",
      targetId: "n2",
      isVip: false,
      graphId: "g1",
    });
    expect(response.status).toEqual(201);
    expect(response.body.data).toEqual({
      id: expect.any(String),
      name: "test",
      createdAt: expect.any(Number),
      sourceId: "n1",
      targetId: "n2",
      isVip: false,
      graphId: "g1",
    });

    goodId = response.body.data.id;

    const goods = await query(
      `
        SELECT *
        FROM good
        WHERE id = $1
      `,
      [goodId]
    );
    expect(goods).toHaveLength(1);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.post("/goods").send({
      name: 0,
      sourceId: 0,
      targetId: 0,
      isVip: 0,
      graphId: 0,
    });
    expect(response.status).toEqual(400);
  });

  it("returns 404 when source node does not exist", async () => {
    const response = await request.post("/goods").send({
      name: "test",
      sourceId: "n0",
      targetId: "n2",
      isVip: false,
      graphId: "g1",
    });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when target node does not exist", async () => {
    const response = await request.post("/goods").send({
      name: "test",
      sourceId: "n1",
      targetId: "n0",
      isVip: false,
      graphId: "g1",
    });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when graph does not exist", async () => {
    const response = await request.post("/goods").send({
      name: "test",
      sourceId: "n1",
      targetId: "n2",
      isVip: false,
      graphId: "g0",
    });
    expect(response.status).toEqual(404);
  });
});

describe("PATCH /goods/:id", () => {
  beforeAll(async () => {
    await query(
      `
        INSERT INTO good VALUES
        ('4', 'test', 1682153000004, 'n1', 'n2', FALSE, 'g1')
      `
    );
  });

  afterAll(async () => {
    await query(
      `
        DELETE FROM good
        WHERE id = '4'
      `
    );
  });

  it("updates good", async () => {
    const response = await request.patch("/goods/4").send({ name: "test_" });
    expect(response.status).toEqual(204);

    const goods = await query(
      `
        SELECT *
        FROM good
        WHERE id = '4' AND name = 'test_'
      `
    );
    expect(goods).toHaveLength(1);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.patch("/goods/4").send({ name: 0 });
    expect(response.status).toEqual(400);
  });

  it("returns 404 when good does not exist", async () => {
    const response = await request.patch("/goods/0").send({ name: "test_" });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when source node does not exist", async () => {
    const response = await request.patch("/goods/4").send({ sourceId: "n0" });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when target node does not exist", async () => {
    const response = await request.patch("/goods/4").send({ targetId: "n0" });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when graph does not exist", async () => {
    const response = await request.patch("/goods/4").send({ graphId: "g0" });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /goods/:id", () => {
  beforeAll(async () => {
    await query(
      `
        INSERT INTO good VALUES
        ('5', 'test', 1682153000005, 'n1', 'n2', FALSE, 'g1')
      `
    );
  });

  it("removes good", async () => {
    const response = await request.delete("/goods/5");
    expect(response.status).toEqual(204);

    const goods = await query(
      `
        SELECT *
        FROM good
        WHERE id = '5'
      `
    );
    expect(goods).toHaveLength(0);
  });

  it("returns 404 when good does not exist", async () => {
    const response = await request.delete("/goods/0");
    expect(response.status).toEqual(404);
  });
});

describe("POST /goods/deliver", () => {
  it("delivers goods by priority", async () => {
    const firstResponse = await request.post("/goods/deliver");
    expect(firstResponse.status).toEqual(200);
    expect(firstResponse.body.data).toMatchObject({
      good: { id: "2" },
      path: ["n2", "e1", "n1", "e2", "n3"],
    });

    const secondResponse = await request.post("/goods/deliver");
    expect(secondResponse.status).toEqual(200);
    expect(secondResponse.body.data).toMatchObject({
      good: { id: "1" },
      path: ["n1", "e2", "n3", "e5", "n4"],
    });

    const thirdResponse = await request.post("/goods/deliver");
    expect(thirdResponse.status).toEqual(200);
    expect(thirdResponse.body.data).toMatchObject({
      good: { id: "3" },
      path: ["n2", "e1", "n1", "e2", "n3", "e5", "n4"],
    });

    const emptyResponse = await request.post("/goods/deliver");
    expect(emptyResponse.status).toEqual(422);
  });

  it("returns 422 when nodes do not exist", async () => {
    await query(
      `
        INSERT INTO good VALUES
        ('6', 'test', 1682153000006, 'n100', 'n101', FALSE, 'g1')
      `
    );

    const response = await request.post("/goods/deliver");
    expect(response.status).toEqual(422);

    await query(
      `
        DELETE FROM good
        WHERE id = '6'
      `
    );
  });

  it("returns 422 when path cannot be found", async () => {
    await query(
      `
        INSERT INTO node VALUES
        ('n102', 'test');
        INSERT INTO good VALUES
        ('7', 'test', 1682153000007, 'n1', 'n102', FALSE, 'g1');
      `
    );

    const response = await request.post("/goods/deliver");
    expect(response.status).toEqual(422);

    await query(
      `
        DELETE FROM node
        WHERE id = 'n102';
        DELETE FROM good
        WHERE id = '7';
      `
    );
  });
});
