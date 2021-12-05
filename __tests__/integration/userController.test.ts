import { databaseClose, databasePurge } from "./../../src/database/connection";
import { databaseConnection } from "../../src/database/connection";
import supertest from "supertest";
import app from "../../src/app";

describe("user routes", () => {
  const userExample = {
    first_name: "floki",
    last_name: "Vilgeroarson",
    user_name: "floki",
    email: "del.castillo.amn@gmail.com",
    password: "12345678s",
    dob: "1995-10-10",
  };

  beforeAll(async () => {
    await databaseConnection().catch((e) => console.error(e));
  });

  afterAll(async () => {
    await databaseClose().catch((e) => console.error(e));
  });

  beforeEach(async () => {
    await databasePurge().catch((e) => console.error(e));
  });
  // test user register
  test("GET /api/v1/users/auth/register", async () => {
    await supertest(app)
      .post("/api/v1/users/auth/register")
      .send(userExample)
      .expect(201)
      .then((response) => {
        // Check type and length

        expect(response.body.user).toBeTruthy();
        expect(response.body.length).toEqual(1);
      });
  });
});
