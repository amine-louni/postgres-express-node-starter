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
            MAILTRAP_API_TOKEN: string;
            MAILTRAP_JWT_TOKEN: string;
            MAILGUN_PRIVATE_API_KEY: string;
            MAILGUN_PUBLIC_VALIDATION_KEY: string;
            MAILGUN_HTTP_KEY: string;

            MAILGUN_HOST_NAME: string;
            MAILGUN_PORT: string;
            MAILGUN_USERNAME: string;
            MAILGUN_DOMAIN: string;

            //@TODO replace it mailtrap config
            EMAIL_HOST: string;
        }
    }
}

export { }