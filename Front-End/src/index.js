import ReactDOM from "react-dom";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./Style/index.css";

import LogIn from "./LogIn";
import App from "./App";

const root = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LogIn />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>,
  root
);
