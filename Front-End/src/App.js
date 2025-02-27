import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { PiCalendarCheckFill } from "react-icons/pi";
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
import settings from "./Settings.json";

const Users = lazy(() => import("./Pages/Users"));
const Grades = lazy(() => import("./Pages/Grades"));
const Employees = lazy(() => import("./Pages/Employees"));
const SingleEmployee = lazy(() => import("./Pages/SingleEmployee"));
const Fsanitaire = lazy(() => import("./Pages/Fsanitaire"));
const Vacations = lazy(() => import("./Pages/Vacations"));
const VacationsMini = lazy(() => import("./Pages/VacationsMini"));
const Settings = lazy(() => import("./Pages/Settings"));
const NotAuth = lazy(() => import("./Pages/NotAuth"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Dashboardd = lazy(() => import("./Pages/Dashboardd"));
const VacationsPersonnel = lazy(() => import("./Pages/VacationsPersonnel"));

const ProtectedRoute = ({ children, allowedTypes, userType }) => {
  if (!allowedTypes.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

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
            <h4 className="logo-title">{settings.etablissement}</h4>
          </div>
          <div className="navs">
            {userInfo.type_ac !== 15 && (
              <div
                onClick={() => navigate("/dashboard")}
                className="links1"
                id={isActive("/dashboard")}
              >
                <MdSpaceDashboard className="nav_icon" />
                <p className="nav-link">Les demandes</p>
              </div>
            )}
            {userInfo.type_ac === 15 ? (
              <>
                <div
                  onClick={() => {
                    const gg = userInfo.id * 45657;
                    navigate(`/personnels/${gg}`);
                  }}
                  className="links1"
                  id={isActive("/personnels")}
                >
                  <FaUserDoctor className="nav_icon" />
                  <p className="nav-link">Mes vacances</p>
                </div>
                <div
                  onClick={() => {
                    const gg = userInfo.id * 45657;
                    navigate(`/vacations-personnel/${gg}`);
                  }}
                  className="links1"
                  id={isActive("/vacations-personnel")}
                >
                  <PiCalendarCheckFill className="nav_icon" />
                  <p className="nav-link">Résumer</p>
                </div>
              </>
            ) : (
              <div
                onClick={() => navigate("/personnels")}
                className="links1"
                id={isActive("/personnels")}
              >
                <FaUserDoctor className="nav_icon" />
                <p className="nav-link">Personnels</p>
              </div>
            )}
            <div
              onClick={() => navigate("/vacances")}
              className="links1"
              id={isActive("/vacances")}
            >
              <FaRegCalendarAlt className="nav_icon" />
              <p className="nav-link">Vacances</p>
            </div>
            {userInfo.type_ac === 20 && (
              <>
                <div
                  onClick={() => navigate("/utilisateurs")}
                  className="links1"
                  id={isActive("/utilisateurs")}
                >
                  <FaUsersGear className="nav_icon" />
                  <p className="nav-link">Utilisateurs</p>
                </div>
                <div
                  onClick={() => navigate("/formation-sanitaire")}
                  className="links1"
                  id={isActive("/formation-sanitaire")}
                >
                  <HiMiniBuildingOffice2 className="nav_icon" />
                  <p className="nav-link">Formation Sanitaire</p>
                </div>
                <div
                  onClick={() => navigate("/grades")}
                  className="links1"
                  id={isActive("/grades")}
                >
                  <FaGraduationCap className="nav_icon" />
                  <p className="nav-link">Grades</p>
                </div>
              </>
            )}
          </div>
          {userInfo && (
            <div className="nav-user">
              <div className="nav-user-info">
                <FaCircleUser className="nav-user-img" />
                <div className="kknhftb67">
                  <p className="nav-user-name">{userInfo.username}</p>
                  <p className="nav-user-564">
                    {userInfo.type_ac === 15
                      ? "Personnel"
                      : userInfo.type_ac === 1
                      ? "Bureau d'ordre"
                      : userInfo.type_ac === 2
                      ? "Chef archaique"
                      : userInfo.type_ac === 3
                      ? "Délégué"
                      : userInfo.type_ac === 4
                      ? "RH"
                      : userInfo.type_ac === 20
                      ? "Administrateur"
                      : userInfo.type_ac === 0
                      ? "Invité"
                      : "Inconnu"}
                  </p>
                </div>
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
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    allowedTypes={[20, 0, 1, 2, 3, 4]}
                    userType={userInfo.type_ac}
                  >
                    <Dashboardd type={userInfo.type_ac} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/personnels"
                element={
                  <ProtectedRoute
                    allowedTypes={[20, 0, 1, 2, 3, 4]}
                    userType={userInfo.type_ac}
                  >
                    <Employees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/personnels/:id"
                element={
                  <ProtectedRoute
                    allowedTypes={[15, 20, 0, 1, 2, 3, 4]}
                    userType={userInfo.type_ac}
                  >
                    <SingleEmployee type={userInfo.type_ac} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/utilisateurs"
                element={
                  <ProtectedRoute
                    allowedTypes={[20]}
                    userType={userInfo.type_ac}
                  >
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/grades"
                element={
                  <ProtectedRoute
                    allowedTypes={[20, 4]}
                    userType={userInfo.type_ac}
                  >
                    <Grades />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/formation-sanitaire"
                element={
                  <ProtectedRoute
                    allowedTypes={[20, 4]}
                    userType={userInfo.type_ac}
                  >
                    <Fsanitaire />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vacances"
                element={
                  <ProtectedRoute
                    allowedTypes={[15, 20, 0, 1, 2, 3, 4]}
                    userType={userInfo.type_ac}
                  >
                    {userInfo.type_ac === 15 ? (
                      <VacationsMini />
                    ) : (
                      <Vacations />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vacations-personnel/:id"
                element={
                  <ProtectedRoute
                    allowedTypes={[15, 20, 0, 1, 2, 3, 4]}
                    userType={userInfo.type_ac}
                  >
                    {userInfo.type_ac === 15 ? <VacationsPersonnel /> : null}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parametres"
                element={
                  <ProtectedRoute
                    allowedTypes={[15, 20, 0, 1, 2, 3, 4]}
                    userType={userInfo.type_ac}
                  >
                    <Settings id={userInfo.id} type={userInfo.type_ac} />
                  </ProtectedRoute>
                }
              />
              <Route path="/unauthorized" element={<NotAuth />} />
              <Route
                path="/"
                element={
                  <div className="welco33">
                    <div className="welco-card">
                      <h2 className="wel44">Bonjour {userInfo.username} !</h2>
                      <br />
                      {userInfo.type_ac === 15 ? (
                        <p className="wel55">
                          Ce compte est{" "}
                          <span className="tpact88">Personnel</span>, vous
                          pouvez demander des congés et vérifier vos demandes.
                        </p>
                      ) : (
                        <p className="wel55">
                          Ce compte est destiné aux
                          <span className="tpact88"> administrateurs</span>,
                          vous avez les privilèges de{" "}
                          <span className="tpact88">
                            {userInfo.type_ac === 1
                              ? "Bureau d'ordre"
                              : userInfo.type_ac === 2
                              ? "Chef archaique"
                              : userInfo.type_ac === 3
                              ? "Délégué"
                              : userInfo.type_ac === 4
                              ? "RH"
                              : userInfo.type_ac === 20
                              ? "Administrateur"
                              : userInfo.type_ac === 0
                              ? "Invité"
                              : "Inconnu"}
                          </span>
                          .
                        </p>
                      )}
                    </div>
                  </div>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
