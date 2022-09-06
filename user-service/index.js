import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createUser, login } from './controller/user-controller.js';

// Controller will contain all the User-defined Routes
const router = express.Router()
router.get('/', (_, res) => res.send('Hello World from user-service'))
router.post('/', createUser)

app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

//routes for login
const loginRouter = express.Router()
loginRouter.get('/', (_, res) => res.send('Hello World from login'))
loginRouter.post('/', login)

app.use('/api/login', loginRouter).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(8000, () => console.log('user-service listening on port 8000'));