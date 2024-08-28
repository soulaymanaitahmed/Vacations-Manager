import React, { useMemo, useEffect, useState } from "react";
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
import { MdOutlineCancel } from "react-icons/md";
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
    const [addVc2, setAddVc2] = useState(false);

    const [congExist, setCongExist] = useState(false);

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
    const [congsAll, setCongsAll] = useState([]);
    const [sold, setSold] = useState([]);

    const [singleConj, setSingleConj] = useState(null);

    const [year3, setYear3] = useState(currentYear - 1);
    const [duration3, setDuration3] = useState(1);

    const [exep, setExep] = useState(0);

    const memoizedResult = useMemo(() => {
      const yearTotals = {};

      congsAll.forEach((c) => {
        if (c.type === 1) {
          if (c.year_1) {
            if (!yearTotals[c.year_1]) {
              yearTotals[c.year_1] = 0;
            }
            yearTotals[c.year_1] += c.duration_1 || 0;
          }
          if (c.year_2) {
            if (!yearTotals[c.year_2]) {
              yearTotals[c.year_2] = 0;
            }
            yearTotals[c.year_2] += c.duration_2 || 0;
          }
        }
      });

      return Object.keys(yearTotals).map((year) => ({
        year: parseInt(year),
        sold: yearTotals[year],
      }));
    }, [congsAll]);

    useEffect(() => {
      fetchEmployee();
      fetchHolids();
      fetchCongeData();
    }, []);

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
      if (check1 && secondYear && secondDuration) {
        duration += secondDuration;
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
        setCongExist(false);
        setAddVc(false);
        fetchCongeData();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setCongExist(true);
        }
        console.error("Error inserting conge record:", error);
      }
    };

    const addConge2 = async (e) => {
      e.preventDefault();

      const data = {
        dd,
        type: "1",
        year_1: year3,
        duration_1: duration3,
      };

      try {
        const response = await axios.post(
          "http://localhost:7766/add-sold",
          data
        );
        console.log("Sold record inserted successfully:", response.data);
        setAddVc2(false);
        fetchCongeData();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setCongExist(true);
        }
        console.error("Error inserting conge record:", error);
      }
    };

    const fetchCongeData = async () => {
      try {
        const response = await axios.get(`http://localhost:7766/conge/${dd}`);
        setCongsAll(response.data);
      } catch (error) {
        console.error("Error fetching conge data:", error);
      }
    };

    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formatDateTime = (isoDate) => {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const calculateTotalDurationForType2 = (congsAll) => {
      const currentYear = new Date().getFullYear();
      let totalDuration = 0;

      congsAll.forEach((c) => {
        if (c.type === 2) {
          const itemYear = new Date(c.start_at).getFullYear();
          if (itemYear === currentYear) {
            const duration =
              c.cancel === 1 ? c.duration_after || 0 : c.total_duration || 0;
            totalDuration += duration;
          }
        }
      });

      return totalDuration;
    };

    for (let i = currentYear - 3; i <= currentYear; i++) {
      years.push(i);
    }

    useEffect(() => {
      setAddVc2(false);
      setDuration(1);
      setStartDate("");
      setRequestDate("");
      setEndDate("");
      setCheck1(false);
      setCheck2(false);
      setRadio1("");
      setSubRadio1("");
      setSubRadio2("");
      setSecondDuration(1);
    }, [addVc]);

    useEffect(() => {
      setAddVc(false);
      setYear3(currentYear);
      setDuration3(1);
    }, [addVc2]);

    useEffect(() => {
      if (startDate && duration && !check2) {
        const start = new Date(startDate);
        let end;

        if (subRadio1 === "1") {
          end = calculateEndDate(startDate, duration, holids);
          setEndDate(end);
        } else if (subRadio1 === "2") {
          const maxEndDate = new Date(currentYear, 11, 32);
          const adjustedDuration = Math.max(
            0,
            Math.floor((maxEndDate - start) / (1000 * 60 * 60 * 24)) + 1
          );

          end = new Date(start);
          end.setDate(
            start.getDate() + Math.min(duration, adjustedDuration) - 1
          );

          setEndDate(end.toISOString().split("T")[0]);
          setDuration(Math.min(duration, adjustedDuration));
        } else {
          end = new Date(start);
          end.setDate(start.getDate() + duration - 1);
          setEndDate(end.toISOString().split("T")[0]);
        }
      }
    }, [
      startDate,
      duration,
      holids,
      subRadio1,
      check2,
      secondDuration,
      secondYear,
      check1,
    ]);

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
      }
      if (radio1 === "2") {
        if (subRadio2 === "11") {
          setMaxi(120);
        }
        if (subRadio2 === "12") {
          setMaxi(1095);
        }
        if (subRadio2 === "13") {
          setMaxi(1825);
        }
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

    useEffect(() => {
      setSold(memoizedResult);
    }, [memoizedResult]);

    useEffect(() => {
      setExep(calculateTotalDurationForType2(congsAll));
    }, [congsAll]);

    console.log(sold);

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
              setAddVc2(true);
            }}
          >
            Ajouter sold Annuel
          </button>
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
          <div className="stats44">
            <div className="stats-card" id="llkiu44">
              <div className="card-nbr44" id="kkbyr44">
                {exep}
              </div>
              <p className="stat-year">Exceptionnel</p>
            </div>
            {sold.map((y) => (
              <div className="stats-card" key={y.year}>
                <div className="card-nbr44">{y.sold}</div>
                <p className="stat-year">{y.year}</p>
              </div>
            ))}
          </div>
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
                        <div className="label-text">Court durée (120 max)</div>
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
                        <div className="label-text">Moyen durée (3An max)</div>
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
                        <div className="label-text">Long durée (5An max)</div>
                      </label>
                    </div>
                  ) : null}
                </div>

                {(radio1 === "1" && subRadio1) ||
                (radio1 === "2" && subRadio2) ? (
                  <div className="insert-cong-new">
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
                        required
                        type="date"
                        className="input-vc44"
                        min={subRadio1 === "2" ? `${currentYear}-01-01` : ""}
                        max={subRadio1 === "2" ? `${currentYear}-12-31` : ""}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="group44">
                      <label className="lb-hh4">Date de demande</label>
                      <input
                        required
                        type="date"
                        min={subRadio1 === "2" ? `${currentYear}-01-01` : ""}
                        max={subRadio1 === "2" ? `${currentYear}-12-31` : ""}
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
                            <span className="custom-checkbox" id="jjk4"></span>
                          </label>
                        ) : null}
                        <input
                          disabled={
                            (subRadio1 === "1" && !check2) || subRadio1 !== "1"
                              ? true
                              : false
                          }
                          type="date"
                          required
                          min={subRadio1 === "2" ? `${currentYear}-01-01` : ""}
                          max={subRadio1 === "2" ? `${currentYear}-12-31` : ""}
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
                      <button
                        className="sub44"
                        id="annlll44"
                        onClick={(e) => {
                          e.preventDefault();
                          setAddVc(false);
                        }}
                      >
                        Annuler
                      </button>
                      <button
                        className="sub44"
                        type="submit"
                        disabled={total < 1 || total > maxi}
                      >
                        Submit
                      </button>
                    </div>
                    {congExist ? (
                      <div className="group44588" id="hh3">
                        Une période existe déjà pour cet employé. Veuillez
                        choisir une autre date.
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </form>
          ) : null}
          {addVc2 ? (
            <form className="add-vac-form" onSubmit={addConge2}>
              <div
                className="vac-exit55"
                onClick={(e) => {
                  e.preventDefault();
                  setAddVc2(false);
                }}
              >
                ×
              </div>
              <div className="khgjkfg4">
                <p className="jkezjf77">Ajouter sold</p>
              </div>
              <div className="insert-cong-new" id="kkurv44">
                <div className="group44">
                  <label className="lb-hh4">Année</label>
                  <input
                    type="number"
                    className="input-vc44"
                    min={2020}
                    max={currentYear - 1}
                    value={year3}
                    onChange={(e) => setYear3(e.target.valueAsNumber)}
                  />
                </div>
                <div className="group44">
                  <button
                    className="add-55"
                    id="kkli55"
                    onClick={(e) => {
                      e.preventDefault();
                      if (duration3 >= 2) {
                        setDuration3(duration3 - 1);
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
                    min={1}
                    max={
                      sold.find((y) => y.year === year3)
                        ? 22 - sold.find((y) => y.year === year3).sold
                        : 22
                    }
                    value={duration3}
                    onChange={(e) => setDuration3(e.target.valueAsNumber)}
                  />
                  <button
                    className="add-55"
                    id="kkli66"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        duration3 <
                        (sold.find((y) => y.year === year3)
                          ? 22 - sold.find((y) => y.year === year3).sold
                          : 22)
                      ) {
                        setDuration3(duration3 + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="group445" id="hhkl44">
                  <button className="sub44" id="annlll446" disabled>
                    Sold: {"  "}
                    {String(
                      sold.find((y) => y.year === year3)
                        ? 22 - sold.find((y) => y.year === year3).sold
                        : 22
                    ).padStart(2, "0")}
                  </button>
                  <button
                    className="sub44"
                    id="annlll44"
                    onClick={(e) => {
                      e.preventDefault();
                      setAddVc2(false);
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    className="sub44"
                    type="submit"
                    disabled={
                      duration3 < 1 ||
                      duration3 >
                        (sold.find((y) => y.year === year3)
                          ? 22 - sold.find((y) => y.year === year3).sold
                          : 22)
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          ) : null}
          <div className="list-cong44">
            {singleConj ? (
              <div className="singleConj">
                <div className="cong-card44">
                  <button
                    className="lopph4"
                    onClick={() => {
                      setSingleConj(null);
                    }}
                  >
                    ⨉
                  </button>
                  <div className="wwv44">
                    {singleConj.cancel === 1 ? (
                      <div className="bbk44">
                        <p className="kjyh5">
                          <MdOutlineCancel className="cllb44" />
                          &nbsp; Annuler !
                        </p>
                      </div>
                    ) : null}
                    <button
                      disabled={singleConj.decision !== 5}
                      className="sv1"
                    >
                      Valider
                    </button>
                    <button
                      disabled={singleConj.decision !== 4}
                      className="sv1"
                    >
                      Ressources humaines
                    </button>
                    <button
                      disabled={singleConj.decision !== 3}
                      className="sv1"
                    >
                      Le délégué
                    </button>
                    <button
                      disabled={singleConj.decision !== 2}
                      className="sv1"
                    >
                      Chef archaic
                    </button>
                    <button
                      disabled={singleConj.decision !== 1}
                      className="sv1"
                    >
                      Bureau d'ordre
                    </button>
                    <hr />
                    <meter min="0" max="5" value={singleConj.decision}></meter>
                    <span>
                      {singleConj.decision === 20
                        ? "100"
                        : (singleConj.decision / 5) * 100}
                      %
                    </span>
                    <button
                      disabled={singleConj.decision !== 20}
                      className="sv1"
                    >
                      Rejeter
                    </button>
                  </div>
                  <div className="wwv55">
                    <div className="vvbu1">
                      <span>N° Conngé: {singleConj.id}</span>
                      <span>Créé: {formatDateTime(singleConj.created_at)}</span>
                    </div>
                    <div className="vvbu1">
                      <span>
                        <span
                          className={
                            singleConj.type === 1
                              ? "vv1"
                              : singleConj.type === 2
                              ? "vv2"
                              : singleConj.type === 3
                              ? "vv3"
                              : singleConj.type === 11
                              ? "vv4"
                              : singleConj.type === 12
                              ? "vv5"
                              : singleConj.type === 13
                              ? "vv6"
                              : "vv10"
                          }
                          id="vv10"
                        >
                          {singleConj.type === 1
                            ? "Annuel"
                            : singleConj.type === 2
                            ? "Exceptionnel"
                            : singleConj.type === 3
                            ? "Autorisation d'absence"
                            : singleConj.type === 11
                            ? "Congé de Maladie C"
                            : singleConj.type === 12
                            ? "Congé de Maladie M"
                            : singleConj.type === 13
                            ? "Congé de Maladie L"
                            : "Else"}
                        </span>
                      </span>
                      {!singleConj.justification ? (
                        <span
                          className="bbklthk7"
                          id={
                            singleConj.justification === 1
                              ? "hhj7"
                              : singleConj.justification === 0
                              ? "hhj8"
                              : null
                          }
                        >
                          {singleConj.justification === 1
                            ? "Justifier"
                            : singleConj.justification === 0
                            ? "Non justifier"
                            : null}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="kknh55" id="booldy">
              <div className="suv-div44" id="S11">
                ID
              </div>
              <div className="suv-div44" id="S12">
                Decision
              </div>
              <div className="suv-div44" id="S13">
                Type
              </div>
              <div className="suv-div44" id="S14">
                Durée
              </div>
              <div className="suv-div44" id="S15">
                Date de demande
              </div>
              <div className="suv-div44" id="S16">
                Du
              </div>
              <div className="suv-div44" id="S17">
                Au
              </div>
              <div className="suv-div44" id="S18">
                Année
              </div>
            </div>
            {congsAll.map((c) => {
              return (
                <div
                  onClick={() => {
                    setSingleConj(c);
                  }}
                  className="kknh55"
                  id="klo4"
                  style={
                    c.cancel === 1 ? { border: "2px solid #d35848ca" } : null
                  }
                >
                  <div className="suv-div44" id="S11">
                    {c.id}
                    {c.cancel === 1 ? (
                      <span className="tgu44">&nbsp;&nbsp;Annuler</span>
                    ) : null}
                  </div>
                  <div className="suv-div44" id="S12">
                    <span
                      id="vv10"
                      className={
                        c.decision === 0
                          ? "nn1"
                          : c.decision === 1
                          ? "nn2"
                          : c.decision === 2
                          ? "nn3"
                          : c.decision === 3
                          ? "nn4"
                          : c.decision === 4
                          ? "nn5"
                          : c.decision === 5
                          ? "nn6"
                          : c.decision === 20
                          ? "nn20"
                          : null
                      }
                    >
                      {c.decision === 0
                        ? "En attente"
                        : c.decision === 1
                        ? "Bureau d'ordre"
                        : c.decision === 2
                        ? "Chef archaic"
                        : c.decision === 3
                        ? "Le délégué"
                        : c.decision === 4
                        ? "RH"
                        : c.decision === 5
                        ? "Valider"
                        : c.decision === 20
                        ? "Rejeter"
                        : c.decision}
                    </span>
                  </div>
                  <div className="suv-div44" id="S13">
                    <span
                      className={
                        c.type === 1
                          ? "vv1"
                          : c.type === 2
                          ? "vv2"
                          : c.type === 3
                          ? "vv3"
                          : c.type === 11
                          ? "vv4"
                          : c.type === 12
                          ? "vv5"
                          : c.type === 13
                          ? "vv6"
                          : "vv10"
                      }
                      id="vv10"
                    >
                      {c.type === 1
                        ? "Annuel"
                        : c.type === 2
                        ? "Exceptionnel"
                        : c.type === 3
                        ? "Autorisation d'absence"
                        : c.type === 11
                        ? "Congé de Maladie C"
                        : c.type === 12
                        ? "Congé de Maladie M"
                        : c.type === 13
                        ? "Congé de Maladie L"
                        : "Else"}
                    </span>
                  </div>
                  <div className="suv-div44" id="S14">
                    {c.demand_date === "0000-00-00" ? (
                      c.duration_1
                    ) : (
                      <>
                        {c.total_duration}
                        {c.cancel === 1 && (
                          <span className="tgu44">
                            &nbsp;&nbsp;&nbsp;{"(" + c.duration_after + ")"}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {c.demand_date === "0000-00-00" ? (
                    <div className="suv-div44" id="S40">
                      GG
                    </div>
                  ) : (
                    <>
                      <div className="suv-div44" id="S15">
                        {formatDate(c.demand_date)}
                      </div>
                      <div className="suv-div44" id="S16">
                        {formatDate(c.start_at)}
                      </div>
                      <div className="suv-div44" id="S17">
                        {formatDate(c.end_at)}
                      </div>
                    </>
                  )}
                  <div className="suv-div44" id="S18">
                    {c.year_1}
                    {c.year_2 ? " " + c.year_2 : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return <>{per ? <Person id={per} /> : <Allemp />}</>;
}

export default Employees;
