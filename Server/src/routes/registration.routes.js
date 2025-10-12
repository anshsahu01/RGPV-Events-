import express from 'express'
import { registerForEvent } from '../controllers/event-registration.controller.js'

import auth from '../middleware/auth.middleware.js'


const registrationRouter = express.Router();


registrationRouter.post('/register-event',auth, registerForEvent);


export default registrationRouter;