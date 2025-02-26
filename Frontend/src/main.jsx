import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from './pages/ErrorPage.jsx'
import MainPage from './pages/MainPage.jsx'
import EmoPage from './pages/EmoPage.jsx';
import ResultPage from './pages/ResultPage.jsx';

const router = createBrowserRouter([
  {
    path: "/", 
    element: <MainPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/emotions",
    element: <EmoPage />
  },
  {
    path: "/result",
    element: <ResultPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
