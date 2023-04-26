import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import GoodbyePage from "./pages/GoodbyePage";
import { initializeApp } from "firebase/app";
import PageWrapper from "./components/PageWrapper";
import HomePage from "./pages/HomePage";
import UserTokenPage from "./pages/UserToken";
import GamePage from "./pages/GamePage";
import Database01Page from "./pages/Database01Page";
import AdminLogIn from "./pages/AdminLogIn";
import GameStart from "./pages/GameStart";
import GamePage2 from "./pages/GamePage2";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/goodbye",
    element: <GoodbyePage />,
  },
  {
    path: "/tokeninput",
    element: <UserTokenPage />,
  },
  {
    path: "/game",
    element: <GamePage />,
  },
  {
    path: "/database",
    element: <Database01Page />,
  },
  {
    path: "/adminlogin",
    element: <AdminLogIn />,
  },
  {
    path: "/gamestart",
    element: <GameStart />,
  },
  {
    path: "/game2",
    element: <GamePage2 />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const firebaseConfig = {
  apiKey: "AIzaSyBQ4RssbdihD64sAUAcrqNwQs7GUo8dGRk",
  authDomain: "group-design-b77ce.firebaseapp.com",
  projectId: "group-design-b77ce",
  storageBucket: "group-design-b77ce.appspot.com",
  messagingSenderId: "721578227879",
  appId: "1:721578227879:web:607cea0b69da14bf098382",
};

initializeApp(firebaseConfig);

root.render(
  <React.StrictMode>
    <PageWrapper>
      <RouterProvider router={router} />
    </PageWrapper>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
