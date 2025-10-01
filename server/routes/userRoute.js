import express from 'express';
import { signupUser,loginUser,adminLogin } from "../controllers/userController.js";

const userRouter= express.Router();

userRouter.post('/signup',signupUser);
userRouter.post('/login',loginUser);
userRouter.post('/admin',adminLogin);

export default userRouter;