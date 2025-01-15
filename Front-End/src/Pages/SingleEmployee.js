import {
  React,
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  parseISO,
  addDays,
  isSaturday,
  isSunday,
  isWithinInterval,
  isValid,
} from "date-fns";

import { BiMessageSquareAdd } from "react-icons/bi";
import { MdLocalPrintshop } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { HiBellAlert } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa";

import PrintComponent from "./PrintComponent";
import PrintComponent2 from "./PrintComponent2";
import VacationsMini from "./VacationsMini";
import "../Style/employee.css";

function SingleEmployee(props) {
  const tp = props.type;

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

  const { id } = useParams();
  const dd = id / 45657;

  const [cal, setCal] = useState(false);

  const currentYear = new Date().getFullYear();

  const [addVc, setAddVc] = useState(false);
  const [addVc2, setAddVc2] = useState(false);

  const [congExist, setCongExist] = useState(false);

  const [radio1, setRadio1] = useState("");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check8, setCheck8] = useState(false);

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
  const [filter2, setFilter2] = useState(20);
  const years = [];

  const [person, setPerson] = useState([]);
  const [holids, setHolids] = useState([]);
  const [congsAll, setCongsAll] = useState([]);
  const [filCongsAll, setFilCongsAll] = useState([]);
  const [sold, setSold] = useState([]);

  const [singleConj, setSingleConj] = useState(null);

  const [year3, setYear3] = useState(currentYear - 1);
  const [duration3, setDuration3] = useState(1);

  const [exep, setExep] = useState(0);
  const [abs, setAbs] = useState(0);

  const [noMore, setNoMore] = useState(false);

  const memoizedResult = useMemo(() => {
    const yearTotals = {};

    congsAll.forEach((c) => {
      if (c.type === 1 && c.cancel !== 2 && c.decision === 5) {
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

    return Object.keys(yearTotals)
      .map((year) => ({
        year: parseInt(year),
        sold: yearTotals[year],
      }))
      .sort((a, b) => b.year - a.year);
  }, [congsAll]);

  useEffect(() => {
    fetchEmployee();
    fetchHolids();
    fetchCongeData();
  }, []);

  const fetchHolids = async () => {
    try {
      const response = await axios.get(`${baseURL}/vac`, {
        params: { year: filter1 },
      });
      setHolids(response.data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`${baseURL}/employee/${dd}`);
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
    let type = radio1 === "1" ? subRadio1 : subRadio2;
    let durationValue = duration;
    if (radio1 === "3") {
      durationValue = 98;
      type = 21;
    } else if (radio1 === "4") {
      durationValue = 15;
      type = 22;
    }
    const year_1 = subRadio1 === "1" ? year : currentYear;
    const year_2 = check1 ? secondYear : null;
    const duration_2 = check1 ? secondDuration : null;
    const justificationValue = radio1 === "2" ? justification : null;
    const quit = type === "1" ? check8 : 0;
    const data = {
      dd,
      type,
      total,
      year_1,
      duration_1: durationValue,
      year_2,
      duration_2,
      startDate,
      endDate,
      requestDate,
      justification: justificationValue,
      quit,
    };
    try {
      const response = await axios.post(`${baseURL}/add-conge`, data);
      console.log("Conge record inserted successfully:", response.data);
      setCongExist(false);
      setAddVc(false);
      fetchCongeData();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setCongExist(
          "Une période existe déjà pour cet employé. Veuillez choisir une autre date."
        );
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
      const response = await axios.post(`${baseURL}/add-sold`, data);
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
      const response = await axios.get(`${baseURL}/conge/${dd}`);
      setCongsAll(response.data);
    } catch (error) {
      console.error("Error fetching conge data:", error);
    }
  };

  const cancel = async (id) => {
    try {
      const response = await axios.put(`${baseURL}/update-conge-cancel/${id}`);
      fetchCongeData();
      setSingleConj(false);
    } catch (error) {
      console.error("Error updating conge record:", error);
    }
  };

  const updateSelectedRequest = async (des) => {
    try {
      await axios.put(`${baseURL}/updateRequest`, {
        id: singleConj.id,
        type: tp,
        acc: des,
      });
      fetchCongeData();
      setSingleConj(null);
    } catch (error) {
      console.error("Error updating request:", error);
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
      if (c.type === 2 && c.cancel !== 2 && c.decision === 5) {
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
  const calculateTotalDurationForType3 = (congsAll) => {
    const currentYear = new Date().getFullYear();
    let totalDuration = 0;

    congsAll.forEach((c) => {
      if (c.type === 3 && c.cancel !== 2 && c.decision === 5) {
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

  for (let i = currentYear; i >= currentYear - 3; i--) {
    years.push(i);
  }

  const printRefs = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRefs.current,
  });
  const onPrintClick = useCallback(() => {
    handlePrint();
  }, [handlePrint]);

  const printRefs1 = useRef(null);

  const handlePrint1 = useReactToPrint({
    content: () => printRefs1.current,
  });
  const onPrintClick1 = useCallback(() => {
    handlePrint1();
  }, [handlePrint1]);

  useEffect(() => {
    setAddVc2(false);
    setDuration(1);
    setStartDate("");
    setRequestDate("");
    setEndDate("");
    setCheck1(false);
    setCheck2(false);
    setCheck8(false);
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
        const maxEndDate = new Date(currentYear, 11, 31);
        const adjustedDuration = Math.max(
          0,
          Math.floor((maxEndDate - start) / (1000 * 60 * 60 * 24)) + 1
        );
        end = new Date(start);
        end.setDate(start.getDate() + Math.min(duration - 1, adjustedDuration));
        setEndDate(end.toISOString().split("T")[0]);
        setDuration(Math.min(duration, adjustedDuration));
      } else {
        end = new Date(start);
        end.setDate(start.getDate() + duration - 1);
        setEndDate(end.toISOString().split("T")[0]);
      }
      if (radio1 === "3") {
        end = new Date(start);
        end.setDate(start.getDate() + 98 - 1);
        setEndDate(end.toISOString().split("T")[0]);
      } else if (radio1 === "4") {
        end = new Date(start);
        end.setDate(start.getDate() + 15 - 1);
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
    radio1, // Ensure radio1 is in dependency array
  ]);

  useEffect(() => {
    if (radio1 === "1") {
      if (subRadio1 === "1") {
        setMaxi(22);
      }
      if (subRadio1 === "2") {
        setMaxi(10 - exep);
      }
      if (subRadio1 === "3") {
        setMaxi(3 - abs);
      }
    }
    if (radio1 === "2") {
      if (subRadio2 === "11") {
        setMaxi(90);
      }
      if (subRadio2 === "12") {
        setMaxi(1095);
      }
      if (subRadio2 === "13") {
        setMaxi(1825);
      }
      if (radio1 === "3") {
        if (subRadio2 === "21") {
          setMaxi(98);
        }
        if (subRadio2 === "22") {
          setMaxi(15);
        }
      }
    }
  }, [subRadio1, subRadio2, radio1]);

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
    setCheck8(false);
    setSecondDuration(1);
  }, [subRadio1, subRadio2, radio1]);

  useEffect(() => {
    setSold(memoizedResult);
  }, [memoizedResult]);

  useEffect(() => {
    setExep(calculateTotalDurationForType2(congsAll));
    setAbs(calculateTotalDurationForType3(congsAll));
  }, [congsAll]);

  useEffect(() => {
    const today = new Date().toISOString();
    const shouldSetNoMore = congsAll.some(
      (cong) => cong.end_at >= today && cong.cancel !== 2 && cong.decision === 5
    );
    if (shouldSetNoMore) {
      setNoMore(true);
    } else {
      setNoMore(false);
    }
  }, [congsAll]);

  useEffect(() => {
    if (congsAll.length > 0 || filter2 !== 20) {
      const filteredConges = congsAll.filter((conge) => {
        const startYear = new Date(conge.start_at).getFullYear();
        const endYear = new Date(conge.end_at).getFullYear();
        return startYear === filter2 || endYear === filter2;
      });
      setFilCongsAll(filteredConges);
    }
    if (filter2 === 20) {
      setFilCongsAll(congsAll);
    }
  }, [congsAll, filter2]);

  return (
    <div className="personel">
      <div className="user-list-header">
        <div className="mokdfn6">
          {tp !== 15 ? (
            <button
              className="back"
              onClick={() => {
                window.location.href = `/personnels`;
              }}
            >
              ◀
            </button>
          ) : null}
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
            value={filter2}
            onChange={(e) => {
              setFilter2(Number(e.target.value));
            }}
          >
            <option value={20}>Toutes</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {tp !== 15 ? (
          <button
            className="minidash33"
            onClick={() => {
              setAddVc2(true);
            }}
          >
            Ajouter sold Annuel
          </button>
        ) : null}
        <button
          className="minidash33"
          onClick={() => {
            setAddVc(true);
          }}
          disabled={noMore}
        >
          Demande de congé <BiMessageSquareAdd className="add4564" />
        </button>
      </div>
      <br />
      <hr />
      <br />
      <div className="person77">
        {cal ? (
          <div className="calendar45">
            <div
              className="vac-exit55"
              onClick={(e) => {
                e.preventDefault();
                setCal(false);
              }}
            >
              ×
            </div>
            <VacationsMini />
          </div>
        ) : null}
        <div className="stats44">
          <div className="stats-card" id="llkiu44">
            <div className="card-nbr44" id="kkbyr44">
              {exep}
            </div>
            <p className="stat-year">Exceptionnel</p>
          </div>
          <div className="stats-card" id="llkiu444">
            <div className="card-nbr44" id="kkbyr444">
              {abs}
            </div>
            <p className="stat-year">Aut d'absence</p>
          </div>
          {sold.map((y) => (
            <div className="stats-card" key={y.year}>
              <div className="card-nbr44">{y.sold}</div>
              <p className="stat-year">{y.year}</p>
            </div>
          ))}
          {!cal ? (
            <button className="showhid55" onClick={() => setCal(true)}>
              <FaCalendarAlt className="hideshow45" />
            </button>
          ) : null}
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
                      <div className="label-text">Court durée (90 max)</div>
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
                {person.gander === 1 ? (
                  <label className="label">
                    <input
                      value="3"
                      name="value-radio"
                      id="value-1"
                      className="radio-input"
                      type="radio"
                      onChange={(e) => setRadio1(e.target.value)}
                      checked={radio1 === "3"}
                    />
                    <div className="radio-design"></div>
                    <div className="label-text">Congé de Maternité</div>
                  </label>
                ) : person.gander === 0 ? (
                  <label className="label">
                    <input
                      value="4"
                      name="value-radio"
                      id="value-1"
                      className="radio-input"
                      type="radio"
                      onChange={(e) => setRadio1(e.target.value)}
                      checked={radio1 === "4"}
                    />
                    <div className="radio-design"></div>
                    <div className="label-text">Congé de Paternité</div>
                  </label>
                ) : null}
              </div>

              {(radio1 === "1" && subRadio1) ||
              (radio1 === "2" && subRadio2) ||
              radio1 === "3" ||
              radio1 === "4" ? (
                <div className="insert-cong-new">
                  {radio1 === "3" || radio1 === "4" ? null : (
                    <div className="group44">
                      <div className="dfgkjkfdgdkf4">
                        {subRadio1 === "1" ? (
                          <div className="group44">
                            <label className="lb-hh4">Année</label>
                            <input
                              type="number"
                              className="input-vc44"
                              min={2020}
                              max={currentYear}
                              value={year}
                              onChange={(e) => setYear(e.target.value)}
                            />
                          </div>
                        ) : null}
                        <div
                          className="group44"
                          id={
                            subRadio1 === "2" ||
                            subRadio1 === "3" ||
                            radio1 === "2"
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
                  )}
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
                  {radio1 === "3" || radio1 === "4" ? (
                    <div className="group44"></div>
                  ) : (
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
                  )}
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
                    <>
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
                                max={currentYear - 1}
                                value={secondYear}
                                onChange={(e) =>
                                  setSecondYear(Number(e.target.value))
                                }
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
                                if (total < maxi) {
                                  setSecondDuration(secondDuration + 1);
                                }
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="group44"></div>
                      <div className="group4444">
                        <div className="kklfkd5">
                          {subRadio1 === "1" ? (
                            <label>
                              <input
                                type="checkbox"
                                className="input"
                                checked={check8}
                                onChange={(e) => setCheck8(e.target.checked)}
                              />
                              <span
                                className="custom-checkbox"
                                id="jjk4"
                              ></span>
                            </label>
                          ) : null}
                          <label className="ham55">
                            Avec autorisation de quitter le territoire
                          </label>
                        </div>
                      </div>
                    </>
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
                      {congExist}
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
                  {singleConj.cancel === 2 ? (
                    <div className="bbk44">
                      <p className="kjyh5">
                        <MdOutlineCancel className="cllb44" />
                        &nbsp; Demande annulée !
                      </p>
                    </div>
                  ) : null}
                  <button disabled={singleConj.decision !== 5} className="sv1">
                    Valider
                  </button>
                  <button disabled={singleConj.decision !== 4} className="sv1">
                    Ressources humaines{" "}
                    {singleConj.decision >= 4 || singleConj.decision >= 24 ? (
                      <FaCheck className="nvbhtu55" />
                    ) : null}
                  </button>
                  <button disabled={singleConj.decision !== 3} className="sv1">
                    Le délégué{" "}
                    {singleConj.decision >= 3 || singleConj.decision >= 23 ? (
                      <FaCheck className="nvbhtu55" />
                    ) : null}
                  </button>
                  <button disabled={singleConj.decision !== 2} className="sv1">
                    Chef archaic{" "}
                    {singleConj.decision >= 2 || singleConj.decision >= 22 ? (
                      <FaCheck className="nvbhtu55" />
                    ) : null}
                  </button>
                  <button disabled={singleConj.decision !== 1} className="sv1">
                    Bureau d'ordre{" "}
                    {singleConj.decision >= 1 || singleConj.decision >= 21 ? (
                      <FaCheck className="nvbhtu55" />
                    ) : null}
                  </button>
                  <hr />
                  <meter min="0" max="5" value={singleConj.decision}></meter>
                  <span>
                    {singleConj.decision > 20
                      ? "100"
                      : (singleConj.decision / 5) * 100}
                    %
                  </span>
                  <button
                    disabled={singleConj.decision < 20}
                    className="sv1"
                    id="kklop55"
                  >
                    Rejeter
                  </button>
                </div>
                <div className="wwv55">
                  <div className="vvbu1">
                    <span>
                      N° Conngé: <span className="fos44">{singleConj.id}</span>
                    </span>
                    <span>
                      Créé:{" "}
                      <span className="fos44">
                        {formatDateTime(singleConj.created_at)}
                      </span>
                    </span>
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
                            : singleConj.type === 21
                            ? "vv7"
                            : singleConj.type === 22
                            ? "vv8"
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
                          : singleConj.type === 21
                          ? "Congé de Maternité"
                          : singleConj.type === 22
                          ? "Congé de Paternité"
                          : "Else"}
                      </span>
                    </span>
                    {!singleConj.justification &&
                    (singleConj.type === 11 ||
                      singleConj.type === 12 ||
                      singleConj.type === 13) ? (
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
                    {singleConj.type === 1 ? (
                      <span
                        className="bbklthk7"
                        id={
                          singleConj.quitter === 1
                            ? "hhj7"
                            : singleConj.quitter === 0
                            ? "hhj8"
                            : null
                        }
                      >
                        {singleConj.quitter === 1
                          ? "Avec autorisation de quitter le territoire"
                          : singleConj.quitter === 0
                          ? "Sans autorisation de quitter le territoire"
                          : null}
                      </span>
                    ) : null}
                  </div>
                  <div className="vvbu1">
                    <span>
                      Du:{" "}
                      <span className="fos44">
                        {formatDate(singleConj.start_at)}
                      </span>
                    </span>
                    <span>
                      Au:{" "}
                      <span className="fos44">
                        {formatDate(singleConj.end_at)}
                      </span>
                    </span>
                  </div>
                  <div className="vvbu1">
                    <span>
                      Année: <span className="fos44">{singleConj.year_1}</span>
                    </span>
                    <span>
                      Durée:{" "}
                      <span className="fos44">{singleConj.duration_1}</span>
                    </span>
                  </div>
                  {singleConj.year_2 ? (
                    <div className="vvbu1">
                      <span>
                        Deuxième année:{" "}
                        <span className="fos44">{singleConj.year_2}</span>
                      </span>
                      <span>
                        Durée:{" "}
                        <span className="fos44">{singleConj.duration_2}</span>
                      </span>
                    </div>
                  ) : null}
                  {singleConj.cancel === 1 ? (
                    <div className="vvbu1">
                      <span className="llpmln55">Congé annuler</span>
                      <span>
                        Total après l'annulation: {singleConj.duration_after}
                      </span>
                    </div>
                  ) : null}
                  {singleConj.decision === tp && singleConj.cancel !== 2 ? (
                    <div className="actions-btn99">
                      <button
                        className="ddh-btn99 valdsh29"
                        onClick={() => updateSelectedRequest(0)}
                      >
                        Rejeter
                      </button>
                      <button
                        className="ddh-btn99 valdsh19"
                        onClick={() => updateSelectedRequest(1)}
                      >
                        Valider
                      </button>
                    </div>
                  ) : null}
                  {singleConj.decision < 5 &&
                  singleConj.decision >= 0 &&
                  singleConj.cancel === 0 ? (
                    <>
                      <button onClick={onPrintClick1} className="printi678">
                        <MdLocalPrintshop className="ptrb567" /> Imprimer la
                        demande
                      </button>
                      <div style={{ display: "none" }}>
                        <PrintComponent2
                          ref={(el) => (printRefs1.current = el)}
                          data={singleConj}
                          dt={person}
                        />
                      </div>
                    </>
                  ) : singleConj.decision === 5 ? (
                    <>
                      <button onClick={onPrintClick} className="printi678">
                        <MdLocalPrintshop className="ptrb567" /> Imprimer la
                        décision
                      </button>
                      <div style={{ display: "none" }}>
                        <PrintComponent
                          ref={(el) => (printRefs.current = el)}
                          data={singleConj}
                        />
                      </div>
                    </>
                  ) : null}
                  {singleConj.cancel === 0 && singleConj.decision < 5 ? (
                    <div className="vvbu1" id="llpng55">
                      <button
                        onClick={() => cancel(singleConj.id)}
                        className="cncl55"
                      >
                        Annuler cette demande
                      </button>
                    </div>
                  ) : null}
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
          {filCongsAll.map((c, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  if (c.total_duration !== 0) {
                    setSingleConj(c);
                  }
                }}
                className="kknh55"
                id="klo4"
                style={
                  c.cancel === 2
                    ? { borderBottom: "2px solid #d35848ca" }
                    : new Date(c.end_at) >= new Date() && c.decision === 5
                    ? { border: "2px solid #2ac225ca" }
                    : null
                }
              >
                <div
                  className={c.cancel === 2 ? "suv-div44 can3425" : "suv-div44"}
                  id="S11"
                >
                  {c.id}
                  {c.cancel !== 2 && c.decision === tp ? (
                    <HiBellAlert className="alr5467" />
                  ) : null}
                </div>
                <div className="suv-div44" id="S12">
                  <span
                    id="vv10"
                    className={
                      c.cancel === 2
                        ? "nn100"
                        : c.decision === 0 && c.cancel !== 2
                        ? "nn11"
                        : c.decision === 1 && c.cancel !== 2
                        ? "nn22"
                        : c.decision === 2 && c.cancel !== 2
                        ? "nn33"
                        : c.decision === 3 && c.cancel !== 2
                        ? "nn44"
                        : c.decision === 4 && c.cancel !== 2
                        ? "nn55"
                        : c.decision === 5 && c.cancel !== 2
                        ? "nn66"
                        : c.decision > 20 && c.cancel !== 2
                        ? "nn20"
                        : null
                    }
                  >
                    {c.cancel === 2
                      ? "Annuler"
                      : c.decision === 0 && c.cancel !== 2
                      ? "En attente"
                      : c.decision === 1 && c.cancel !== 2
                      ? "Bureau d'ordre"
                      : c.decision === 2 && c.cancel !== 2
                      ? "Chef archaic"
                      : c.decision === 3 && c.cancel !== 2
                      ? "Le délégué"
                      : c.decision === 4 && c.cancel !== 2
                      ? "RH"
                      : c.decision === 5 && c.cancel !== 2
                      ? "Valider"
                      : c.decision > 20 && c.cancel !== 2
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
                        : c.type === 21
                        ? "vv7"
                        : c.type === 22
                        ? "vv8"
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
                      : c.type === 21
                      ? "Congé de Maternité"
                      : c.type === 22
                      ? "Congé de Paternité"
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
                    - - -
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

export default SingleEmployee;
