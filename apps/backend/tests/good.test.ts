import { app } from "app";
import supertest from "supertest";
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
        source: expect.any(String),
        target: expect.any(String),
        isVip: expect.any(Boolean),
        graphId: expect.any(String),
      });
    }
  });
});

describe("POST /goods", () => {
  let goodId: string;

  afterAll(async () => {
    await request.delete("/goods/" + goodId);
  });

  it("creates good", async () => {
    const response = await request.post("/goods").send({
      name: "Egg",
      source: "C",
      target: "D",
      isVip: false,
      graphId: "g1",
    });
    expect(response.status).toEqual(201);
    expect(response.body.data).toEqual({
      id: expect.any(String),
      name: "Egg",
      createdAt: expect.any(Number),
      source: "C",
      target: "D",
      isVip: false,
      graphId: "g1",
    });

    goodId = response.body.data.id;
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.post("/goods").send({ name: 1 });
    expect(response.status).toEqual(400);
  });
});

describe("PATCH /goods/:id", () => {
  let goodId: string;

  beforeAll(async () => {
    const response = await request.post("/goods").send({
      name: "Egg",
      source: "C",
      target: "D",
      isVip: false,
      graphId: "g1",
    });
    goodId = response.body.data.id;
  });

  afterAll(async () => {
    await request.delete("/goods/" + goodId);
  });

  it("updates good", async () => {
    const response = await request
      .patch("/goods/" + goodId)
      .send({ name: "Beef" });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when the data format is invalid", async () => {
    const response = await request.patch("/goods/" + goodId).send({ name: 1 });
    expect(response.status).toEqual(400);
  });

  it("returns 404 when the good does not exist", async () => {
    const response = await request.patch("/goods/0").send({ name: "Beef" });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /goods/:id", () => {
  let goodId: string;

  beforeAll(async () => {
    const response = await request.post("/goods").send({
      name: "Egg",
      source: "C",
      target: "D",
      isVip: false,
      graphId: "g1",
    });
    goodId = response.body.data.id;
  });

  it("removes good", async () => {
    const response = await request.delete("/goods/" + goodId);
    expect(response.status).toEqual(204);
  });

  it("returns 404 when the good does not exist", async () => {
    const response = await request.delete("/goods/0");
    expect(response.status).toEqual(404);
  });
});

describe("POST /goods/deliver", () => {
  it("delivers goods by priority", async () => {
    const responseA = await request.post("/goods/deliver");
    expect(responseA.status).toEqual(200);
    expect(responseA.body.data).toMatchObject({
      good: { id: "2" },
      nodes: ["B", "A", "C"],
      edges: ["e1", "e2"],
    });

    const responseB = await request.post("/goods/deliver");
    expect(responseB.status).toEqual(200);
    expect(responseB.body.data).toMatchObject({
      good: { id: "1" },
      nodes: ["A", "C", "D"],
      edges: ["e2", "e5"],
    });

    const responseC = await request.post("/goods/deliver");
    expect(responseC.status).toEqual(200);
    expect(responseC.body.data).toMatchObject({
      good: { id: "3" },
      nodes: ["B", "A", "C", "D"],
      edges: ["e1", "e2", "e5"],
    });
  });

  it("returns 422 when there is no good to deliver", async () => {
    const response = await request.post("/goods/deliver");
    expect(response.status).toEqual(422);
  });

  it("returns 422 when there is no path to deliver", async () => {
    const createResponse = await request.post("/goods").send({
      name: "Egg",
      source: "E",
      target: "F",
      isVip: false,
      graphId: "g1",
    });

    const response = await request.post("/goods/deliver");
    expect(response.status).toEqual(422);

    await request.delete("/goods/" + createResponse.body.data.id);
  });
});
