import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import connectDB from './config/Db.js';
import http from 'http';


import userRouter from './routes/user.routes.js';
import eventRouter from './routes/events.routes.js';
import registrationRouter from './routes/registration.routes.js';

const app = express();
const server = http.createServer(app);

await connectDB();

// MIDDLEWARE
app.use(cors({
   origin:"*" ,  
  methods : ["GET","POST"]
}));

app.use(express.json());
app.use(cookieParser()); 

// ROUTES
app.get('/', (req, res) => res.send("API is working"));

app.use('/api/user', userRouter);
app.use('/api/events', eventRouter);

app.use('/api/registrations', registrationRouter); 

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
});

export default app;

