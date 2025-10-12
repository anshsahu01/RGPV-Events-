import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // 1. Import cookie-parser
import connectDB from './config/Db.js';
import http from 'http';

// Route imports
import userRouter from './routes/user.routes.js';
import eventRouter from './routes/events.routes.js';
import registrationRouter from './routes/registration.routes.js';

const app = express();
const server = http.createServer(app);

await connectDB();

// MIDDLEWARE
app.use(cors({ // 2. Call cors() as a function
   origin:process.env.CLIENT_URL ,  //process.env.CORS_ORIGIN, // Good practice to specify the frontend URLprocess.env.CLIENT_URL
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // 3. Use cookie-parser

// ROUTES
app.get('/', (req, res) => res.send("API is working"));

app.use('/api/user', userRouter);
app.use('/api/events', eventRouter);
// Suggestion: A more standard route name would be '/api/registrations'
app.use('/api/registrations', registrationRouter); 

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
});

export default app;