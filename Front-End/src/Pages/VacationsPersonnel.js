import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "../Style/vacation.css";

import { baseURL } from "../config";

const VacationsPersonnel = () => {
  const { id } = useParams();
  const dd = id / 45657;

  const [ho, setHo] = useState([]);
  const [value1, onChange1] = useState(new Date());
  const currentYear = new Date().getFullYear();
  const years = [];

  const [filter1, setFilter1] = useState(currentYear);

  useEffect(() => {
    fetchHolids();
  }, [filter1]);

  for (let i = currentYear - 3; i <= currentYear + 1; i++) {
    years.push(i);
  }
  const months = Array.from({ length: 12 }, (_, i) => new Date(filter1, i, 1));

  const generateHolidayStyles = () => {
    const typeColors = {
      1: "#ff7e7e",
      2: "#5ee55e",
      3: "#9f9fff",
      11: "#d5d51b",
      12: "#de44ec",
      13: "#18bbbb",
      21: "#de7427",
      22: "#BEC6A0",
      default: "#AAAAAA",
    };

    let styles = {};
    ho.forEach((holiday) => {
      const className = `holiday-${holiday.id}`;
      const color = typeColors[holiday.type] || typeColors.default;
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
          new Date(holiday.start_at).setHours(0, 0, 0, 0) <=
            date.setHours(0, 0, 0, 0) &&
          date.setHours(0, 0, 0, 0) <=
            new Date(holiday.end_at).setHours(0, 0, 0, 0)
      );
      if (holiday) {
        return `react-calendar__tile--holiday holiday-${holiday.id}`;
      }
    }
    return null;
  };

  const fetchHolids = async () => {
    try {
      const response = await axios.get(`${baseURL}/vac-pers/${dd}`, {
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
          <div className="calendar-grid olpo5">
            {months.map((month, index) => (
              <div key={index} className="calendar-month" id="koiy44">
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

export default VacationsPersonnel;
