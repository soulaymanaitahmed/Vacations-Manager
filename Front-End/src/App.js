import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  useNavigate,
  useLocation,
  useMatch,
  Routes,
  Route,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { MdOutlineSettings } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserDoctor } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { FaUsersGear } from "react-icons/fa6";

import logo from "./Images/bg1.png";
import "./Style/app.css";

const Users = lazy(() => import("./Pages/Users"));
const Grades = lazy(() => import("./Pages/Grades"));
const Employees = lazy(() => import("./Pages/Employees"));
const SingleEmployee = lazy(() => import("./Pages/SingleEmployee"));
const Fsanitaire = lazy(() => import("./Pages/Fsanitaire"));
const Vacations = lazy(() => import("./Pages/Vacations"));

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const matchPersonnel = useMatch("/personnels/:id");

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
    navigate("/login");
  };

  useEffect(() => {
    if (!loading && !userInfo) {
      navigate("/login");
    }
  }, [loading, userInfo, navigate]);

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "selected" : null;
  };

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
              onClick={() => navigate("/dashboard")}
              className="links1"
              id={isActive("/dashboard")}
            >
              <MdSpaceDashboard className="nav_icon" />
              <p className="nav-link">Dashboard</p>
            </div>
            <div
              onClick={() => navigate("/personnels")}
              className="links1"
              id={isActive("/personnels")}
            >
              <FaUserDoctor className="nav_icon" />
              <p className="nav-link">Personnels</p>
            </div>
            <div
              onClick={() => navigate("/vacances")}
              className="links1"
              id={isActive("/vacances")}
            >
              <FaRegCalendarAlt className="nav_icon" />
              <p className="nav-link">Vacances</p>
            </div>
            <div
              onClick={() => navigate("/utilisateurs")}
              className="links1"
              id={isActive("/utilisateurs")}
            >
              <FaUsersGear className="nav_icon" />
              <p className="nav-link">Utilisateurs</p>
            </div>
            <div
              onClick={() => navigate("/grades")}
              className="links1"
              id={isActive("/grades")}
            >
              <FaGraduationCap className="nav_icon" />
              <p className="nav-link">Grades</p>
            </div>
            <div
              onClick={() => navigate("/formation-sanitaire")}
              className="links1"
              id={isActive("/formation-sanitaire")}
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
                  onClick={() => navigate("/parametres")}
                  className="links1"
                  id={isActive("/parametres")}
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
            <Routes>
              <Route path="/dashboard" element={<div>Dashboard</div>} />
              <Route path="/personnels" element={<Employees />} />
              <Route path="/personnels/:id" element={<SingleEmployee />} />
              <Route path="/utilisateurs" element={<Users />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/formation-sanitaire" element={<Fsanitaire />} />
              <Route path="/vacances" element={<Vacations />} />
              <Route path="/parametres" element={<div>Paramètres</div>} />
            </Routes>
          </Suspense>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
