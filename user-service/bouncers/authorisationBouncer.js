import 'dotenv/config';
import jwt from 'jsonwebtoken';
import redisClient from '../utils/redis-client.js';

const authorisationBouncer = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        // is token provided?
        if (!token) {
            return res.status(401).json({ message: 'Not authorised' });
        }

        // is token in blacklist?
        const inBlacklist = await redisClient.get(`bl_${token}`);
        if (inBlacklist) {
            return res.status(401).json({ message: 'Not authorised' });
        }

        // is token valid?
        jwt.verify(token, process.env.JWT_SECRET, (err, raw) => {
            if (err) {
                return res.status(401).json({ message: 'Not authorised' });
            }
            console.log(raw);

            // attach token information for redis blacklist
            req.user = raw.user;
            req.tokenExp = raw.exp;
            req.token = token;

            next();
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default authorisationBouncer;
