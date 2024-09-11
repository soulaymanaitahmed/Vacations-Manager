import { useEffect, useState } from "react";
import axios from "axios";

import { MdOutlineCancel } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";

import "../Style/grades.css";

function Grades() {
  const getBaseURL = () => {
    const { protocol, hostname } = window.location;
    const port = 7766;
    return `${protocol}//${hostname}:${port}`;
  };
  const baseURL = getBaseURL();

  const [corp, setCorp] = useState("");
  const [corpEdited, setCorpEdited] = useState("");
  const [corps, setCorps] = useState([]);
  const [corpExist, setCorpExist] = useState(false);
  const [corpEdit, setCorpEdit] = useState(false);
  const [corpDelete, setCorpDelete] = useState(false);

  const [corpSelect, setCorpSelect] = useState("");
  const [corpSelectEdit, setCorpSelectEdit] = useState("");

  const [GradeAll, setGradeAll] = useState([]);
  const [grade, setGrade] = useState("");
  const [gradeExist, setGradeExist] = useState(false);
  const [gradeEdit, setGradeEdit] = useState(false);
  const [gradeEdited, setGradeEdited] = useState("false");

  useEffect(() => {
    fetchCorps();
    fetchGrades();
  }, []);
  useEffect(() => {
    setCorpExist(false);
  }, [corp]);

  const sendCorp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/corps`, {
        corp,
      });
      console.log(response.data);
      setCorpExist(false);
      setCorp("");
      fetchCorps();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setCorpExist(true);
      } else {
        console.error(error);
      }
    }
  };
  const sendGrade = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/grades`, {
        grade: grade,
        corp: corpSelect,
      });
      console.log(response.data);
      setGradeExist(false);
      setCorpSelect("");
      setGrade("");
      fetchGrades();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setGradeExist(true);
      } else {
        console.error(error);
      }
    }
  };
  const fetchCorps = async () => {
    try {
      const response = await axios.get(`${baseURL}/corps`);
      setCorps(response.data);
    } catch (error) {
      console.error("Error fetching corps:", error);
    }
  };
  const fetchGrades = async () => {
    try {
      const response = await axios.get(`${baseURL}/grades`);
      setGradeAll(response.data);
    } catch (error) {
      console.error("Error fetching Grades:", error);
    }
  };
  const updateCorp = async (id) => {
    try {
      const response = await axios.put(`${baseURL}/corps/${id}`, {
        corpEdited,
      });
      console.log(response.data);
      fetchCorps();
      setCorpEdit(false);
    } catch (error) {
      console.error("Error deleting corp:", error);
    }
  };
  const deleteCorp = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/corps/${id}`);
      console.log(response.data);
      fetchCorps();
      setCorpDelete(false);
    } catch (error) {
      setCorpDelete(true);
    }
  };
  const updateGrade = async (id) => {
    try {
      const response = await axios.put(`${baseURL}/grades/${id}`, {
        grade: gradeEdited,
        corp_id: corpSelectEdit,
      });
      console.log(response.data);
      fetchGrades();
      setGradeEdit(false);
    } catch (error) {
      console.error("Error updating grade:", error);
    }
  };
  const deleteGrade = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/grades/${id}`);
      console.log(response.data);
      fetchGrades();
    } catch (error) {
      console.error("Error deleting grade:", error);
    }
  };

  return (
    <>
      <div className="user-list-header">
        <h3 className="user-header">Grades</h3>
      </div>
      <br />
      <hr />
      <br />
      <div className="user-show1">
        <div className="grade-list">
          <h3>Grades</h3>
          <form className="grade-add" onSubmit={sendGrade}>
            <input
              type="text"
              className="grade-input"
              placeholder="Grade"
              minLength={2}
              maxLength={50}
              onChange={(e) => {
                setGrade(e.target.value);
              }}
              required
            />
            <select
              name="corp-select"
              className="corp-select"
              value={corpSelect}
              onChange={(e) => setCorpSelect(e.target.value)}
              required
            >
              <option>Select Corp</option>
              {corps.map((cr) => {
                return (
                  <option key={cr.id} value={cr.id}>
                    {cr.corp}
                  </option>
                );
              })}
            </select>
            <button type="submit" className="btn-grade">
              Ajouter
            </button>
          </form>
          {gradeExist ? <p className="alert1">Grade existe déjà</p> : null}
          <div className="corps-show">
            {GradeAll.map((item) => (
              <div key={item.id} className="corp-item">
                {item.id !== gradeEdit ? (
                  <input
                    type="text"
                    className="corp-dd"
                    id="ggll1"
                    value={item.grade + " - " + item.corp}
                    disabled
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      className="corp-dd"
                      id="edd5"
                      value={gradeEdited}
                      onChange={(e) => setGradeEdited(e.target.value)}
                    />
                    <select
                      name="corp-selectedit1"
                      className="corp-dd1"
                      value={corpSelectEdit}
                      onChange={(e) => setCorpSelectEdit(e.target.value)}
                    >
                      {corps.map((cr) => (
                        <option key={cr.id} value={cr.id}>
                          {cr.corp}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                {item.id !== gradeEdit ? (
                  <button
                    className="grade-all-btn"
                    id="edit11"
                    onClick={() => {
                      setGradeEdit(item.id);
                      setGradeEdited(item.grade);
                      setCorpSelectEdit(item.corp_id);
                      setCorpEdit(false);
                    }}
                  >
                    <FiEdit className="ft1" />
                    Edit
                  </button>
                ) : (
                  <button
                    className="grade-all-btn"
                    id="confirm11"
                    onClick={() => updateGrade(item.id)}
                  >
                    <GiConfirmed className="ft1" />
                    Confirmer
                  </button>
                )}
                {item.id === gradeEdit ? (
                  <button
                    className="grade-all-btn"
                    onClick={() => {
                      setGradeEdit(false);
                      setGradeEdited("");
                      setCorpSelectEdit("");
                    }}
                  >
                    <MdOutlineCancel className="ft1" />
                    Annuler
                  </button>
                ) : (
                  <button
                    className="grade-all-btn"
                    id="delete11"
                    onDoubleClick={() => deleteGrade(item.id)}
                  >
                    <MdDeleteOutline className="ft1" />
                    Supprimer
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="corps-list">
          <h3>Corps</h3>
          <form className="grade-add" onSubmit={sendCorp}>
            <input
              type="text"
              className="grade-input"
              placeholder="Corp"
              minLength={2}
              maxLength={50}
              required
              value={corp}
              onChange={(e) => {
                setCorp(e.target.value);
              }}
            />
            <button type="submit" className="btn-grade" id="ggm">
              Ajouter
            </button>
          </form>
          {corpExist ? <p className="alert1">Corp existe déjà</p> : null}
          {corpDelete ? (
            <p className="alert1">
              Vous ne pouvez pas supprimer un corp utilisé
            </p>
          ) : null}
          <div className="corps-show">
            {corps.map((item) => {
              return (
                <div key={item.id} className="corp-item">
                  {item.id !== corpEdit ? (
                    <input
                      type="text"
                      className="corp-dd"
                      value={item.corp}
                      disabled
                    />
                  ) : (
                    <input
                      type="text"
                      className="corp-dd"
                      value={corpEdited}
                      onChange={(e) => {
                        setCorpEdited(e.target.value);
                      }}
                    />
                  )}
                  {item.id !== corpEdit ? (
                    <button
                      className="grade-all-btn"
                      id="edit11"
                      onClick={() => {
                        setCorpEdit(item.id);
                        setCorpEdited(item.corp);
                        setGradeEdit(false);
                      }}
                      disabled={
                        item.corp_nbr === 1 ||
                        item.corp_nbr === 2 ||
                        item.corp_nbr === 3
                      }
                      style={
                        item.corp_nbr === 1 ||
                        item.corp_nbr === 2 ||
                        item.corp_nbr === 3
                          ? { backgroundColor: "silver" }
                          : null
                      }
                    >
                      <FiEdit className="ft1" />
                      Edit
                    </button>
                  ) : (
                    <button
                      className="grade-all-btn"
                      id="confirm11"
                      onClick={() => {
                        updateCorp(item.id);
                      }}
                    >
                      <GiConfirmed className="ft1" />
                      Confirmer
                    </button>
                  )}
                  {item.id === corpEdit ? (
                    <button
                      className="grade-all-btn"
                      onClick={() => {
                        setCorpEdit(false);
                        setCorpEdited("");
                      }}
                    >
                      <MdOutlineCancel className="ft1" />
                      Annuler
                    </button>
                  ) : (
                    <button
                      className="grade-all-btn"
                      id="delete11"
                      onDoubleClick={() => {
                        deleteCorp(item.id);
                      }}
                      disabled={
                        item.corp_nbr === 1 ||
                        item.corp_nbr === 2 ||
                        item.corp_nbr === 3
                      }
                      style={
                        item.corp_nbr === 1 ||
                        item.corp_nbr === 2 ||
                        item.corp_nbr === 3
                          ? { backgroundColor: "#f6727fb3" }
                          : null
                      }
                    >
                      <MdDeleteOutline className="ft1" />
                      Supprimer
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Grades;
