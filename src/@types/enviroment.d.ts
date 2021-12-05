declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      FRONT_END_URL: string;
      PORT: number;
      DB_HOST: string;
      DB_PORT: number;
      DB_NAME: string;
      DB_NAME_TEST: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;

      JWT_SECRET_KEY: string;
      JWT_COOKIE_EXPIRED_IN: number;
      HASH_PASS_SALT: number;

      MAILGUN_PRIVATE_API_KEY: string;
      MAILGUN_DOMAIN: string;

      MAILTRAP_USERNAME: string;
      MAILTRAP_PASSWORD: string;
      MAILTRAP_HOST: string | undefined;
      MAILTRAP_PORT: number;
    }
  }
}

export {};
