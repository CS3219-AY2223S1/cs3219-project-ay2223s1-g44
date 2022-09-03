import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createMatch, getMatches } from './controller/match-controller.js';

app.get('/', getMatches);

app.post('/match', createMatch);

const httpServer = createServer(app)

httpServer.listen(8001);
