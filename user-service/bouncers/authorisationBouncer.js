import 'dotenv/config';
import jwt from 'jsonwebtoken';

const authorisationBouncer = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(403).json({ message: 'Not authorised' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, raw) => {
            if (err) {
                return res.status(403).json({ message: 'Not authorised' });
            }

            req.user = raw.user;
            next();
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default authorisationBouncer;
