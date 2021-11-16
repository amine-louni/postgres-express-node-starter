

import { databaseConnection } from "./database/connection";
import { __prod__ } from './constatns';
import app from './app'


// connect db  🔗
databaseConnection()


// Listening for requests 👂
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    if (!__prod__) console.log(`up & running 🏃 on port:  => ${PORT}`)
})


process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
});

// Listening to unhandled rejections
process.on('unhandledRejection', (err: any) => {
    console.log(err.name, err.message);

    console.log('UNHANDLED REJECTION 💥 shutting down the server ');

    server.close(() => {
        process.exit(1);
    });
});

// Listening to SIGTERM by Heroku
process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED, Shutting down');
    server.close(() => {
        console.log('Process terminated 👌');
    });
});







