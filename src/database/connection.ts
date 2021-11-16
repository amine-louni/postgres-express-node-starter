import { createConnection } from 'typeorm';

import { config } from 'dotenv'
import { __prod__ } from '../constatns';
import { User } from '../entities/User';


config()

export const databaseConnection = async () => {
    try {
        await createConnection({
            type: "postgres",
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            synchronize: !__prod__,
            logger: __prod__ ? undefined : 'simple-console',
            entities: [User],
        })
        if (!__prod__) console.log('Database connected 🔗');
    } catch (e) {
        if (!__prod__) console.log('Can\'t connect to postgres db 😥');
        console.error(e)
    }
}