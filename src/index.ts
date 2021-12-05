/* eslint-disable no-console */
import { databaseConnection } from "./database/connection";
import { __prod__ } from "./constatns";
import app from "./app";
import AppError from "./helpers/AppError";

// connect db  🔗
databaseConnection(process.env.DB_NAME)
  .then(() => console.log("database connected ⛓️"))
  .catch((e) =>
    console.error(new AppError(`Error while connecting to db ${e}`, 500))
  );

// Listening for requests 👂
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  if (!__prod__)
    console.log(`👆 & 🏃 [${process.env.NODE_ENV.toUpperCase()}] 🚪 ${PORT}`);
});

process.once("SIGUSR2", function () {
  process.kill(process.pid, "SIGUSR2");
});

process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, "SIGINT");
});

// Listening to unhandled rejections
process.on("unhandledRejection", (err: { name: string; message: string }) => {
  console.log(err.name, err.message);

  console.log("UNHANDLED REJECTION 💥 shutting down the server ");

  server.close(() => {
    process.exit(1);
  });
});

// Listening to SIGTERM by Heroku
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED, Shutting down");
  server.close(() => {
    console.log("Process terminated 👌");
  });
});
