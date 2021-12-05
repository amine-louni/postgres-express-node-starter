import { databaseClose, databasePurge } from "../../src/database/connection";
import { databaseConnection } from "../../src/database/connection";
import supertest from "supertest";
import app from "../../src/app";

describe("AUTH 🗝️", () => {
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
  test("USER REGISTER", async () => {
    await supertest(app)
      .post("/api/v1/users/auth/register")
      .send(userExample)
      .expect(201)
      .then((response) => {
        // Check type and length
        expect(response.body).toEqual({
          status: "success",
          token: expect.any(String),
          data: {
            first_name: userExample.first_name,
            last_name: userExample.last_name,
            user_name: userExample.user_name,
            email: userExample.email,
            dob: userExample.dob,
            phone_number: null,
            bio: null,
            id_verified_at: null,
            uuid: expect.any(String),
            is_active: true,
            profile_picture_url:
              "https://www.gravatar.com/avatar/?s=200&r=pg&d=mp",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        });
      });
  });

  test("USER LOGIN BY EMAIL", async () => {
    await supertest(app)
      .post("/api/v1/users/auth/register")
      .send(userExample)
      .expect(201);

    await supertest(app)
      .post("/api/v1/users/auth/login")
      .send({
        email: userExample.email,
        password: userExample.password,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          status: "success",
          token: expect.any(String),
          data: {
            first_name: userExample.first_name,
            last_name: userExample.last_name,
            user_name: userExample.user_name,
            email: userExample.email,
            dob: userExample.dob,
            phone_number: null,
            bio: null,
            id_verified_at: null,
            uuid: expect.any(String),
            is_active: true,
            profile_picture_url:
              "https://www.gravatar.com/avatar/?s=200&r=pg&d=mp",
          },
        });
      });
  });
});
