import 'dotenv/config';
import jwt from 'jsonwebtoken';

const jwtGenerator = ({ id, username }) => {
    const payload = {
        user: {
            id,
            username,
        },
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' });
};

export default jwtGenerator;
