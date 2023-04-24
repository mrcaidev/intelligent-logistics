import { app } from "app";
import supertest from "supertest";
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
    await request.delete("/graphs/" + graphId);
  });

  it("creates graph", async () => {
    const response = await request.post("/graphs").send({ name: "g2" });
    expect(response.status).toEqual(201);
    expect(response.body.data).toEqual({
      id: expect.any(String),
      name: "g2",
    });

    graphId = response.body.data.id;
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.post("/graphs").send({ name: 1 });
    expect(response.status).toEqual(400);
  });
});

describe("PATCH /graphs/:id", () => {
  let graphId: string;

  beforeAll(async () => {
    const response = await request.post("/graphs").send({ name: "g3" });
    graphId = response.body.data.id;
  });

  afterAll(async () => {
    await request.delete("/graphs/" + graphId);
  });

  it("updates graph", async () => {
    const response = await request
      .patch("/graphs/" + graphId)
      .send({ name: "g3_" });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .patch("/graphs/" + graphId)
      .send({ name: 1 });
    expect(response.status).toEqual(400);
  });

  it("returns 404 when graph does not exist", async () => {
    const response = await request.patch("/graphs/0").send({ name: "g4" });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /graphs/:id", () => {
  let graphId: string;

  beforeAll(async () => {
    const response = await request.post("/graphs").send({ name: "g4" });
    graphId = response.body.data.id;

    await request.post("/edges").send({
      source: "A",
      target: "B",
      cost: 1,
      graphId,
    });
    await request.post("/goods").send({
      name: "test",
      source: "A",
      target: "B",
      isVip: false,
      graphId,
    });
  });

  it("removes graph", async () => {
    const response = await request.delete("/graphs/" + graphId);
    expect(response.status).toEqual(204);
  });

  it("removes edges and goods in cascade", async () => {
    const edgeResponse = await request.get("/edges").query({ graphId });
    expect(edgeResponse.body.data).toEqual([]);

    const goodResponse = await request.get("/goods").query({ graphId });
    expect(goodResponse.body.data).toEqual([]);
  });

  it("returns 404 when graph does not exist", async () => {
    const response = await request.delete("/graphs/0");
    expect(response.status).toEqual(404);
  });
});
