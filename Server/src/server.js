// // import express from 'express';
// // import 'dotenv/config';
// // import cors from 'cors';
// // import cookieParser from 'cookie-parser'; // 1. Import cookie-parser
// // import connectDB from './config/Db.js';
// // import http from 'http';

// // // Route imports
// // import userRouter from './routes/user.routes.js';
// // import eventRouter from './routes/events.routes.js';
// // import registrationRouter from './routes/registration.routes.js';

// // const app = express();
// // const server = http.createServer(app);

// // await connectDB();

// // // MIDDLEWARE
// // app.use(cors({ // 2. Call cors() as a function
// //    origin:process.env.CLIENT_URL ,  //process.env.CORS_ORIGIN, // Good practice to specify the frontend URLprocess.env.CLIENT_URL
// //   credentials: true
// // }));

// // app.use(express.json());
// // app.use(cookieParser()); // 3. Use cookie-parser

// // // ROUTES
// // app.get('/', (req, res) => res.send("API is working"));

// // app.use('/api/user', userRouter);
// // app.use('/api/events', eventRouter);
// // // Suggestion: A more standard route name would be '/api/registrations'
// // app.use('/api/registrations', registrationRouter); 

// // const PORT = process.env.PORT || 5000;

// // server.listen(PORT, () => {
// //     console.log("Server is running on port ", PORT);
// // });

// // export default app;

// import express from 'express';
// import 'dotenv/config';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import connectDB from './config/Db.js';
// import serverless from 'serverless-http'

// // Route imports
// import userRouter from './routes/user.routes.js';
// import eventRouter from './routes/events.routes.js';
// import registrationRouter from './routes/registration.routes.js';

// const app = express();

// // Connect to database
// await connectDB();

// // MIDDLEWARE
// app.use(cors({
//   origin:  '*',  // process.env.CLIENT_URL 
//   credentials: true
// }));

// app.use(express.json());
// app.use(cookieParser());

// // ROUTES
// app.get('/', (req, res) => {
//   res.json({ 
//     message: "API is working",
//     status: "success"
//   });
// });

// app.use('/api/user', userRouter);
// app.use('/api/events', eventRouter);
// app.use('/api/registrations', registrationRouter);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     success: false, 
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ 
//     success: false, 
//     message: 'Route not found' 
//   });
// });

// // Only for local development (not for Vercel)
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log("Server is running on port", PORT);
//   });
// }

// export const handler = serverless(app);

import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/Db.js';

// Route imports
import userRouter from './routes/user.routes.js';
import eventRouter from './routes/events.routes.js';
import registrationRouter from './routes/registration.routes.js';

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: "API is working",
    status: "success",
    timestamp: new Date().toISOString()
  });
});

// ROUTES
app.use('/api/user', userRouter);
app.use('/api/events', eventRouter);
app.use('/api/registrations', registrationRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found'
  });
});

// Export handler for Vercel
export default async function handler(req, res) {
  // Connect to DB only once
  if (!global.isConnected) {
    try {
      await connectDB();
      global.isConnected = true;
    } catch (error) {
      console.error('DB Connection Error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection failed' 
      });
    }
  }
  
  // Handle request
  return app(req, res);
}

// Local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}


