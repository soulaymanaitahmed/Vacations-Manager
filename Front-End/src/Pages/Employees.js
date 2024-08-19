import React, { useEffect, useState } from "react";
import {
  parseISO,
  addDays,
  isSaturday,
  isSunday,
  isWithinInterval,
  isValid,
} from "date-fns";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";

import { IoAlertCircleOutline } from "react-icons/io5";
import { BiMessageSquareAdd } from "react-icons/bi";
import { FaRegAddressCard } from "react-icons/fa6";
import { IoSearchCircle } from "react-icons/io5";
import { MdPersonAdd } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import "../Style/employee.css";

function Employees() {
  const [per, setPer] = useState(null);

  function Allemp() {
    const [filter1, setFilter1] = useState("*");

    const [fSanitaireAll, setFSanitaireAll] = useState([]);
    const [GradeAll, setGradeAll] = useState([]);
    const [types, setTypes] = useState([]);
    const [corps, setCorps] = useState([]);

    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [cin, setCin] = useState("");
    const [ppr, setPpr] = useState("");
    const [affec, setAffect] = useState("");
    const [type, setType] = useState("");
    const [corpSel, setCorpSel] = useState("");
    const [gradeSel, setGradeSel] = useState("");

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
        const response = await axios.get("http://localhost:7766/employees", {
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
        const response = await axios.get("http://localhost:7766/gradesun");
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
    const fetchCorps = async () => {
      try {
        const response = await axios.get("http://localhost:7766/corps");
        setCorps(response.data);
      } catch (error) {
        console.error("Error fetching corps:", error);
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
          gradeSel,
        });
        console.log(response.data);
        setPrenom("");
        setNom("");
        setCin("");
        setPpr("");
        setAffect("");
        setType("");
        setCorpSel("");
        setGradeSel("");
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
        const response = await axios.put(
          `http://localhost:7766/employees/${peronEdit.id}`,
          {
            nom,
            prenom,
            cin,
            ppr,
            affec,
            type,
            gradeSel,
          }
        );
        console.log("Employee updated:", response.data);
        setPrenom("");
        setNom("");
        setCin("");
        setPpr("");
        setAffect("");
        setType("");
        setCorpSel("");
        setGradeSel("");
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
          `http://localhost:7766/employees/${peronEdit.id}`
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
                    setAffect("");
                    setType("");
                    setCorpSel("");
                    setGradeSel("");
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
                      onClick={() => {
                        setPeronEdit(peron);
                        setAddPerson(false);
                        setPeronEditor(false);
                        setPrenom(peron.prenom);
                        setNom(peron.nom);
                        setCin(peron.cin);
                        setPpr(peron.ppr);
                        setAffect(peron.affectation);
                        setType(peron.type);
                        setCorpSel(peron.corp_nbr);
                        setGradeSel(peron.grade);
                      }}
                      onDoubleClick={() => {
                        setPer(peron.id);
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
                      setAffect("");
                      setType("");
                      setCorpSel("");
                      setGradeSel("");
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

  // ----------------------------------------------------------------------------------------------------------------------
  function Person(props) {
    const dd = props.id;
    const currentYear = new Date().getFullYear();

    const [addVc, setAddVc] = useState(false);

    const [radio1, setRadio1] = useState("");
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);

    const [justification, setJustification] = useState(true);

    const [subRadio1, setSubRadio1] = useState("");
    const [subRadio2, setSubRadio2] = useState("");
    const [year, setYear] = useState(currentYear);
    const [duration, setDuration] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [requestDate, setRequestDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [secondYear, setSecondYear] = useState(currentYear - 1);
    const [secondDuration, setSecondDuration] = useState(1);

    const [total, setTotal] = useState();
    const [maxi, setMaxi] = useState();

    const [filter1, setFilter1] = useState(currentYear);
    const years = [];

    const [person, setPerson] = useState([]);
    const [holids, setHolids] = useState([]);

    useEffect(() => {
      fetchEmployee();
      fetchHolids();
    }, []);

    useEffect(() => {
      if (startDate && duration && !check2) {
        if (subRadio1 === "1") {
          const result = calculateEndDate(startDate, duration, holids);
          setEndDate(result);
        } else {
          const start = new Date(startDate);
          start.setDate(start.getDate() + duration - 1);
          setEndDate(start.toISOString().split("T")[0]);
        }
      }
    }, [startDate, duration, holids, subRadio1, check2]);

    useEffect(() => {
      if (radio1 === "1") {
        if (subRadio1 === "1") {
          setMaxi(22);
        }
        if (subRadio1 === "2") {
          setMaxi(10);
        }
        if (subRadio1 === "3") {
          setMaxi(2);
        }
      } else {
        setMaxi(90);
      }
    }, [subRadio1, radio1]);

    useEffect(() => {
      if (check1) {
        setTotal(duration + secondDuration);
      }
      if (check1 === false) {
        setTotal(duration);
      }
    }, [duration, secondDuration, check1]);

    useEffect(() => {
      setDuration(1);
      setStartDate("");
      setRequestDate("");
      setEndDate("");
      setCheck1(false);
      setCheck2(false);
      setSecondDuration(1);
    }, [subRadio1, subRadio2, radio1]);

    const fetchHolids = async () => {
      try {
        const response = await axios.get("http://localhost:7766/vac", {
          params: { year: filter1 },
        });
        setHolids(response.data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7766/employee/${dd}`
        );
        setPerson(response.data);
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };

    const calculateEndDate = (startDate, duration, holids) => {
      let currentDate = parseISO(startDate);

      if (!isValid(currentDate)) {
        return "Invalid start date";
      }
      let daysAdded = 0;

      while (daysAdded < duration) {
        const isHoliday = holids.some((holiday) => {
          const holidayStart = parseISO(holiday.start_date);
          const holidayEnd = parseISO(holiday.end_date);
          return (
            isValid(holidayStart) &&
            isValid(holidayEnd) &&
            isWithinInterval(currentDate, {
              start: holidayStart,
              end: holidayEnd,
            })
          );
        });

        if (!isSaturday(currentDate) && !isSunday(currentDate) && !isHoliday) {
          daysAdded++;
        }

        if (daysAdded < duration) {
          currentDate = addDays(currentDate, 1);
        }
      }

      currentDate = addDays(currentDate, 1);

      return isValid(currentDate)
        ? currentDate.toISOString().split("T")[0]
        : "Invalid date calculated";
    };

    for (let i = currentYear - 3; i <= currentYear; i++) {
      years.push(i);
    }

    const addConge = async (e) => {
      e.preventDefault();
      const type = radio1 === "1" ? subRadio1 : subRadio2;
      const year_1 = subRadio1 === "1" ? year : currentYear;
      const year_2 = check1 ? secondYear : null;
      const duration_2 = check1 ? secondDuration : null;
      const justificationValue = radio1 === "2" ? justification : null;

      const data = {
        dd,
        type,
        total,
        year_1,
        duration_1: duration,
        year_2,
        duration_2,
        startDate,
        endDate,
        requestDate,
        justification: justificationValue,
      };

      try {
        const response = await axios.post(
          "http://localhost:7766/add-conge",
          data
        );
        console.log("Conge record inserted successfully:", response.data);
      } catch (error) {
        console.error("Error inserting conge record:", error);
      }
    };

    return (
      <div className="personel">
        <div className="user-list-header">
          <div className="mokdfn6">
            <button
              className="back"
              onClick={() => {
                setPer(null);
              }}
            >
              ◀
            </button>
            <div className="jvghvj5">
              <h3 className="user-header" id="pers44">
                {person.prenom + " - " + person.nom}
              </h3>
              <span className="llpmo34">{person.corp_name}</span>
            </div>
          </div>
          <div className="searcher">
            <input
              type="text"
              id="servh1255"
              placeholder="Search"
              className="searcher1"
              value={"Sélectionner l'année"}
              disabled
            />
            <select
              name="type"
              className="filter-priv"
              value={filter1}
              onChange={(e) => setFilter1(e.target.value)}
              required
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            className="minidash33"
            onClick={() => {
              setAddVc(true);
            }}
          >
            Nouveau congé <BiMessageSquareAdd className="add4564" />
          </button>
        </div>
        <br />
        <hr />
        <br />
        <div className="person77">
          {addVc ? (
            <form className="add-vac-form" onSubmit={addConge}>
              <div
                className="vac-exit55"
                onClick={(e) => {
                  e.preventDefault();
                  setAddVc(false);
                }}
              >
                ×
              </div>
              <div className="khgjkfg4">
                <p className="jkezjf77">Ajouter un congé</p>
              </div>
              <div className="mmpou5">
                <div className="radio-input-wrapper">
                  <label className="label">
                    <input
                      value="1"
                      name="value-radio"
                      id="value-1"
                      className="radio-input"
                      type="radio"
                      onChange={(e) => setRadio1(e.target.value)}
                      checked={radio1 === "1"}
                    />
                    <div className="radio-design"></div>
                    <div className="label-text">Congé Administratif</div>
                  </label>
                  {radio1 === "1" ? (
                    <div className="radio-input-wrapper1">
                      <label className="label">
                        <input
                          value="1"
                          name="value-radio1"
                          id="value-2"
                          className="radio-input"
                          type="radio"
                          onChange={(e) => setSubRadio1(e.target.value)}
                          checked={subRadio1 === "1"}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Annuel (22 max)</div>
                      </label>
                      <label className="label">
                        <input
                          value="2"
                          name="value-radio1"
                          id="value-3"
                          className="radio-input"
                          type="radio"
                          onChange={(e) => setSubRadio1(e.target.value)}
                          checked={subRadio1 === "2"}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Exceptionnel (10 max)</div>
                      </label>
                      <label className="label">
                        <input
                          value="3"
                          name="value-radio1"
                          id="value-3"
                          className="radio-input"
                          type="radio"
                          onChange={(e) => setSubRadio1(e.target.value)}
                          checked={subRadio1 === "3"}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Autorisation d'absence</div>
                      </label>
                    </div>
                  ) : null}
                  <label className="label">
                    <input
                      value="2"
                      name="value-radio"
                      id="value-2"
                      className="radio-input"
                      type="radio"
                      onChange={(e) => setRadio1(e.target.value)}
                      checked={radio1 === "2"}
                    />
                    <div className="radio-design"></div>
                    <div className="label-text">Congé de Maladie</div>
                  </label>
                  {radio1 === "2" ? (
                    <div className="radio-input-wrapper1">
                      <label className="label">
                        <input
                          value="11"
                          name="value-radio2"
                          id="value-2"
                          className="radio-input"
                          type="radio"
                          onChange={(e) => setSubRadio2(e.target.value)}
                          checked={subRadio2 === "11"}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Court durée</div>
                      </label>
                      <label className="label">
                        <input
                          value="12"
                          name="value-radio2"
                          id="value-3"
                          className="radio-input"
                          type="radio"
                          onChange={(e) => setSubRadio2(e.target.value)}
                          checked={subRadio2 === "12"}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Moyen durée</div>
                      </label>
                      <label className="label">
                        <input
                          value="13"
                          name="value-radio2"
                          id="value-3"
                          className="radio-input"
                          type="radio"
                          onChange={(e) => setSubRadio2(e.target.value)}
                          checked={subRadio2 === "13"}
                        />
                        <div className="radio-design"></div>
                        <div className="label-text">Long durée</div>
                      </label>
                    </div>
                  ) : null}
                </div>

                {(radio1 === "1" && subRadio1) ||
                (radio1 === "2" && subRadio2) ? (
                  <div className="insert-cong-new">
                    {subRadio1 === "1" ? (
                      <div className="llkio55">
                        <div className="llmo595">
                          2024 <span className="llpn33">20</span>
                        </div>
                        <div className="llmo595">
                          2023 <span className="llpn33">12</span>
                        </div>
                        <div className="llmo595">
                          2022 <span className="llpn33">0</span>
                        </div>
                        <div className="llmo595">
                          2021 <span className="llpn33">10</span>
                        </div>
                      </div>
                    ) : null}
                    <div className="group44">
                      <div className="dfgkjkfdgdkf4">
                        {subRadio1 === "1" ? (
                          <div className="group44">
                            <label className="lb-hh4">Année</label>
                            <input
                              type="number"
                              className="input-vc44"
                              min={2020}
                              max={2024}
                              value={year}
                              onChange={(e) => setYear(e.target.value)}
                            />
                          </div>
                        ) : null}
                        <div
                          className="group44"
                          id={
                            subRadio1 === "2" || subRadio1 === "3"
                              ? "mmojg55"
                              : null
                          }
                        >
                          <button
                            className="add-55"
                            id="kkli55"
                            onClick={(e) => {
                              e.preventDefault();
                              if (duration >= 1) {
                                setDuration(duration - 1);
                              }
                            }}
                          >
                            -
                          </button>
                          <label className="lb-hh4">Durée</label>
                          <input
                            type="number"
                            className="input-vc44"
                            id="kklo44"
                            value={duration}
                            onChange={(e) =>
                              setDuration(e.target.valueAsNumber)
                            }
                          />
                          <button
                            className="add-55"
                            id="kkli66"
                            onClick={(e) => {
                              e.preventDefault();
                              if (total < maxi) {
                                setDuration(duration + 1);
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="group44">
                      <label className="lb-hh4">Du</label>
                      <input
                        type="date"
                        className="input-vc44"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="group44">
                      <label className="lb-hh4">Date de demande</label>
                      <input
                        type="date"
                        className="input-vc44"
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                      />
                    </div>
                    <div className="group44">
                      <label className="lb-hh4">
                        Au{" "}
                        {subRadio1 === "1" ? (
                          <span className="kskl44">(Automatique / Manuel)</span>
                        ) : null}
                      </label>

                      <div className="kklfkd5">
                        {subRadio1 === "1" ? (
                          <label>
                            <input
                              type="checkbox"
                              className="input"
                              checked={check2}
                              onChange={(e) => setCheck2(e.target.checked)}
                            />
                            <span
                              className="custom-checkbox"
                              id="jjk488"
                            ></span>
                          </label>
                        ) : null}
                        <input
                          disabled={subRadio1 === "1" && !check2 ? true : false}
                          type="date"
                          className="input-vc44"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="group44">
                      <label className="lb-hh4">
                        <label className="lb-hh4">Total</label>
                      </label>
                      <input
                        id="tot44"
                        className="input-vc44"
                        value={total}
                        disabled
                      />
                    </div>
                    {radio1 === "2" ? (
                      <div className="group44">
                        <label className="lb-hh4">Justification</label>
                        <select
                          type="date"
                          className="input-vc44"
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                        >
                          <option value={true}>Justifier</option>
                          <option value={false}>Non justifier</option>
                        </select>
                      </div>
                    ) : null}
                    {subRadio1 === "1" ? (
                      <div className="group44">
                        <div className="dfgkjkfdgdkf4">
                          <div className="group44">
                            <label className="lb-hh4">Deuxième année</label>
                            <div className="kklfkd5">
                              <label>
                                <input
                                  type="checkbox"
                                  className="input"
                                  checked={check1}
                                  onChange={(e) => setCheck1(e.target.checked)}
                                  disabled={duration >= 22 ? true : false}
                                />
                                <span
                                  className="custom-checkbox"
                                  id={duration >= 22 ? null : "jjk4"}
                                ></span>
                              </label>
                              <input
                                type="number"
                                className="input-vc44"
                                min={2020}
                                max={2024}
                                value={secondYear}
                                onChange={(e) => setSecondYear(e.target.value)}
                                disabled={!check1}
                              />
                            </div>
                          </div>
                          <div className="group44">
                            <label className="lb-hh4">Durée</label>
                            <button
                              className="add-555"
                              id={check1 ? "kkli55" : "kkli555"}
                              onClick={(e) => {
                                e.preventDefault();
                                if (secondDuration > 1) {
                                  setSecondDuration(secondDuration - 1);
                                }
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="input-vc44"
                              id="kklo44"
                              min={1}
                              max={22}
                              value={secondDuration}
                              onChange={(e) =>
                                setSecondDuration(e.target.valueAsNumber)
                              }
                              disabled={!check1}
                            />
                            <button
                              className="add-555"
                              id={check1 ? "kkli66" : "kkli666"}
                              disabled={!check1}
                              onClick={(e) => {
                                e.preventDefault();
                                if (total < 22) {
                                  setSecondDuration(secondDuration + 1);
                                }
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="group44"></div>
                    )}
                    <div className="group445" id="hhkl44">
                      <button className="sub44" id="annlll44" type="button">
                        Annuler
                      </button>
                      <button
                        className="sub44"
                        type="submit"
                        disabled={total < 1 || total > 22}
                      >
                        Submit
                      </button>
                    </div>
                    <div className="group44588" id="hh2">
                      Danger! Indicates a dangerous or potentially negative
                      action.
                    </div>
                  </div>
                ) : null}
              </div>
            </form>
          ) : null}
        </div>
      </div>
    );
  }

  return <>{per ? <Person id={per} /> : <Allemp />}</>;
}

export default Employees;
