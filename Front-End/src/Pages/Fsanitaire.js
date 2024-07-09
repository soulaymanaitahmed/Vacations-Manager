import { useEffect, useState } from "react";
import axios from "axios";

import { IoSearchCircle } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";

import "../Style/grades.css";

function Fsanitaire() {
  const [type, setType] = useState("");
  const [typeEdited, setTypeEdited] = useState("");
  const [types, setTypes] = useState([]);
  const [typeExist, setTypeExist] = useState(false);
  const [typeEdit, setTypeEdit] = useState(false);
  const [typeDelete, setTypeDelete] = useState(false);

  const [typeSelect, setTypeSelect] = useState("");
  const [typeSelectEdit, setTypeSelectEdit] = useState("");

  const [fSanitaireAll, setFSanitaireAll] = useState([]);
  const [fSanitaire, setFSanitaire] = useState("");
  const [fSanitaireExist, setFSanitaireExist] = useState(false);
  const [fSanitaireEdit, setFSanitaireEdit] = useState(false);
  const [fSanitaireEdited, setFSanitaireEdited] = useState("false");

  useEffect(() => {
    fetchTypes();
    fetchFSanitaires();
  }, []);
  useEffect(() => {
    setTypeExist(false);
  }, [type]);

  const sendType = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7766/types", {
        type,
      });
      console.log(response.data);
      setTypeExist(false);
      setType("");
      fetchTypes();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setTypeExist(true);
      } else {
        console.error(error);
      }
    }
  };

  const sendFSanitaire = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:7766/formation_sanitaires",
        {
          fSanitaire: fSanitaire,
          type: typeSelect,
        }
      );
      console.log(response.data);
      setFSanitaireExist(false);
      setTypeSelect("");
      setFSanitaire("");
      fetchFSanitaires();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setFSanitaireExist(true);
      } else {
        console.error(error);
      }
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get("http://localhost:7766/types");
      setTypes(response.data);
      if (response.data.length > 0) {
        setTypeSelect(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
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

  const updateType = async (id) => {
    try {
      const response = await axios.put(`http://localhost:7766/types/${id}`, {
        typeEdited,
      });
      console.log(response.data);
      fetchTypes();
      setTypeEdit(false);
    } catch (error) {
      console.error("Error deleting type:", error);
    }
  };

  const deleteType = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:7766/types/${id}`);
      console.log(response.data);
      setTypeDelete(false);
      fetchTypes();
    } catch (error) {
      setTypeDelete(true);
    }
  };

  const updateFSanitaire = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:7766/formation_sanitaires/${id}`,
        {
          fs: fSanitaireEdited,
          type_id: typeSelectEdit,
        }
      );
      console.log(response.data);
      fetchFSanitaires();
      setFSanitaireEdit(false);
    } catch (error) {
      console.error("Error updating formation sanitaires:", error);
    }
  };
  const deleteFSanitaire = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:7766/formation_sanitaires/${id}`
      );
      console.log(response.data);
      fetchFSanitaires();
    } catch (error) {
      console.error("Error deleting fSanitaire:", error);
    }
  };

  return (
    <>
      <div className="user-list-header">
        <h3 className="user-header">Formation Sanitaires</h3>
      </div>
      <br />
      <hr />
      <br />
      <div className="user-show1">
        <div className="grade-list">
          <h3 className="hdd6">Formation Sanitaire</h3>
          <form className="grade-add" onSubmit={sendFSanitaire}>
            <input
              type="text"
              className="grade-input"
              placeholder="Grade"
              minLength={2}
              maxLength={50}
              onChange={(e) => {
                setFSanitaire(e.target.value);
              }}
              required
            />
            <select
              name="type-select"
              className="corp-select"
              value={typeSelect}
              onChange={(e) => setTypeSelect(e.target.value)}
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
            <button type="submit" className="btn-grade">
              Ajouter
            </button>
          </form>
          {fSanitaireExist ? <p className="alert1">Grade existe déjà</p> : null}
          <div className="corps-show">
            {fSanitaireAll.map((item) => (
              <div key={item.id} className="corp-item">
                {item.id !== fSanitaireEdit ? (
                  <input
                    type="text"
                    className="corp-dd"
                    id="ggll1"
                    value={item.formation_sanitaire + " - " + item.type}
                    disabled
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      className="corp-dd"
                      id="edd5"
                      value={fSanitaireEdited}
                      onChange={(e) => setFSanitaireEdited(e.target.value)}
                    />
                    <select
                      name="type-selectedit1"
                      className="corp-dd1"
                      value={typeSelectEdit}
                      onChange={(e) => setTypeSelectEdit(e.target.value)}
                    >
                      {types.map((cr) => (
                        <option key={cr.id} value={cr.id}>
                          {cr.type}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                {item.id !== fSanitaireEdit ? (
                  <button
                    className="grade-all-btn"
                    id="edit11"
                    onClick={() => {
                      setFSanitaireEdit(item.id);
                      setFSanitaireEdited(item.formation_sanitaire);
                      setTypeSelectEdit(item.type_id);
                      setTypeEdit(false);
                    }}
                  >
                    <FiEdit className="ft1" />
                    Edit
                  </button>
                ) : (
                  <button
                    className="grade-all-btn"
                    id="confirm11"
                    onClick={() => updateFSanitaire(item.id)}
                  >
                    <GiConfirmed className="ft1" />
                    Confirmer
                  </button>
                )}
                {item.id === fSanitaireEdit ? (
                  <button
                    className="grade-all-btn"
                    onClick={() => {
                      setFSanitaireEdit(false);
                      setFSanitaireEdited("");
                      setTypeSelectEdit("");
                    }}
                  >
                    <MdOutlineCancel className="ft1" />
                    Annuler
                  </button>
                ) : (
                  <button
                    className="grade-all-btn"
                    id="delete11"
                    onDoubleClick={() => deleteFSanitaire(item.id)}
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
          <h3 className="hdd6">Types</h3>
          <form className="grade-add" onSubmit={sendType}>
            <input
              type="text"
              className="grade-input"
              placeholder="Corp"
              minLength={2}
              maxLength={50}
              required
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            />
            <button type="submit" className="btn-grade" id="ggm">
              Ajouter
            </button>
          </form>
          {typeExist ? <p className="alert1">Type existe déjà</p> : null}
          {typeDelete ? (
            <p className="alert1">
              Vous ne pouvez pas supprimer une type utilisé
            </p>
          ) : null}
          <div className="corps-show">
            {types.map((item) => {
              return (
                <div key={item.id} className="corp-item">
                  {item.id !== typeEdit ? (
                    <input
                      type="text"
                      className="corp-dd"
                      value={item.type}
                      disabled
                    />
                  ) : (
                    <input
                      type="text"
                      className="corp-dd"
                      value={typeEdited}
                      onChange={(e) => {
                        setTypeEdited(e.target.value);
                      }}
                    />
                  )}
                  {item.id !== typeEdit ? (
                    <button
                      className="grade-all-btn"
                      id="edit11"
                      onClick={() => {
                        setTypeEdit(item.id);
                        setTypeEdited(item.type);
                        setFSanitaireEdit(false);
                      }}
                    >
                      <FiEdit className="ft1" />
                      Edit
                    </button>
                  ) : (
                    <button
                      className="grade-all-btn"
                      id="confirm11"
                      onClick={() => {
                        updateType(item.id);
                      }}
                    >
                      <GiConfirmed className="ft1" />
                      Confirmer
                    </button>
                  )}
                  {item.id === typeEdit ? (
                    <button
                      className="grade-all-btn"
                      onClick={() => {
                        setTypeEdit(false);
                        setTypeEdited("");
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
                        deleteType(item.id);
                      }}
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

export default Fsanitaire;
