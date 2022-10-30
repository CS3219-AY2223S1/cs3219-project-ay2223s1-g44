import 'dotenv/config';
import * as redis from 'redis';

// TODO: create new redis database dedicated to matchmaking
const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || ''),
    },
    password: process.env.REDIS_PASSWORD,
});

export default client;
