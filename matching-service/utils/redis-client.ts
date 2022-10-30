import 'dotenv/config';
import redis from 'redis';

// TODO: create new redis database dedicated to matchmaking
const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
        port: process.env.REDIS_PORT,
    },
    password: process.env.REDIS_PASSWORD,
});

export default client;
