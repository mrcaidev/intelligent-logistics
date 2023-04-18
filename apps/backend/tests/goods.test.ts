import { app } from "src/app";
import { query } from "src/utils/database";
import supertest from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const request = supertest(app);

beforeEach(async () => {
  await query(`
    INSERT INTO goods VALUES (
      '1111111111',
      'Pork',
      '2023-03-24T05:40:17.416Z',
      'Shanghai',
      'New York',
      FALSE,
      '1111111111'
    )
  `);
  await query(`
    INSERT INTO goods VALUES (
      '2222222222',
      'Cup',
      '2023-03-25T03:53:29.733Z',
      'Chengdu',
      'Sydney',
      TRUE,
      '2222222222'
    )
  `);
  await query(`
    INSERT INTO goods VALUES (
      '3333333333',
      'Pen',
      '2023-03-26T16:27:14.946Z',
      'Paris',
      'Suzhou',
      FALSE,
      '3333333333'
    )
  `);
});

afterEach(async () => {
  await query("DELETE FROM goods");
});

describe("GET /goods", () => {
  it("finds all goods", async () => {
    const res = await request.get("/goods");
    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual([
      {
        id: "1111111111",
        name: "Pork",
        createdAt: "2023-03-24T05:40:17.416Z",
        source: "Shanghai",
        target: "New York",
        isVip: false,
        graphId: "1111111111",
      },
      {
        id: "2222222222",
        name: "Cup",
        createdAt: "2023-03-25T03:53:29.733Z",
        source: "Chengdu",
        target: "Sydney",
        isVip: true,
        graphId: "2222222222",
      },
      {
        id: "3333333333",
        name: "Pen",
        createdAt: "2023-03-26T16:27:14.946Z",
        source: "Paris",
        target: "Suzhou",
        isVip: false,
        graphId: "3333333333",
      },
    ]);
  });
});

describe("POST /goods", () => {
  it.only("creates a new good", async () => {
    const res = await request.post("/goods").send({
      name: "Pencil",
      source: "Shanghai",
      target: "New York",
      isVip: false,
      graphId: "4",
    });
    console.log(res.body.message);
    expect(res.status).toEqual(201);
    expect(res.body.data).toEqual({
      id: expect.any(String),
      name: "Pencil",
      createdAt: expect.any(String),
      source: "Shanghai",
      target: "New York",
      isVip: false,
      graphId: "4",
    });
  });

  it("returns 400 without enough properties", async () => {
    const res = await request.post("/goods").send({
      name: "Pencil",
    });
    expect(res.status).toEqual(400);
    expect(res.body.message).not.toEqual("");
  });
});

describe("PATCH /goods/:id", () => {
  it("updates a good", async () => {
    const res = await request.patch("/goods/1").send({
      name: "Beef",
    });
    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual({
      id: "1",
      name: "Beef",
      createdAt: "2023-03-24T05:40:17.416Z",
      source: "Shanghai",
      target: "New York",
      isVip: false,
      graphId: "1",
    });
  });

  it("returns 404 if the good does not exist", async () => {
    const res = await request.patch("/goods/4").send({
      name: "Pencil",
    });
    expect(res.status).toEqual(404);
    expect(res.body.message).not.toEqual("");
  });
});

describe("DELETE /goods/:id", () => {
  it("deletes a good", async () => {
    const res = await request.delete("/goods/1");
    expect(res.status).toEqual(204);
  });

  it("returns 404 if the good does not exist", async () => {
    const res = await request.delete("/goods/4");
    expect(res.status).toEqual(404);
    expect(res.body.message).not.toEqual("");
  });
});
