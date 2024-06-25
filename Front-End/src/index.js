import ReactDOM from "react-dom";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./Style/index.css";

import LogIn from "./LogIn";
import App from "./App";

const root = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LogIn />} />
    </Routes>
  </BrowserRouter>,
  root
);
