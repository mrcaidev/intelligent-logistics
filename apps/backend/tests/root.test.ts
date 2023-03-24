import { app } from "src/app";
import supertest from "supertest";
import { describe, expect, it } from "vitest";

const request = supertest(app);

describe("/healthz", () => {
  it("always returns 200", async () => {
    const res = await request.get("/healthz");
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ message: "", data: null });
  });
});
