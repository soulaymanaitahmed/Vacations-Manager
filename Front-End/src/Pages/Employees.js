import React, { useEffect, useState } from "react";

import axios from "axios";

import toast, { Toaster } from "react-hot-toast";

import { IoAlertCircleOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa6";
import { IoSearchCircle } from "react-icons/io5";
import { MdPersonAdd } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import "../Style/employee.css";

function Employees() {
  const getBaseURL = () => {
    const { protocol, hostname } = window.location;
    const port = 7766;
    return `${protocol}//${hostname}:${port}`;
  };
  const baseURL = getBaseURL();

  const [filter1, setFilter1] = useState("*");

  const [fSanitaireAll, setFSanitaireAll] = useState([]);
  const [GradeAll, setGradeAll] = useState([]);
  const [types, setTypes] = useState([]);
  const [corps, setCorps] = useState([]);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [cin, setCin] = useState("");
  const [ppr, setPpr] = useState("");
  const [phone, setPhone] = useState("");
  const [affec, setAffect] = useState("");
  const [type, setType] = useState("");
  const [corpSel, setCorpSel] = useState("");
  const [gradeSel, setGradeSel] = useState("");
  const [dtRec, setDtRec] = useState("");
  const [gan, setGan] = useState("");

  const [addPerson, setAddPerson] = useState(false);

  const [peronEdit, setPeronEdit] = useState();
  const [peronEditor, setPeronEditor] = useState(false);

  const [conf, setConf] = useState(false);

  const [employeesall, setEmployeesAll] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const alert1 = (mess) => toast.success(mess);
  const alert2 = (mess) => toast.error(mess);

  useEffect(() => {
    fetchFSanitaires();
    fetchGrades();
    fetchTypes();
    fetchCorps();
  }, []);
  useEffect(() => {
    fetchEmployees();
    setPeronEdit();
  }, [filter1]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = employeesall.filter((employee) => {
      return (
        employee.type_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.formation_sanitaire
          .toLowerCase()
          .includes(lowerCaseSearchTerm) ||
        employee.corp_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.grade_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.cin.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.phone.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.ppr.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.prenom.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.nom.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
    setFilteredEmployees(filtered);
  }, [searchTerm, employeesall]);

  useEffect(() => {
    const filteredGrades = GradeAll.filter(
      (cr) => cr.corp_id.toString() === corpSel.toString()
    );
    if (filteredGrades.length > 0) {
      setGradeSel(filteredGrades[0].id);
    }
  }, [corpSel, GradeAll]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${baseURL}/employees`, {
        params: {
          id: filter1 === "*" ? null : filter1,
        },
      });
      setEmployeesAll(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const fetchFSanitaires = async () => {
    try {
      const response = await axios.get(`${baseURL}/formation_sanitaires`);
      setFSanitaireAll(response.data);
    } catch (error) {
      console.error("Error fetching fSanitaires:", error);
    }
  };
  const fetchGrades = async () => {
    try {
      const response = await axios.get(`${baseURL}/gradesun`);
      setGradeAll(response.data);
    } catch (error) {
      console.error("Error fetching Grades:", error);
    }
  };
  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${baseURL}/types`);
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };
  const fetchCorps = async () => {
    try {
      const response = await axios.get(`${baseURL}/corps`);
      setCorps(response.data);
    } catch (error) {
      console.error("Error fetching corps:", error);
    }
  };
  const sendEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/employees`, {
        nom,
        prenom,
        cin,
        ppr,
        phone,
        affec,
        type,
        gradeSel,
        dtRec,
        gan,
      });
      console.log(response.data);
      setPrenom("");
      setNom("");
      setCin("");
      setPpr("");
      setPhone("");
      setAffect("");
      setType("");
      setCorpSel("");
      setGradeSel("");
      setDtRec("");
      setGan("");
      setAddPerson(false);
      fetchEmployees();
      alert1("Nouvel employé ajouté avec succès!");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Validation error:", error.response.data);
        let errorMessage = "";
        switch (error.response.data.code) {
          case 1:
            errorMessage = "Un employé avec ce nom + prenom existe déjà.";
            break;
          case 2:
            errorMessage = "Un employé avec ce CIN existe déjà.";
            break;
          case 3:
            errorMessage = "Un employé avec ce nom et CIN existe déjà.";
            break;
          case 4:
            errorMessage = "Un employé avec ce PPR existe déjà.";
            break;
          case 5:
            errorMessage = "Un employé avec ce nom et PPR existe déjà.";
            break;
          case 6:
            errorMessage = "Un employé avec ce CIN et PPR existe déjà.";
            break;
          case 7:
            errorMessage = "Un employé avec ce nom, CIN et PPR existe déjà.";
            break;
          case 8:
            errorMessage = "Un employé avec ce N° téléphone existe déjà.";
            break;
          default:
            errorMessage = "Une erreur inconnue s'est produite.";
        }
        alert2(errorMessage);
      } else {
        console.error("Error updating data:", error);
      }
    }
  };
  const updateEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${baseURL}/employees/${peronEdit.id}`, {
        nom,
        prenom,
        cin,
        ppr,
        phone,
        affec,
        type,
        gradeSel,
        dtRec,
        gan,
      });
      console.log("Employee updated:", response.data);
      setPrenom("");
      setNom("");
      setCin("");
      setPpr("");
      setPhone("");
      setAffect("");
      setType("");
      setCorpSel("");
      setGradeSel("");
      setGan("");
      setDtRec("");
      setAddPerson(false);
      setPeronEditor(false);
      setPeronEdit(false);
      fetchEmployees();
      alert1("Employé mis à jour avec succès!");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Validation error:", error.response.data);
        let errorMessage = "";
        switch (error.response.data.code) {
          case 2:
            errorMessage = "Un employé avec ce CIN existe déjà.";
            break;
          case 4:
            errorMessage = "Un employé avec ce PPR existe déjà.";
            break;
          case 6:
            errorMessage = "Un employé avec ce CIN et PPR existe déjà.";
            break;
          case 7:
            errorMessage = "Un employé avec ce CIN et PPR existe déjà.";
            break;
          case 8:
            errorMessage = "Un employé avec ce N° téléphone existe déjà.";
            break;
          default:
            errorMessage = "Une erreur inconnue s'est produite.";
        }
        alert2(errorMessage);
      } else {
        console.error("Error updating data:", error);
        alert2("Erreur lors de la mise à jour des données.");
      }
    }
  };
  const deleteEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${baseURL}/employees/${peronEdit.id}`
      );
      console.log(response.data);
      setPrenom("");
      setNom("");
      setCin("");
      setPpr("");
      setAffect("");
      setType("");
      setCorpSel("");
      setGradeSel("");
      setDtRec("");
      setGan("");
      setPeronEditor(false);
      setPeronEdit(false);
      setConf(false);
      fetchEmployees();
      alert1("Employé supprimé avec succès");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert2("Erreur lors de la suppression de l'employé");
    }
  };

  console.log(dtRec);

  return (
    <div className="employees">
      <Toaster />
      {conf ? (
        <div className="confirmation11">
          <div className="conf-card">
            <div className="conf-text">
              <IoAlertCircleOutline className="conf-alert" />
              <p className="conf-message">
                Êtes-vous sûr de vouloir supprimer cet employé ?
              </p>
            </div>
            <div className="conf-actions">
              <button
                onClick={() => {
                  setConf(false);
                }}
                className="conf-btn"
                id="conf-cancel"
              >
                Annuler
              </button>
              <button
                onClick={deleteEmployee}
                className="conf-btn"
                id="conf-conf"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="user-list-header">
        <h3 className="user-header">Le personnel</h3>
        <div className="searcher">
          <IoSearchCircle className="search-icon" />
          <input
            type="text"
            id="servh12"
            placeholder="Search"
            className="searcher1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            setPrenom("");
            setNom("");
            setCin("");
            setPpr("");
            setPhone("");
            setAffect("");
            setType("");
            setCorpSel("");
            setGradeSel("");
            setPeronEditor(false);
            setPeronEdit(false);
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
                  Prénom
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
                  Civilité
                </label>
                <select
                  name="aff"
                  className="person-input"
                  value={gan}
                  onChange={(e) => {
                    setGan(e.target.value);
                  }}
                  required
                >
                  <option>---Civilité---</option>
                  <option value={1}>Monsieur</option>
                  <option value={2}>Mademoiselle & Madame</option>
                </select>
              </div>
              <div className="input-lab1">
                <label className="ggv1" for="aff">
                  Type
                </label>
                <select
                  name="aff"
                  className="person-input"
                  value={type}
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
              <div className="input-lab1">
                <label className="ggv1" for="aff">
                  Affectation
                </label>
                <select
                  name="aff"
                  className="person-input"
                  value={affec}
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
              </div>
              <div className="input-lab1">
                <label className="ggv1" for="nom">
                  Date de recrutement
                </label>
                <input
                  className="person-input"
                  name="nom"
                  type="date"
                  value={dtRec}
                  onChange={(e) => {
                    setDtRec(e.target.value);
                  }}
                  required
                />
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
                <label className="ggv1" for="phone">
                  Phone
                </label>
                <input
                  className="person-input"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="input-lab1">
                <label className="ggv1" for="corp">
                  Corp
                </label>
                <select
                  name="corp"
                  className="person-input"
                  value={corpSel}
                  onChange={(e) => {
                    setCorpSel(e.target.value);
                  }}
                  required
                >
                  <option value={""}>Select corp</option>
                  {corps.map((cr) => {
                    return (
                      <option key={cr.id} value={cr.id}>
                        {cr.corp}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="input-lab1">
                <label className="ggv1" for="grade">
                  Grade
                </label>
                <select
                  name="grade"
                  className="person-input"
                  value={gradeSel}
                  onChange={(e) => {
                    setGradeSel(e.target.value);
                  }}
                  required
                  disabled={corpSel ? false : true}
                >
                  <option>Select grade</option>
                  {GradeAll.filter(
                    (cr) => cr.corp_id.toString() === corpSel.toString()
                  ).map((cr) => {
                    return (
                      <option key={cr.id} value={cr.id}>
                        {cr.grade}
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
                  setAddPerson(false);
                  setPrenom("");
                  setNom("");
                  setCin("");
                  setPpr("");
                  setPhone("");
                  setAffect("");
                  setType("");
                  setCorpSel("");
                  setGradeSel("");
                  setDtRec("");
                  setGan("");
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
          <div className="cont-persons">
            <div className="persons-list">
              {filteredEmployees.map((peron) => {
                return (
                  <div
                    key={peron.id}
                    onDoubleClick={() => {
                      window.location.href = `/personnels/${peron?.id}`;
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
                    <button
                      className="edint-per"
                      id={
                        peron.corp_nbr === 1
                          ? "adm"
                          : peron.corp_nbr === 2
                          ? "med"
                          : peron.corp_nbr === 3
                          ? "par"
                          : "nj8"
                      }
                      onClick={() => {
                        setPeronEdit(peron);
                        setAddPerson(false);
                        setPeronEditor(false);
                        setPrenom(peron.prenom);
                        setNom(peron.nom);
                        setCin(peron.cin);
                        setPpr(peron.ppr);
                        setPhone(peron.phone);
                        setAffect(peron.affectation);
                        setType(peron.type);
                        setCorpSel(peron.corp_nbr);
                        setGradeSel(peron.grade);
                        setGan(peron.gander);
                        setDtRec(peron.date_affect.split("T")[0]);
                      }}
                    >
                      <FaUserEdit className="inspectr-per" />
                    </button>
                    <h4 className="full-name">
                      {peron.prenom + " " + peron.nom}
                    </h4>
                    <p className="grade33">{peron.grade_name}</p>
                    <p className="grade33">
                      {peron.type_name + " - " + peron.formation_sanitaire}
                    </p>
                    <div className="ggv449">
                      <h5 className="cin66">CIN: {peron.cin}</h5>
                      <h5 className="ppr66">PPR: {peron.ppr}</h5>
                    </div>
                  </div>
                );
              })}
            </div>
            {peronEdit ? (
              <form
                onSubmit={updateEmployee}
                className="person22"
                id={
                  peronEdit.corp_nbr === 1
                    ? "adm1"
                    : peronEdit.corp_nbr === 2
                    ? "med1"
                    : peronEdit.corp_nbr === 3
                    ? "par1"
                    : "nj81"
                }
              >
                <button
                  className="bfg1"
                  onClick={(e) => {
                    e.preventDefault();
                    setPrenom("");
                    setNom("");
                    setCin("");
                    setPpr("");
                    setPhone("");
                    setAffect("");
                    setType("");
                    setCorpSel("");
                    setGradeSel("");
                    setDtRec("");
                    setGan("");
                    setPeronEditor(false);
                    setPeronEdit(false);
                  }}
                >
                  ×
                </button>
                <div className="kklm6">
                  <label className="mmpr22" for="prenom">
                    Prénom
                  </label>
                  <input
                    className="hhtb6"
                    type="text"
                    value={prenom}
                    onChange={(e) => {
                      setPrenom(e.target.value);
                    }}
                    maxLength={50}
                    minLength={2}
                    required
                    name="prenom"
                    disabled={peronEditor ? false : true}
                  />
                </div>
                <div className="kklm6">
                  <label className="mmpr22" for="nom">
                    Nom
                  </label>
                  <input
                    className="hhtb6"
                    type="text"
                    value={nom}
                    onChange={(e) => {
                      setNom(e.target.value);
                    }}
                    maxLength={50}
                    minLength={2}
                    required
                    name="nom"
                    disabled={peronEditor ? false : true}
                  />
                </div>
                <div className="kklm6">
                  <label className="mmpr22" htmlFor="civi">
                    Civilité
                  </label>
                  <select
                    name="civi"
                    className="hhtb6"
                    value={gan}
                    onChange={(e) => {
                      setGan(e.target.value);
                    }}
                    disabled={peronEditor ? false : true}
                  >
                    <option value={1}>Monsieur</option>
                    <option value={2}>Mademoiselle & Madame</option>
                  </select>
                </div>
                <div className="kklm6">
                  <label className="mmpr22" for="cin">
                    CIN
                  </label>
                  <input
                    className="hhtb6"
                    type="text"
                    value={cin}
                    onChange={(e) => {
                      setCin(e.target.value);
                    }}
                    maxLength={15}
                    minLength={6}
                    required
                    name="cin"
                    disabled={peronEditor ? false : true}
                  />
                </div>
                <div className="kklm6">
                  <label className="mmpr22" for="ppr">
                    PPR
                  </label>
                  <input
                    className="hhtb6"
                    type="text"
                    value={ppr}
                    onChange={(e) => {
                      setPpr(e.target.value);
                    }}
                    maxLength={12}
                    minLength={6}
                    required
                    name="ppr"
                    disabled={peronEditor ? false : true}
                  />
                </div>
                <div className="kklm6">
                  <label className="mmpr22" for="phone">
                    N° téléphone
                  </label>
                  <input
                    className="hhtb6"
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    maxLength={15}
                    minLength={10}
                    required
                    name="phone"
                    disabled={peronEditor ? false : true}
                  />
                </div>
                <div className="kklm6">
                  <label className="mmpr22" for="dtrec">
                    Date de recrutement
                  </label>
                  <input
                    className="hhtb6"
                    type="date"
                    value={dtRec}
                    onChange={(e) => {
                      setDtRec(e.target.value);
                    }}
                    required
                    name="dtrec"
                    disabled={peronEditor ? false : true}
                  />
                </div>
                <div className="kklm6">
                  <label className="mmpr22" for="type">
                    Type
                  </label>
                  <select
                    name="type"
                    className="hhtb6"
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                    }}
                    disabled={peronEditor ? false : true}
                    required
                  >
                    {types.map((cr) => {
                      return (
                        <option key={cr.id} value={cr.id}>
                          {cr.type}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="kklm6">
                  <label className="mmpr22" for="affectation">
                    Affectation
                  </label>
                  <select
                    name="affectation"
                    className="hhtb6"
                    value={affec}
                    onChange={(e) => {
                      setAffect(e.target.value);
                    }}
                    disabled={peronEditor ? false : true}
                    required
                  >
                    {fSanitaireAll.map((cr) => {
                      return (
                        <option key={cr.id} value={cr.id}>
                          {cr.formation_sanitaire}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="kklm6">
                  <label className="mmpr22" for="corp">
                    Corp
                  </label>
                  <select
                    name="corp"
                    className="hhtb6"
                    value={corpSel}
                    onChange={(e) => {
                      setCorpSel(e.target.value);
                    }}
                    disabled={peronEditor ? false : true}
                    required
                  >
                    {corps.map((cr) => {
                      return (
                        <option key={cr.id} value={cr.id}>
                          {cr.corp}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="kklm6">
                  <label className="mmpr22" htmlFor="grade">
                    Grade
                  </label>
                  <select
                    name="grade"
                    className="hhtb6"
                    value={gradeSel}
                    onChange={(e) => {
                      setGradeSel(e.target.value);
                    }}
                    disabled={peronEditor ? false : true}
                  >
                    {GradeAll.filter(
                      (cr) => cr.corp_id.toString() === corpSel.toString()
                    ).map((cr) => {
                      return (
                        <option key={cr.id} value={cr.id}>
                          {cr.grade}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="cchk22">
                  {peronEditor ? (
                    <button type="submit" className="llpm1" id="kklo4">
                      Confirmer
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setPeronEditor(true);
                      }}
                      className="llpm1"
                      id="kklo5"
                    >
                      Edit
                    </button>
                  )}
                  {peronEditor ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setPeronEditor(false);
                      }}
                      className="llpm1"
                      id="kklo7"
                    >
                      Annuler
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setConf(true);
                      }}
                      className="llpm1"
                      id="kklo6"
                    >
                      <MdDelete className="ddt22" /> Supprimer
                    </button>
                  )}
                </div>
              </form>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Employees;
