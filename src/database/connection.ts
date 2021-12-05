import { getConnection } from "typeorm";
/* eslint-disable no-console */
import { createConnection } from "typeorm";

import { config } from "dotenv";
import { __prod__ } from "../constatns";
import { User } from "../entities/User";

config();

export const databaseConnection = async (databaseName: string) => {
  await createConnection({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: databaseName,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: !__prod__,
    logger: __prod__ ? undefined : "simple-console",
    entities: [User],
  });
};

export const databaseClose = async () => {
  const conn = getConnection();
  await conn.close();
};

export const databasePurge = async () => {
  // Fetch all the entities
  const entities = getConnection().entityMetadatas;

  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    await repository.clear();
  }
};
