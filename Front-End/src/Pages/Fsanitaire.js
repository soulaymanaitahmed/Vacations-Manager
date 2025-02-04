import { useEffect, useState } from "react";
import axios from "axios";

import { MdOutlineCancel } from "react-icons/md";

import { AiFillDelete } from "react-icons/ai";
import { GiConfirmed } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";

import "../Style/grades.css";

import { baseURL } from "../config";

function Fsanitaire() {
  const [type, setType] = useState("");
  const [typeEdited, setTypeEdited] = useState("");
  const [types, setTypes] = useState([]);
  const [typeExist, setTypeExist] = useState(false);
  const [typeEdit, setTypeEdit] = useState(false);
  const [typeDelete, setTypeDelete] = useState(false);

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
      const response = await axios.post(`${baseURL}/types`, {
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
      const response = await axios.post(`${baseURL}/formation_sanitaires`, {
        fSanitaire: fSanitaire,
      });
      console.log(response.data);
      setFSanitaireExist(false);
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
      const response = await axios.get(`${baseURL}/types`);
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const fetchFSanitaires = async () => {
    try {
      const response = await axios.get(`${baseURL}/formation_sanitaires`);
      setFSanitaireAll(response.data);
    } catch (error) {
      console.error("Error fetching fSanitaires:", error);
    }
  };

  const updateType = async (id) => {
    try {
      const response = await axios.put(`${baseURL}/types/${id}`, {
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
      const response = await axios.delete(`${baseURL}/types/${id}`);
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
        `${baseURL}/formation_sanitaires/${id}`,
        {
          fs: fSanitaireEdited,
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
        `${baseURL}/formation_sanitaires/${id}`
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
      <p className="allr678">
        Alerte! supprimer ou modifier l'un de ces éléments affectera directement
        le profil du membre du personnel.
      </p>
      <br />
      <div className="user-show1">
        <div className="grade-list">
          <h3 className="hdd6">Formation Sanitaire</h3>
          <form className="grade-add" onSubmit={sendFSanitaire}>
            <input
              type="text"
              className="grade-input"
              placeholder="Formation Sanitaire"
              minLength={2}
              maxLength={50}
              onChange={(e) => {
                setFSanitaire(e.target.value);
              }}
              required
            />
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
                    value={item.formation_sanitaire}
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    className="corp-dd"
                    id="ggll1"
                    value={fSanitaireEdited}
                    onChange={(e) => setFSanitaireEdited(e.target.value)}
                  />
                )}
                {item.id !== fSanitaireEdit ? (
                  <button
                    className="grade-all-btn"
                    id="edit11"
                    onClick={() => {
                      setFSanitaireEdit(item.id);
                      setFSanitaireEdited(item.formation_sanitaire);
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
                    <AiFillDelete className="ft1" />
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
              placeholder="Type"
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
                      <AiFillDelete className="ft1" />
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
