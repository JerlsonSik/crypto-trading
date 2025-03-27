import express from 'express'
import loginRouter from './userRouters/loginRouter.js';

const userRouter = express.Router();

userRouter.use('/login', loginRouter)

export default userRouter