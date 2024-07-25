import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "../Style/vacation.css";

import { FiAlertOctagon } from "react-icons/fi";
import { VscDiffAdded } from "react-icons/vsc";

const Vacations = () => {
  const [ho, setHo] = useState([]);
  const [value1, onChange1] = useState(new Date());
  const currentYear = new Date().getFullYear();
  const years = [];

  const [filter1, setFilter1] = useState(currentYear);

  const [year, setYear] = useState("");
  const [dur, setDur] = useState("");
  const [dur1, setDur1] = useState("");
  const [nom, setNom] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [year1, setYear1] = useState("");
  const [dur2, setDur2] = useState("");
  const [nom1, setNom1] = useState("");
  const [start1, setStart1] = useState("");
  const [end1, setEnd1] = useState("");

  const [addvc, setAddvc] = useState(false);
  const [editorvc, setEditorvc] = useState(false);
  const [confvc, setConf] = useState(false);
  const [editvc, setEditvc] = useState();

  useEffect(() => {
    fetchHolids();
    setYear(filter1);
  }, [filter1]);

  useEffect(() => {
    if (start && end) {
      const sDate = new Date(start);
      const eDate = new Date(end);
      const tt = eDate - sDate;
      setDur(tt / 86400000 + 1);
      setDur1(tt / 86400000 + 1);
    }
  }, [start, end]);

  useEffect(() => {
    if (start1 && end1) {
      const sDate = new Date(start1);
      const eDate = new Date(end1);
      const tt = eDate - sDate;
      setDur2(tt / 86400000 + 1);
    }
  }, [start1, end1]);

  for (let i = currentYear - 3; i <= currentYear; i++) {
    years.push(i);
  }
  const months = Array.from({ length: 12 }, (_, i) => new Date(filter1, i, 1));

  const generateHolidayStyles = () => {
    const colors = [
      "#ff7e7e",
      "#5ee55e",
      "#9f9fff",
      "#d5d51b",
      "#de44ec",
      "#18bbbb",
      "#de7427",
      "#BEC6A0",
      "#DEAC80",
      "#73BBA3",
      "#8785A2",
      "#00ADB5",
      "#AAAAAA",
      "#EAE7B1",
      "#00A8CC",
      "#62D2A2",
      "#9BA4B4",
      "#EA907A",
    ];
    let styles = {};
    ho.forEach((holiday) => {
      const className = `holiday-${holiday.id}`;
      const color = colors[holiday.id % colors.length];
      styles[className] = { backgroundColor: color, color: "black" };
    });
    return styles;
  };

  const holidayStyles = generateHolidayStyles();

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        return "react-calendar__tile--weekend";
      }
      const holiday = ho.find(
        (holiday) =>
          new Date(holiday.start_date) <= date &&
          date <= new Date(holiday.end_date)
      );
      if (holiday) {
        return `react-calendar__tile--holiday holiday-${holiday.id}`;
      }
    }
    return null;
  };

  const fetchHolids = async () => {
    try {
      const response = await axios.get("http://localhost:7766/vac", {
        params: { year: filter1 },
      });
      setHo(response.data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const addVc = async (e) => {
    e.preventDefault();
    const sDate = new Date(start);
    const eDate = new Date(end);
    const tt = eDate - sDate;
    const dd = tt / 86400000 + 1;
    if (dd !== dur) {
      alert(
        "La durée que vous entrez n'est pas correcte, elle devrait être " + dur1
      );
      return;
    }
    try {
      const response = await axios.post("http://localhost:7766/vac", {
        year,
        start_date: start,
        duration: dur,
        end_date: end,
        hname: nom,
      });
      console.log(response.data);
      fetchHolids();
      setAddvc(false);
      setAddvc(true);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const updateHoliday = async (e) => {
    e.preventDefault();
    const gg = editvc.id;
    try {
      const response = await axios.put(`http://localhost:7766/vac/${gg}`, {
        year: year1,
        start_date: start1,
        duration: dur2,
        end_date: end1,
        hname: nom1,
      });
      console.log(response.data.message);
      fetchHolids();
      setEditvc();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Holiday not found:", error.response.data.error);
      } else {
        console.error("Error updating holiday:", error);
      }
    }
  };

  const deleteHoliday = async () => {
    const gg = editvc.id;
    try {
      const response = await axios.delete(`http://localhost:7766/vac/${gg}`);
      console.log(response.data.message);
      fetchHolids();
      setEditvc();
      setDur(1);
      setEnd("");
      setStart("");
      setNom("");
      setYear(filter1);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Holiday not found:", error.response.data.error);
      } else {
        console.error("Error deleting holiday:", error);
      }
    }
  };

  function formatDateToFrench(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const month = monthNames[date.getMonth()];
    return `${day.toString().padStart(2, "0")} - ${month}`;
  }

  return (
    <div className="vacations">
      <style>
        {Object.entries(holidayStyles)
          .map(
            ([className, style]) =>
              `.react-calendar__tile--holiday.${className} { background-color: ${style.backgroundColor}; color: ${style.color}; }`
          )
          .join("\n")}
      </style>
      <div className="user-list-header">
        <h3 className="user-header">Vacances</h3>
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
          className="add-user-btn"
          onClick={() => {
            setAddvc(true);
            setEditvc();
            setDur(1);
            setEnd("");
            setStart("");
            setNom("");
            setYear(filter1);
          }}
        >
          Ajouter une Vacance <VscDiffAdded className="add-icon" />
        </button>
      </div>
      <br />
      <hr />
      <br />
      <div className="kklr5">
        {addvc ? (
          <form className="add-vac" onSubmit={addVc}>
            <div className="fgigtg5">Ajouter une vacance</div>
            <div className="add-vc33">
              <label className="vc-lb">Année</label>
              <select
                className="vc-inp"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                }}
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-vc33">
              <label className="vc-lb">Nom</label>
              <input
                className="vc-inp"
                type="text"
                value={nom}
                onChange={(e) => {
                  setNom(e.target.value);
                }}
                required
              />
            </div>
            <div className="add-vc33">
              <label className="vc-lb">Durée</label>
              <input
                className="vc-inp"
                type="number"
                value={dur}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d+$/.test(value) || value === "") {
                    setDur(value);
                  }
                }}
                min={1}
                max={999}
                required
              />
            </div>
            <div className="add-vc33">
              <label className="vc-lb">Date début</label>
              <input
                className="vc-inp"
                type="date"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                }}
                min={`${filter1}-01-01`}
                max={`${filter1}-12-31`}
                required
              />
            </div>
            <div className="add-vc33">
              <label className="vc-lb">Date fin</label>
              <input
                className="vc-inp"
                type="date"
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                }}
                min={start}
                max={`${filter1}-12-31`}
                required
                disabled={start ? false : true}
              />
            </div>
            <div className="add-vc333">
              <button className="add-vc" id="add-vc" type="submit">
                Ajouter
              </button>
              <button
                className="add-vc"
                id="can-vc"
                onClick={(e) => {
                  e.preventDefault();
                  setAddvc(false);
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        ) : null}
        {editvc ? (
          <form className="add-vac" onSubmit={updateHoliday}>
            {confvc ? (
              <div className="conf12345">
                <div className="conf-card12345">
                  <div className="text1234567">
                    <FiAlertOctagon className="ccclm5" />
                    <p className="llmo4">Confirmation de la suppression</p>
                  </div>
                  <div className="text12345">
                    <button
                      className="jjkl4"
                      id="confirm12345"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteHoliday();
                      }}
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setConf(false);
                      }}
                      className="jjkl4"
                      id="cancel12345"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="fgigtg5">Examiner les vacances</div>
            <button
              className="exit66"
              onClick={(e) => {
                e.preventDefault();
                setEditvc();
              }}
            >
              ×
            </button>
            <div className="add-vc33">
              <label className="vc-lb">Année</label>
              <select
                disabled={editorvc ? false : true}
                className="vc-inp"
                value={year1}
                onChange={(e) => {
                  setYear1(e.target.value);
                }}
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-vc33">
              <label className="vc-lb">Nom</label>
              <input
                disabled={editorvc ? false : true}
                className="vc-inp"
                type="text"
                value={nom1}
                onChange={(e) => {
                  setNom1(e.target.value);
                }}
                required
              />
            </div>
            <div className="add-vc33">
              <label className="vc-lb">Durée</label>
              <input
                disabled={editorvc ? false : true}
                className="vc-inp"
                type="number"
                value={dur2}
                onChange={(e) => {
                  setDur2(e.target.value);
                }}
                min={1}
                max={999}
                required
              />
            </div>
            <div className="add-vc33">
              <label className="vc-lb">Date début</label>
              <input
                disabled={editorvc ? false : true}
                className="vc-inp"
                type="date"
                value={start1}
                onChange={(e) => {
                  setStart1(e.target.value);
                }}
                min={`${filter1}-01-01`}
                max={`${filter1}-12-31`}
                required
              />
            </div>
            <div className="add-vc33">
              <label className="vc-lb">Date fin</label>
              <input
                className="vc-inp"
                type="date"
                value={end1}
                onChange={(e) => {
                  setEnd1(e.target.value);
                }}
                min={start1}
                max={`${filter1}-12-31`}
                required
                disabled={start1 && editorvc ? false : true}
              />
            </div>
            <div className="add-vc333">
              {editorvc ? (
                <>
                  <button className="add-vc" id="add-vc1233" type="submit">
                    Confirmer
                  </button>
                  <button
                    className="add-vc"
                    id="can-vc"
                    onClick={(e) => {
                      e.preventDefault();
                      setDur2(editvc.duration);
                      setEnd1(editvc.end_date);
                      setStart1(editvc.start_date);
                      setNom1(editvc.hname);
                      setYear1(editvc.year);
                      setEditorvc(false);
                    }}
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEditorvc(true);
                    }}
                    className="add-vc"
                    id="add-vc654"
                  >
                    Modifier
                  </button>
                  <button
                    className="add-vc"
                    id="can-vc4sdds876"
                    onClick={(e) => {
                      e.preventDefault();
                      setConf(true);
                    }}
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </form>
        ) : null}
        <div className="vacations-show">
          <div className="vac-list">
            {ho.length > 0 ? (
              ho.map((vc) => {
                // const holidayClass = `holiday-${vc.hname
                //   .replace(/\s+/g, "-")
                //   .toLowerCase()}`;
                return (
                  <div
                    className={`bnk123 holiday-${vc.id}`}
                    style={holidayStyles[`holiday-${vc.id}`]}
                    onDoubleClick={() => {
                      setEditvc(vc);
                      setAddvc(false);
                      setDur2(vc.duration);
                      setEnd1(vc.end_date);
                      setStart1(vc.start_date);
                      setNom1(vc.hname);
                      setYear1(vc.year);
                      setEditorvc(false);
                      setConf(false);
                    }}
                  >
                    <h4 className="hklh12">{vc.hname}</h4>
                    <div className="vc1234">
                      <div key={vc.id} className="vc-card11">
                        <p className="star-vc">
                          {formatDateToFrench(vc.start_date)}
                        </p>
                        <p className="star-vc">
                          {formatDateToFrench(vc.end_date)}
                        </p>
                      </div>
                      <h4 className="dure11">{vc.duration}</h4>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="bdkhu5">
                Il n'y a pas de jours fériés ajoutés cette année
              </p>
            )}
          </div>
          <div className="calendar-grid">
            {months.map((month, index) => (
              <div key={index} className="calendar-month">
                <h4 className="month-name">
                  {month.toLocaleString("fr-FR", { month: "long" })}
                </h4>
                <Calendar
                  onChange={onChange1}
                  value={value1}
                  view="month"
                  minDate={month}
                  tileClassName={tileClassName}
                  maxDate={
                    new Date(month.getFullYear(), month.getMonth() + 1, 0)
                  }
                  locale="fr-FR"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vacations;
