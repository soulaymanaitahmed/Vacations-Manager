import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "../Style/vacation.css";

const Vacations = () => {
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

  for (let i = currentYear - 3; i <= currentYear + 1; i++) {
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
          new Date(holiday.start_date).setHours(0, 0, 0, 0) <=
            date.setHours(0, 0, 0, 0) &&
          date.setHours(0, 0, 0, 0) <=
            new Date(holiday.end_date).setHours(0, 0, 0, 0)
      );
      if (holiday) {
        return `react-calendar__tile--holiday holiday-${holiday.id}`;
      }
    }
    return null;
  };

  const fetchHolids = async () => {
    try {
      const response = await axios.get(`${baseURL}/vac`, {
        params: { year: filter1 },
      });
      setHo(response.data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
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
      <div className="user-list-header19">
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
      </div>
      <br />
      <hr />
      <br />
      <div className="kklr5">
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
