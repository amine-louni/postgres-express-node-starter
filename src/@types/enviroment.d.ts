declare global {
    namespace NodeJS {
        interface ProcessEnv {

            NODE_ENV: 'development' | 'production' | 'test';
            PORT: number;
            DB_HOST: string;
            DB_PORT: number;
            DB_NAME: string;
            DB_USERNAME: string;
            DB_PASSWORD: string;
            JWT_SECRET_KEY: string;
            JWT_COOKIE_EXPIRED_IN: number;
            HASH_PASS_SALT: number;
        }
    }
}

export { }