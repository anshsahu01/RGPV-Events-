import express from 'express'
import { registerUser, loginUser, logoutUser, getHostedEvents, getUserById, getRegisteredEventsByUser } from '../controllers/user.controller.js'

import auth from '../middleware/auth.middleware.js'




const userRouter = express.Router();



userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.get("/:id", auth, getUserById);

userRouter.get('/usershostedevents/:userId',auth,getHostedEvents);
userRouter.get("/registered-events/:userId", auth, getRegisteredEventsByUser);
userRouter.post('/logout', auth, logoutUser);


export default userRouter;