import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import router from './routes/index.js';

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

app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json');
});

app.listen(8000, () => console.log('user-service listening on port 8000'));
