import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import PrintComponent from "./PrintComponent";
import "../Style/dashboard.css";

import { VscInspect } from "react-icons/vsc";

function Dashboardd(props) {
  const tpp = props.type;

  const [requests, setRequests] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
    fetchRequests();
  }, []);

  useEffect(() => {
    const selectableRequests = requests.filter(
      (r) => r.decision === tpp && r.cancel !== 2
    );
    setSelectAll(
      selectedIds.length === selectableRequests.length &&
        selectableRequests.length > 0
    );
  }, [selectedIds, requests, tpp]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const printRefs = useRef([]);
  const handlePrint = useReactToPrint({
    content: () => printRefs.current[printRefs.current.index],
  });
  const onPrintClick = useCallback(
    (index) => {
      printRefs.current.index = index;
      handlePrint();
    },
    [handlePrint]
  );

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((selectedId) => selectedId !== id)
        : [...prevIds, id]
    );
  };

  const handleSelectAll = () => {
    const selectableRequests = requests.filter(
      (r) => r.decision === tpp && r.cancel !== 2
    );
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectableRequests.map((r) => r.id));
    }
  };

  const updateSelectedRequests = async (des) => {
    try {
      await axios.put(`${baseURL}/updateRequests`, {
        ids: selectedIds,
        type: tpp,
        acc: des,
      });
      fetchRequests();
      setSelectedIds([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error updating requests:", error);
    }
  };

  const changeDecision = async (idd) => {
    try {
      await axios.put(`${baseURL}/changeDecision`, {
        id: idd,
        type: tpp,
      });
      fetchRequests();
      setSelectedIds([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error changing decision:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dash-actions">
        <div className="dash-names hd5468">
          <span className="dsh8764 dsh11">
            <input
              id="selectAllCheckbox"
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </span>
          <span className="dsh8764 dsh12">Nom</span>
          <span className="dsh8764 dsh13">Type</span>
          <span className="dsh8764 dsh14">Durée</span>
          <span className="dsh8764 dsh15">Du</span>
          <span className="dsh8764 dsh16">Au</span>
          <span className="dsh8764 dsh17">Link</span>
        </div>
        {requests.map((r, index) => {
          const isChecked = selectedIds.includes(r.id);
          return (
            <div key={r.id} className="dash-names childs44">
              <span className="dsh8764 dsh11">
                {r.cancel === 2 ? (
                  <p className="kkfdyj665">Annuler</p>
                ) : r.decision > tpp && r.decision < 10 ? (
                  <span className="val-dsh55">✔</span>
                ) : r.decision >= 20 ? (
                  <span
                    className="val-dsh555"
                    onClick={() => changeDecision(r.id)}
                  >
                    ✖
                  </span>
                ) : r.decision === tpp ? (
                  <input
                    id={`checkbox-${r.id}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(r.id)}
                  />
                ) : (
                  "--"
                )}
              </span>
              <span className="dsh8764 dsh12">{r.prenom + " - " + r.nom}</span>
              <span className="dsh8764 dsh13">
                {typeLabels[r.type] || "Else"}
              </span>
              <span className="dsh8764 dsh14">{r.total_duration}</span>
              <span className="dsh8764 dsh15">{formatDate(r.start_at)}</span>
              <span className="dsh8764 dsh16">{formatDate(r.end_at)}</span>
              <span className="dsh8764 dsh17">
                <VscInspect
                  className="go-to44"
                  onClick={() => {
                    window.location.href = `/personnels/${r.per_id}`;
                  }}
                />
                {/* {r.decision === 5 ? (
                  <>
                    <button onClick={() => onPrintClick(index)}>Print</button>
                    <div style={{ display: "none" }}>
                      <PrintComponent
                        ref={(el) => (printRefs.current[index] = el)}
                        data={r}
                      />
                    </div>
                  </>
                ) : null} */}
              </span>
            </div>
          );
        })}
        {requests.length > 0 ? (
          <div className="actions-btn">
            <button
              className="ddh-btn valdsh2"
              onClick={() => updateSelectedRequests(0)}
              disabled={selectedIds.length === 0}
            >
              Rejeter
            </button>
            <button
              className="ddh-btn valdsh1"
              onClick={() => updateSelectedRequests(1)}
              disabled={selectedIds.length === 0}
            >
              Valider
            </button>
          </div>
        ) : (
          <p className="nodata">
            Il n'y a aucune demande pour vous en ce moment.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboardd;
