import React, { useEffect, useState } from "react";
import axios from "axios";

import { FaRegAddressCard } from "react-icons/fa6";
import { IoSearchCircle } from "react-icons/io5";
import { MdPersonAdd } from "react-icons/md";

import "../Style/employee.css";

function Employees() {
  const [filter1, setFilter1] = useState("*");

  const [fSanitaireAll, setFSanitaireAll] = useState([]);
  const [GradeAll, setGradeAll] = useState([]);
  const [types, setTypes] = useState([]);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [cin, setCin] = useState("");
  const [ppr, setPpr] = useState("");
  const [affec, setAffect] = useState("");
  const [type, setType] = useState("");
  const [grade, setGrade] = useState("");

  const [addPerson, setAddPerson] = useState(false);

  const [person, setPerson] = useState([]);

  const [employeesall, setEmployeesAll] = useState([]);

  useEffect(() => {
    fetchFSanitaires();
    fetchGrades();
    fetchTypes();
  }, []);
  useEffect(() => {
    fetchEmployees();
  }, [filter1]);
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:7766/employees", {
        params: {
          corp_nbr: filter1 === "*" ? null : filter1,
        },
      });
      setEmployeesAll(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchFSanitaires = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7766/formation_sanitaires"
      );
      setFSanitaireAll(response.data);
    } catch (error) {
      console.error("Error fetching fSanitaires:", error);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await axios.get("http://localhost:7766/grades");
      setGradeAll(response.data);
    } catch (error) {
      console.error("Error fetching Grades:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get("http://localhost:7766/types");
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const sendEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7766/employees", {
        nom,
        prenom,
        cin,
        ppr,
        affec,
        type,
        grade,
      });
      console.log(response.data);
      setNom("");
      setPrenom("");
      setCin("");
      setPpr("");
      setAffect("");
      setGrade("");
      setAddPerson(false);
      fetchEmployees();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Validation error:", error.response.data);
      } else {
        console.error("Error updating data:", error);
      }
    }
  };

  return (
    <div className="employees">
      <div className="user-list-header">
        <h3 className="user-header">Le personnel</h3>
        <div className="searcher">
          <IoSearchCircle className="search-icon" />
          <input
            type="text"
            id="servh12"
            placeholder="Search"
            className="searcher1"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            name="type"
            className="filter-priv"
            value={filter1}
            onChange={(e) => setFilter1(e.target.value)}
            required
          >
            <option value={"*"}>Tous</option>
            <option value={"1"}>Adm&Tech</option>
            <option value={"2"}>Médical</option>
            <option value={"3"}>Paramédical</option>
          </select>
        </div>
        <button
          className="add-user-btn"
          onClick={() => {
            setAddPerson(true);
          }}
        >
          Ajouter un employé <MdPersonAdd className="add-icon" />
        </button>
      </div>
      <br />
      <hr />
      <br />
      <div className="user-show22">
        {addPerson ? (
          <form className="add-person" onSubmit={sendEmployee}>
            <div className="line11">
              <div className="input-lab1">
                <label className="ggv1" for="prenom">
                  Prenom
                </label>
                <input
                  className="person-input"
                  name="prenom"
                  type="text"
                  value={prenom}
                  onChange={(e) => {
                    setPrenom(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="input-lab1">
                <label className="ggv1" for="nom">
                  Nom
                </label>
                <input
                  className="person-input"
                  name="nom"
                  type="text"
                  value={nom}
                  onChange={(e) => {
                    setNom(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="input-lab1">
                <label className="ggv1" for="aff">
                  Affectation
                </label>
                <select
                  name="aff"
                  className="person-input"
                  value={affec}
                  id="lnmo3"
                  onChange={(e) => {
                    setAffect(e.target.value);
                  }}
                  required
                >
                  <option>Select formation sanitaire</option>
                  {fSanitaireAll.map((cr) => {
                    return (
                      <option key={cr.id} value={cr.id}>
                        {cr.formation_sanitaire}
                      </option>
                    );
                  })}
                </select>
                <select
                  name="aff"
                  className="person-input"
                  value={type}
                  id="lnmo3"
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                  required
                >
                  <option>Select Type</option>
                  {types.map((cr) => {
                    return (
                      <option key={cr.id} value={cr.id}>
                        {cr.type}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="line11">
              <div className="input-lab1">
                <label className="ggv1" for="cin">
                  CIN
                </label>
                <input
                  className="person-input"
                  name="cin"
                  type="text"
                  value={cin}
                  onChange={(e) => {
                    setCin(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="input-lab1">
                <label className="ggv1" for="ppr">
                  PPR
                </label>
                <input
                  className="person-input"
                  name="ppr"
                  type="text"
                  value={ppr}
                  onChange={(e) => {
                    setPpr(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="input-lab1">
                <label className="ggv1" for="grade">
                  Grade
                </label>
                <select
                  name="grade"
                  className="person-input"
                  value={grade}
                  onChange={(e) => {
                    setGrade(e.target.value);
                  }}
                  required
                >
                  <option>Select grade</option>
                  {GradeAll.map((cr) => {
                    return (
                      <option key={cr.id} value={cr.id}>
                        {cr.grade + "  -  " + cr.corp}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="line22">
              <button
                className="conf33"
                onClick={(e) => {
                  e.preventDefault();
                  setNom("");
                  setPrenom("");
                  setCin("");
                  setPpr("");
                  setAffect("");
                  setGrade("");
                  setAddPerson(false);
                }}
              >
                Annuler
              </button>
              <button type="submit" className="conf22">
                <FaRegAddressCard className="nnt5" />
                Ajouter
              </button>
            </div>
          </form>
        ) : null}
        {employeesall.length > 0 ? (
          <div className="persons-list">
            {employeesall.map((peron) => {
              return (
                <div
                  key={peron.id}
                  onDoubleClick={() => {
                    setPerson(peron);
                  }}
                  className="person-card"
                  id={
                    peron.corp_nbr === 1
                      ? "adm1"
                      : peron.corp_nbr === 2
                      ? "med1"
                      : peron.corp_nbr === 3
                      ? "par1"
                      : "nj81"
                  }
                >
                  <div
                    className="corp77"
                    id={
                      peron.corp_nbr === 1
                        ? "adm"
                        : peron.corp_nbr === 2
                        ? "med"
                        : peron.corp_nbr === 3
                        ? "par"
                        : "nj8"
                    }
                  >
                    {peron.corp_nbr === 1
                      ? "Adm&Tech"
                      : peron.corp_nbr === 2
                      ? "Méd"
                      : peron.corp_nbr === 3
                      ? "Para"
                      : "Unknown"}
                  </div>

                  <h4 className="full-name">
                    {peron.prenom + " " + peron.nom}
                  </h4>
                  <p className="grade33">{peron.grade}</p>
                  <p className="grade33">
                    {peron.type + " - " + peron.formation_sanitaire}
                  </p>
                  <div className="ggv449">
                    <h5 className="cin66">CIN: {peron.cin}</h5>
                    <h5 className="ppr66">PPR: {peron.ppr}</h5>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Employees;
