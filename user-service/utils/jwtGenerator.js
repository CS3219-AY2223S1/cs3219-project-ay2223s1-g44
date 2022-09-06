import "dotenv/config";
import jwt from "jsonwebtoken";

const jwtGenerator = (id) => {
    const payload = {
        user: {
            id: id,
        },
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
};
