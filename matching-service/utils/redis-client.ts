import 'dotenv/config';
import redis from 'redis';

// TODO: create new redis database dedicated to matchmaking
const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    password: process.env.REDIS_PASSWORD,
});

export default client;
