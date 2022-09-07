import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import router from './routes/index.js';
import redisClient from './utils/redis-client.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: [
            // Local development: 3000
            /^http:\/\/localhost:3000/,
        ],
    })
); // config cors so that front-end can use
app.use(cookieParser());

// initialise redis
(async () => {
    redisClient.on('error', (err) => {
        console.log(err);
    });
    redisClient.on('connect', () => {
        console.log('Redis successfully connected!');
    });

    await redisClient.connect();
})();

app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json');
});

app.listen(8000, () => console.log('user-service listening on port 8000'));
