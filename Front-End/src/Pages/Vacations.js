import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "../Style/vacation.css";

import { VscDiffAdded } from "react-icons/vsc";

const Vacations = () => {
  const [ho, setHo] = useState([]);
  const [value1, onChange1] = useState(new Date());
  const currentYear = new Date().getFullYear();
  const years = [];

  const [filter1, setFilter1] = useState(currentYear);

  const [year, setYear] = useState("");
  const [dur, setDur] = useState("");
  const [nom, setNom] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [addvc, setAddvc] = useState(false);

  useEffect(() => {
    if (addvc == false) {
      setDur(1);
      setEnd("");
      setStart("");
      setNom("");
      setYear(filter1);
    }
  }, [addvc]);

  for (let i = currentYear - 3; i <= currentYear; i++) {
    years.push(i);
  }
  const months = Array.from({ length: 12 }, (_, i) => new Date(filter1, i, 1));

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
        return "react-calendar__tile--holiday";
      }
    }
    return null;
  };

  useEffect(() => {
    fetchHolids();
    setAddvc(false);
    setYear(filter1);
  }, [filter1]);

  useEffect(() => {
    const sDate = new Date(start);
    const eDate = new Date(end);
    const tt = eDate - sDate;
    setDur(tt / 86400000 + 1);
  }, [start, end]);

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
            setAddvc(!addvc);
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
              <label className="vc-lb">Duré</label>
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
                onChange={(e) => {
                  setEnd(e.target.value);
                }}
                min={start}
                max={`${filter1}-12-31`}
                required
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
        <div className="vacations-show">
          <div className="vac-list">
            {ho.length > 0 ? (
              ho.map((vc) => {
                return (
                  <div className="bnk123">
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
