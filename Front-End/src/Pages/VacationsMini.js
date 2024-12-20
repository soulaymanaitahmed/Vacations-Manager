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

  useEffect(() => {
    fetchHolids();
  }, []);

  for (let i = currentYear - 3; i <= currentYear; i++) {
    years.push(i);
  }
  const months = Array.from(
    { length: 12 },
    (_, i) => new Date(currentYear, i, 1)
  );

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
        params: { year: currentYear },
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
      <div className="user-list-header">
        <h3 className="user-header">Calendrier {currentYear}</h3>
      </div>
      <br />
      <hr />
      <br />
      <div className="kklr5">
        <div className="vacations-show">
          <div className="vac-list">
            {ho.length > 0 ? (
              ho.map((vc) => {
                return (
                  <div
                    className={`bnk1234 holiday-${vc.id}`}
                    style={holidayStyles[`holiday-${vc.id}`]}
                    id="lllnhggh99999"
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
