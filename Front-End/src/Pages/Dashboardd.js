import React, { useEffect, useState } from "react";
import axios from "axios";

import "../Style/dashboard.css";

function Dashboardd(props) {
  const tpp = props.type;
  const currentYear = new Date().getFullYear();

  const [totalEmployees, setTotalEmployees] = useState([]);
  const [requests, setRequests] = useState([]);

  const typeLabels = {
    1: "Annuel",
    2: "Exceptionnel",
    3: "Aut d'absence",
    11: "C-Maladie C",
    12: "C-Maladie M",
    13: "C-Maladie L",
  };

  const getBaseURL = () => {
    const { protocol, hostname } = window.location;
    const port = 7766;
    return `${protocol}//${hostname}:${port}`;
  };
  const baseURL = getBaseURL();

  const fetchVacations = async () => {
    try {
      const response = await axios.get(`${baseURL}/vacationstotal`, {
        params: { year: currentYear },
      });
      setTotalEmployees(response.data);
    } catch (error) {
      console.error("Error fetching vacations:", error);
    }
  };
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${baseURL}/filteredVacations`, {
        params: { type: tpp },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchVacations();
    fetchRequests();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  console.log(tpp);

  return (
    <div className="dashboard">
      <div className="dash-stats">
        {totalEmployees.map((item, index) => {
          const [type, total] = Object.entries(item)[0];
          const formattedTotal = total.toString().padStart(2, "0");
          const label = typeLabels[type] || "Else";

          return (
            <div key={index} className="dash-card77">
              <span className="tit-dash1">{label}</span>
              <span className="tit-dash2">{formattedTotal}</span>
            </div>
          );
        })}
      </div>
      <br />
      <br />
      <div className="dash-lists">
        <div className="dash-actions">
          <div className="dash-names hd5468">
            <span className="dsh876 dsh11">
              <input id="checkbox" type="checkbox" />
            </span>
            <span className="dsh876 dsh12">Nom</span>
            <span className="dsh876 dsh13">Type</span>
            <span className="dsh876 dsh14">Durée</span>
            <span className="dsh876 dsh15">Du</span>
            <span className="dsh876 dsh16">Au</span>
          </div>
          {requests.map((r) => {
            return (
              <div className="dash-names childs44">
                <span className="dsh8764 dsh11">
                  {r.decision === tpp ? (
                    <span className="val-dsh55">✔</span>
                  ) : r.decision === 20 + tpp ? (
                    <span className="val-dsh555">✖</span>
                  ) : (
                    <input id="checkbox" type="checkbox" />
                  )}
                </span>
                <span className="dsh8764 dsh12">
                  {r.prenom + " - " + r.nom}
                </span>
                <span className="dsh8764 dsh13">
                  {r.type === 1
                    ? "Annuel"
                    : r.type === 2
                    ? "Exceptionnel"
                    : r.type === 3
                    ? "Aut d'absence"
                    : r.type === 11
                    ? "C-Maladie C"
                    : r.type === 12
                    ? "C-Maladie M"
                    : r.type === 13
                    ? "C-Maladie L"
                    : "Else"}
                </span>
                <span className="dsh8764 dsh14">{r.total_duration}</span>
                <span className="dsh8764 dsh15">{formatDate(r.start_at)}</span>
                <span className="dsh8764 dsh16">{formatDate(r.end_at)}</span>
              </div>
            );
          })}
          <div className="actions-btn">
            <button className="ddh-btn valdsh2">Rejeter</button>
            <button className="ddh-btn valdsh1">Valider</button>
          </div>
        </div>
        <div className="dash-aout">Out</div>
      </div>
    </div>
  );
}

export default Dashboardd;
