import React, { useEffect, useState, lazy, Suspense } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { HiOutlineLogout } from "react-icons/hi";
import { MdOutlineSettings } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa6";

import logo from "./Images/bg1.png";
import "./Style/app.css";

const Users = lazy(() => import("./Pages/Users"));
const Grades = lazy(() => import("./Pages/Grades"));
const Employees = lazy(() => import("./Pages/Employees"));
const Fsanitaire = lazy(() => import("./Pages/Fsanitaire"));

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(2);

  useEffect(() => {
    const token = Cookies.get("gestion-des-conges");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo(decodedToken);
      } catch (error) {
        console.error("Invalid token");
      }
    }
    setLoading(false);
  }, []);

  const Logout = () => {
    Cookies.remove("gestion-des-conges");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!loading && !userInfo) {
      window.location.href = "/login";
    }
  }, [loading, userInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userInfo) {
    return (
      <div className="App">
        <div className="navigation">
          <div className="logos">
            <img src={logo} alt="App-logo" width="60px" className="img-logo" />
            <h4 className="logo-title">Délégation</h4>
          </div>
          <div className="navs">
            <div
              onClick={() => {
                setView(1);
              }}
              className="links1"
              id={view === 1 ? "selected" : null}
            >
              <MdSpaceDashboard className="nav_icon" />
              <p className="nav-link">Dashboard</p>
            </div>
            <div
              onClick={() => {
                setView(2);
              }}
              className="links1"
              id={view === 2 ? "selected" : null}
            >
              <FaUserDoctor className="nav_icon" />
              <p className="nav-link">Employees</p>
            </div>
            <div
              onClick={() => {
                setView(3);
              }}
              className="links1"
              id={view === 3 ? "selected" : null}
            >
              <FaUsersGear className="nav_icon" />
              <p className="nav-link">Utilisateurs</p>
            </div>
            <div
              onClick={() => {
                setView(4);
              }}
              className="links1"
              id={view === 4 ? "selected" : null}
            >
              <FaGraduationCap className="nav_icon" />
              <p className="nav-link">Grades</p>
            </div>
            <div
              onClick={() => {
                setView(5);
              }}
              className="links1"
              id={view === 5 ? "selected" : null}
            >
              <HiMiniBuildingOffice2 className="nav_icon" />
              <p className="nav-link">Formation Sanitaire</p>
            </div>
          </div>
          {userInfo && (
            <div className="nav-user">
              <div className="nav-user-info">
                <FaCircleUser className="nav-user-img" />
                <p className="nav-user-name">{userInfo.username}</p>
              </div>
              <div className="nav-user-actions">
                <div className="links1" id="selected2" onClick={Logout}>
                  <HiOutlineLogout className="nav_icon" />
                  <p className="nav-link">Se déconnecter</p>
                </div>
                <div
                  onClick={() => {
                    setView(10);
                  }}
                  className="links1"
                  id={view === 10 ? "selected" : null}
                >
                  <MdOutlineSettings className="nav_icon" />
                  <p className="nav-link">Paramètres</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="main-container">
          <Suspense fallback={<div>Loading...</div>}>
            {view === 2 && <Employees />}
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            {view === 3 && <Users />}
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            {view === 4 && <Grades />}
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            {view === 5 && <Fsanitaire />}
          </Suspense>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
