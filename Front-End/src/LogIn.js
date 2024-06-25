import React, { useState, useEffect } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiOutlineLogin } from "react-icons/ai";
import { PiUserBold } from "react-icons/pi";
import { MdEmail } from "react-icons/md";

import Cookies from "js-cookie";
import axios from "axios";

import "./Style/login.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [alr, setAlr] = useState(false);

  useEffect(() => {
    const token = Cookies.get("gestion-des-conges");
    if (token) {
      window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7766/users/login", {
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
      <form onSubmit={handleSubmit} className="login-form">
        <div className="log1">
          <h4 className="login-title">Delegation</h4>
          <p className="login-infos">
            Lorem when an unknown printer took a galley of type and scrambled it
            to make a type specimen book. It has survived not only five
            centuries.
          </p>
        </div>
        <div className="log2">
          <PiUserBold className="login-user-img" />
          {alr ? (
            <span className="alr">
              Nom d'utilisateur ou mot de passe incorrect
            </span>
          ) : null}
          <div className="rememberMe1">
            <MdEmail className="login-icon" />
            <input
              type="text"
              id="username"
              className="login-input"
              minLength={4}
              maxLength={16}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Utilisateur"
              required
            />
          </div>
          <div className="rememberMe1">
            <RiLockPasswordFill className="login-icon" />
            <input
              type="password"
              id="password"
              className="login-input"
              minLength={4}
              maxLength={16}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
          </div>
          <div className="rememberMe2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Se souvenir de moi (30 Jours)</label>
          </div>
          <button className="login-btn" type="submit">
            Login <AiOutlineLogin />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
