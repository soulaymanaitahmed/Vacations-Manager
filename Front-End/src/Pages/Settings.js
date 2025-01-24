import { useEffect, useState } from "react";
import axios from "axios";

import { BiEdit } from "react-icons/bi";
import { MdVisibilityOff } from "react-icons/md";
import { MdVisibility } from "react-icons/md";

import "../Style/settings.css";

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

  const [editor, setEditor] = useState(false);
  const [editor2, setEditor2] = useState(false);
  const [pass, setPass] = useState(false);

  const [deleg, setDeleg] = useState("");
  const [gen, setGen] = useState(1);
  const [etab, setEtab] = useState("");

  const [employee, setEmployee] = useState([]);

  const [use, setUse] = useState("");
  const [pas, setPas] = useState("");

  const [settings, setSettings] = useState();

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
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${baseURL}/settings`);
      if (response.data.length > 0) {
        setSettings(response.data[0]); // Extract the first row
      } else {
        console.error("No settings found in response");
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };
  const updateSettings = async () => {
    try {
      const response = await axios.put(`${baseURL}/settings`, {
        delegue: deleg,
        delegue_gender: gen,
        etablissement: etab,
      });
      fetchSettings();
      setEditor2(false);
    } catch (err) {
      console.error("Error updating settings:", err);
    }
  };

  useEffect(() => {
    if (type === 15) {
      fetchEmployee();
    } else {
      fetchAdmin();
      fetchSettings();
    }
  }, []);

  useEffect(() => {
    if (settings) {
      setDeleg(settings.delegue);
      setGen(settings.delegue_gender);
      setEtab(settings.etablissement);
    }
  }, [settings, editor2]);

  useEffect(() => {
    if (editor) {
      setUse(employee.username);
      setPas(employee.password);
    }
  }, [editor]);

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
      <div className="main099">
        <h4 className="sub-lb099">
          <span>Compte</span>
          <span className="anct-099">
            {editor ? (
              <>
                <button
                  className="act-o099 kl334"
                  onClick={() => setEditor(false)}
                >
                  Annuler
                </button>
                <button className="act-o099 rd334">Confirmer</button>
              </>
            ) : (
              <button
                className="act-o099 ed334"
                onClick={() => setEditor(true)}
              >
                <BiEdit /> Edit
              </button>
            )}
          </span>
        </h4>
        <div className="h099">
          <div className="lb099">
            <label>Username</label>
            {editor ? (
              <input
                type="text"
                className="inp099"
                value={use}
                onChange={(e) => setUse(e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="inp099"
                value={employee.username}
                disabled
              />
            )}
          </div>
          <div className="lb099">
            <label>Password</label>
            {editor ? (
              <input
                type={pass ? "text" : "password"}
                className="inp099"
                value={use}
                onChange={(e) => setUse(e.target.value)}
              />
            ) : (
              <input
                type={pass ? "text" : "password"}
                className="inp099"
                value={employee.password}
                disabled
              />
            )}
            {pass ? (
              <MdVisibility
                className="hjbtu099"
                onClick={() => setPass(false)}
              />
            ) : (
              <MdVisibilityOff
                className="hjbtu099"
                onClick={() => setPass(true)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="main099 mr099">
        <h4 className="sub-lb099">
          <span>Informations sur l'établissement</span>
          <span className="anct-099">
            {editor2 ? (
              <>
                <button
                  className="act-o099 kl334"
                  onClick={() => setEditor2(false)}
                >
                  Annuler
                </button>
                <button className="act-o099 rd334" onClick={updateSettings}>
                  Confirmer
                </button>
              </>
            ) : (
              <button
                className="act-o099 ed334"
                onClick={() => setEditor2(true)}
              >
                <BiEdit /> Edit
              </button>
            )}
          </span>
        </h4>
        <div className="h099 mr088">
          <div className="lb099">
            <label>Directeur / Délégué(e)</label>
            <input
              type="text"
              className="inp099"
              value={deleg}
              disabled={!editor2}
              onChange={(e) => setDeleg(e.target.value)}
            />
          </div>
          <div className="lb099">
            <label>Etablissement</label>
            <input
              type="text"
              className="inp099"
              value={etab}
              disabled={!editor2}
              onChange={(e) => setEtab(e.target.value)}
            />
          </div>
        </div>
        <div className="h099 mr088">
          <div className="lb099">
            <label>Directeur / Délégué(e) gender</label>
            <select
              type="text"
              className="inp099"
              value={gen}
              disabled={!editor2}
              onChange={(e) => setGen(e.target.value)}
              id="lb099"
            >
              <option value={1}>Male</option>
              <option value={2}>Female</option>
            </select>
          </div>
          <div className="lb099"></div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
