import React, { useState, useEffect } from "react";
import { SlSettings } from "react-icons/sl";
import { BsPersonCircle } from "react-icons/bs";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";

import Cookies from "js-cookie";
import axios from "axios";

import "./Style/login.css";
import logo1 from "./Images/deleg-logo.png";

const LoginPage = () => {
  const getBaseURL = () => {
    if (process.env.NODE_ENV === "development") {
      const { protocol, hostname } = window.location;
      const port = 7766;
      return `${protocol}//${hostname}:${port}`;
    } else {
      return "https://your-backend-url.com";
    }
  };
  const baseURL = getBaseURL();

  const [choi, setChoi] = useState(0);
  const [pass, setPass] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [alr, setAlr] = useState(false);

  useEffect(() => {
    setUsername("");
    setPassword("");
    setRememberMe(false);
    setAlr(false);
  }, [choi]);

  useEffect(() => {
    const token = Cookies.get("gestion-des-conges");
    if (token) {
      window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/users/login`, {
        choi,
        username,
        password,
        rememberMe,
      });
      if (response.status === 200) {
        const token = response.data["gestion-des-conges"];
        const cookieOptions = rememberMe ? { expires: 30 } : { expires: 1 };
        Cookies.set("gestion-des-conges", token, cookieOptions);
        window.location.href = "/";
      } else {
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setAlr(true);
    }
  };

  return (
    <div className="login-container">
      <div className="section77">
        <div className="logo77">
          <img className="logoimg77" alt="Logo IMG" src={logo1} width="80px" />
          <span className="bbrjdndt77">Délégation de santé ouarzazate</span>
        </div>
        {choi === 0 ? (
          <div className="choi77">
            <div
              className="sec11"
              onClick={() => {
                setChoi(1);
              }}
            >
              <SlSettings className="llkoi77" id="kknurf77" />
              <span className="kkopki77" id="kknurf77">
                Administration
              </span>
            </div>
            <div
              className="sec11"
              onClick={() => {
                setChoi(2);
              }}
            >
              <BsPersonCircle className="llkoi77" id="kknurf78" />
              <span className="kkopki77" id="kknurf78">
                Personnels
              </span>
            </div>
          </div>
        ) : null}
        {choi !== 0 ? (
          <form className="nnjvserg77" onSubmit={handleSubmit}>
            <h3 className="nndkgdgdi77">
              <span className="back77" onClick={() => setChoi(0)}>
                ◀
              </span>
              {choi === 1
                ? "Espace des administrateurs"
                : choi === 2
                ? "Espace du personnel"
                : null}
            </h3>
            <div className="inputs77">
              <label className="lab77">
                {choi === 1 ? "Username" : choi === 2 ? "PPR" : null}
              </label>
              <input
                className="inp77"
                type="text"
                minLength={4}
                maxLength={16}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="inputs77">
              <label className="lab77">Mot de passe</label>
              <div className="jjhoue77">
                {pass ? (
                  <MdVisibilityOff
                    className="vis88999"
                    onClick={() => setPass(!pass)}
                  />
                ) : (
                  <MdVisibility
                    className="vis88999"
                    onClick={() => setPass(!pass)}
                  />
                )}
                <input
                  className="inp77"
                  type={pass ? "text" : "password"}
                  minLength={4}
                  maxLength={16}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="inputs778">
              <input
                type="checkbox"
                id="rememberMe77"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe77" className="llourbt77">
                Se souvenir de moi (30 Jours)
              </label>
            </div>
            {alr ? (
              <span className="alr">
                {choi === 1 ? "Username" : choi === 2 ? "PPR" : null} ou mot de
                passe incorrect !
              </span>
            ) : null}
            <div className="log77">
              <button className="login77">Login</button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default LoginPage;
