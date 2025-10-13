# 🧩 RGPV Events Platform

[🧩 RGPV Events Platform](https://rgpv-events-296r.vercel.app/)
📖 Overview

RGPV Events is a full-stack web platform that allows students and organizers to host, discover, and register for college events — including hackathons, cultural, and entrepreneurship fests.

It provides a clean and responsive UI with secure authentication, event registration, and user-specific dashboards for hosted and participated events.

🚀 Features

🧑‍💻 User Authentication (JWT-based) — Login & Register with access/refresh tokens

🏁 Host Events — Organizers can create and manage their events

🎟️ Register for Events — Students can register with personal and college details

👤 User Profile Page — View hosted & registered events along with personal info

🌓 Responsive UI — Works smoothly on all screen sizes

⚡ Protected Routes — Only logged-in users can register or host events

🛠️ Tech Stack
Frontend

⚛️ React.js (Vite)

🧭 React Router DOM

🧱 Tailwind CSS

🌐 Axios for API calls

🔔 React Toastify for notifications

🔄 Redux Toolkit (for tokens & user state)

Backend

🚀 Node.js + Express.js

🧮 MongoDB + Mongoose

🔐 JWT for authentication

🍪 Cookie-Parser & CORS

🌍 Hosted on Vercel

Folder Structure ---------

RGPV-Events/
│
├── Client/               # React Frontend
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── pages/        # Main Pages (Home, Profile, etc.)
│   │   ├── redux/        # Redux setup (auth, events)
│   │   └── main.jsx
│   └── package.json
│
└── Server/               # Express Backend
    ├── config/           # DB connection, middleware
    ├── controllers/      # Route controllers
    ├── models/           # Mongoose Schemas
    ├── routes/           # API Routes
    ├── server.js
    └── package.json


