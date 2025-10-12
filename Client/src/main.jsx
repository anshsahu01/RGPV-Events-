import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';


// pages import
import LoginPage from './pages/loginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import HostEventPage from './pages/hostEventPage.jsx';
import EventPage from './pages/EventPage.jsx';
import EventRegistrationPage from './pages/EventRegistrationPage.jsx';


const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    children : [
      {
        path : '/',
        element : <Home/>
      },
      {
        path : "/profile/:userId",
        element : <Profile/>
      },
      {
        path : "/login",
        element : <LoginPage/>
      },
      {
        path : "/signup",
        element : <SignupPage/>
      },
      {
        path : '/hostevent',
        element : <HostEventPage/>
      },
      {
        path : '/events/:id',
        element : <EventPage/>
      },
      {
        path : '/registerforevent/:eventId',
        element : <EventRegistrationPage/>
      }
    ]
    
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

  <RouterProvider router={router}/>
  </Provider>
  </StrictMode>,
)
