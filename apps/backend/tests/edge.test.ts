import { app } from "app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const request = supertest(app);

describe("GET /edges", () => {
  it("finds all edges", async () => {
    const response = await request.get("/edges");
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        source: expect.any(String),
        target: expect.any(String),
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
        source: expect.any(String),
        target: expect.any(String),
        cost: expect.any(Number),
        graphId: "g1",
      });
    }
  });
});

describe("POST /edges", () => {
  let edgeId: string;

  afterAll(async () => {
    await request.delete("/edges/" + edgeId);
  });

  it("creates edge", async () => {
    const response = await request.post("/edges").send({
      source: "s1",
      target: "t1",
      cost: 1,
      graphId: "g1",
    });
    expect(response.status).toEqual(201);
    expect(response.body.data).toEqual({
      id: expect.any(String),
      source: "s1",
      target: "t1",
      cost: 1,
      graphId: "g1",
    });

    edgeId = response.body.data.id;
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.post("/edges").send({
      source: 1,
      target: 1,
      cost: 1,
      graphId: 1,
    });
    expect(response.status).toEqual(400);
  });
});

describe("PATCH /edges/:id", () => {
  let edgeId: string;

  beforeAll(async () => {
    const response = await request.post("/edges").send({
      source: "s2",
      target: "t2",
      cost: 2,
      graphId: "g1",
    });
    edgeId = response.body.data.id;
  });

  afterAll(async () => {
    await request.delete("/edges/" + edgeId);
  });

  it("updates edge", async () => {
    const response = await request
      .patch("/edges/" + edgeId)
      .send({ source: "s2_", target: "t2_", cost: 2, graphId: "g1" });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .patch("/edges/" + edgeId)
      .send({ source: 1, target: 1, cost: 1, graphId: 1 });
    expect(response.status).toEqual(400);
  });

  it("returns 404 when edge does not exist", async () => {
    const response = await request
      .patch("/edges/0")
      .send({ source: "s2_", target: "t2_", cost: 2, graphId: "g1" });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /edges/:id", () => {
  let edgeId: string;

  beforeAll(async () => {
    const resposne = await request.post("/edges").send({
      source: "s3",
      target: "t3",
      cost: 3,
      graphId: "g1",
    });
    edgeId = resposne.body.data.id;
  });

  it("removes edge", async () => {
    const response = await request.delete("/edges/" + edgeId);
    expect(response.status).toEqual(204);
  });

  it("returns 404 when edge does not exist", async () => {
    const response = await request.delete("/edges/0");
    expect(response.status).toEqual(404);
  });
});
