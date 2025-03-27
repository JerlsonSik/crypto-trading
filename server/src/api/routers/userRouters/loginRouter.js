import express from "express"
import { login, testLoginRouter } from "../../../controllers/userControllers/login.js";

const loginRouter = express.Router();

// Get Method
loginRouter.get('/test', testLoginRouter)
loginRouter.post('/login', login)

export default loginRouter