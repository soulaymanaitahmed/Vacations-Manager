import { useEffect, useState } from "react";
import axios from "axios";

import { MdVisibilityOff } from "react-icons/md";
import { MdVisibility } from "react-icons/md";

import "../Style/settings.css";
import settings from "../Settings.json";

function Settings(props) {
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

  const id = props.id;
  const type = props.type;

  const [deleg, setDeleg] = useState("");
  const [gen, setGen] = useState(1);
  const [etab, setEtab] = useState("");
  const [employee, setEmployee] = useState([]);

  const [pass, setPass] = useState(false);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`${baseURL}/employee/${id}`);
      setEmployee(response.data);
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };
  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/${id}`);
      setEmployee(response.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    if (type === 15) {
      fetchEmployee();
    } else {
      fetchAdmin();
    }
  }, []);

  useEffect(() => {
    setDeleg(settings.delegue);
    setGen(settings.delegue_gender);
    setEtab(settings.etablissement);
  }, [settings]);

  return (
    <div className="settings">
      <div className="header88">
        <span className="nom88">{employee.prenom + " - " + employee.nom}</span>
        <div className="typeacc88">
          <span className="typecomp88">Type de compte</span>
          <span className="tp89" id={type === 15 ? "type88" : "type89"}>
            {type === 15 ? "Personnel" : "Administratif"}
          </span>
        </div>
      </div>
      <div className="info88">
        {type !== 15 ? (
          <div className="line88">
            <div className="line89">
              <span className="typecomp88">Usernam</span>
              <input
                type="text"
                value={employee.username}
                className="input88"
                disabled
              />
            </div>
            <div className="line89">
              <span className="typecomp88">Mot de passe</span>
              <div className="vis88">
                {pass ? (
                  <MdVisibilityOff
                    className="visib88"
                    onClick={() => setPass(!pass)}
                  />
                ) : (
                  <MdVisibility
                    className="visib88"
                    onClick={() => setPass(!pass)}
                  />
                )}
                <input
                  type={pass ? "text" : "password"}
                  value={employee.password}
                  className="input88"
                  id="wi88"
                  disabled
                />
              </div>
            </div>
          </div>
        ) : null}
        <br />
        {type === 20 ? (
          <div id="ghjtn33">
            <div className="line88">
              <div className="line89">
                <span className="typecomp88">Directeur / délégué(e)</span>
                <input type="text" value={deleg} className="input88" disabled />
              </div>
              <div className="line89">
                <span className="typecomp88">Etablissement</span>
                <div className="vis88">
                  <input
                    type="text"
                    value={etab}
                    className="input88"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="line89">
              <span className="typecomp88">Etablissement</span>
              <div className="vis88">
                <input type="text" value={etab} className="input88" disabled />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Settings;
