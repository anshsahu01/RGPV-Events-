import express from 'express'
import { createEvent, updateEvent, deleteEvent, getAllEvents, getEventsByCategory, getEventById } from '../controllers/events.controller.js'
import auth from '../middleware/auth.middleware.js'
import upload from '../middleware/multer.js';



const eventRouter = express.Router();


eventRouter.post('/create-event',upload.single('bannerImage'),auth, createEvent);
eventRouter.patch('/update-event/:eventId',auth, updateEvent);
eventRouter.delete('/delete-event/:eventId',auth,deleteEvent);
eventRouter.get("/event/:id", getEventById);
eventRouter.get('/all-events',getAllEvents);
eventRouter.get('/event-category/:category',getEventsByCategory);

export default eventRouter;