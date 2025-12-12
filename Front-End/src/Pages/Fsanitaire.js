import { useEffect, useState } from "react";
import axios from "axios";

import { MdOutlineCancel } from "react-icons/md";

import { AiFillDelete } from "react-icons/ai";

import { GiConfirmed } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";

import { baseURL } from "../config";

import "../Style/grades.css";

function FormationSanitaire() {
  const [formationSanitaire, setFormationSanitaire] = useState("");
  const [formationSanitaireEdited, setFormationSanitaireEdited] = useState("");
  const [formationsSanitaires, setFormationsSanitaires] = useState([]);
  const [formationSanitaireExist, setFormationSanitaireExist] = useState(false);
  const [formationSanitaireEdit, setFormationSanitaireEdit] = useState(false);
  const [formationSanitaireDelete, setFormationSanitaireDelete] =
    useState(false);

  const [formationSanitaireSelect, setFormationSanitaireSelect] = useState("");
  const [formationSanitaireSelectEdit, setFormationSanitaireSelectEdit] =
    useState("");

  const [typesAll, setTypesAll] = useState([]);
  const [type, setType] = useState("");
  const [typeExist, setTypeExist] = useState(false);
  const [typeEdit, setTypeEdit] = useState(false);
  const [typeEdited, setTypeEdited] = useState("false");

  useEffect(() => {
    fetchFormationsSanitaires();
    fetchTypes();
  }, []);
  useEffect(() => {
    setFormationSanitaireExist(false);
  }, [formationSanitaire]);

  const sendFormationSanitaire = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/formations-sanitaires`, {
        formation_sanitaire: formationSanitaire,
      });
      console.log(response.data);
      setFormationSanitaireExist(false);
      setFormationSanitaire("");
      fetchFormationsSanitaires();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setFormationSanitaireExist(true);
      } else {
        console.error(error);
      }
    }
  };
  const sendType = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/types`, {
        type: type,
        formation_sanitaire: formationSanitaireSelect,
      });
      console.log(response.data);
      setTypeExist(false);
      fetchTypes();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setTypeExist(true);
      } else {
        console.error(error);
      }
    }
  };
  const fetchFormationsSanitaires = async () => {
    try {
      const response = await axios.get(`${baseURL}/formations-sanitaires`);
      setFormationsSanitaires(response.data);
    } catch (error) {
      console.error("Error fetching formations sanitaires:", error);
    }
  };
  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${baseURL}/types`);
      setTypesAll(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };
  const updateFormationSanitaire = async (id) => {
    try {
      const response = await axios.put(
        `${baseURL}/formations-sanitaires/${id}`,
        {
          formation_sanitaire: formationSanitaireEdited,
        }
      );
      console.log(response.data);
      fetchFormationsSanitaires();
      setFormationSanitaireEdit(false);
    } catch (error) {
      console.error("Error deleting formation sanitaire:", error);
    }
  };
  const deleteFormationSanitaire = async (id) => {
    try {
      const response = await axios.delete(
        `${baseURL}/formations-sanitaires/${id}`
      );
      console.log(response.data);
      fetchFormationsSanitaires();
      setFormationSanitaireDelete(false);
    } catch (error) {
      setFormationSanitaireDelete(true);
    }
  };
  const updateType = async (id) => {
    try {
      const response = await axios.put(`${baseURL}/types/${id}`, {
        type: typeEdited,
        formation_sanitaire_id: formationSanitaireSelectEdit,
      });
      console.log(response.data);
      fetchTypes();
      setTypeEdit(false);
    } catch (error) {
      console.error("Error updating type:", error);
    }
  };
  const deleteType = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/types/${id}`);
      console.log(response.data);
      fetchTypes();
    } catch (error) {
      console.error("Error deleting type:", error);
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
          <h3>Types</h3>
          <form className="grade-add" onSubmit={sendType}>
            <input
              type="text"
              className="grade-input"
              placeholder="Type"
              minLength={2}
              maxLength={50}
              onChange={(e) => {
                setType(e.target.value);
              }}
              required
            />
            <select
              name="formation-sanitaire-select"
              className="corp-select"
              id="kkiuyb236"
              value={formationSanitaireSelect}
              onChange={(e) => setFormationSanitaireSelect(e.target.value)}
              required
            >
              <option>Select Formation Sanitaire</option>
              {formationsSanitaires.map((fs) => {
                return (
                  <option key={fs.id} value={fs.id}>
                    {fs.formation_sanitaire}
                  </option>
                );
              })}
            </select>
            <button type="submit" className="btn-grade">
              Ajouter
            </button>
          </form>
          {typeExist ? <p className="alert1">Type existe déjà</p> : null}
          <div className="corps-show">
            {typesAll.map((item) => (
              <div key={item.id} className="corp-item">
                {item.id !== typeEdit ? (
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
                      value={typeEdited}
                      onChange={(e) => setTypeEdited(e.target.value)}
                    />
                    <select
                      name="formation-sanitaire-selectedit1"
                      className="corp-dd1"
                      value={formationSanitaireSelectEdit}
                      onChange={(e) =>
                        setFormationSanitaireSelectEdit(e.target.value)
                      }
                    >
                      {formationsSanitaires.map((fs) => (
                        <option key={fs.id} value={fs.id}>
                          {fs.formation_sanitaire}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                {item.id !== typeEdit ? (
                  <button
                    className="grade-all-btn"
                    id="edit11"
                    onClick={() => {
                      setTypeEdit(item.id);
                      setTypeEdited(item.type);
                      setFormationSanitaireSelectEdit(
                        item.formation_sanitaire_id
                      );
                      setFormationSanitaireEdit(false);
                    }}
                  >
                    <FiEdit className="ft1" />
                    Edit
                  </button>
                ) : (
                  <button
                    className="grade-all-btn"
                    id="confirm11"
                    onClick={() => updateType(item.id)}
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
                      setFormationSanitaireSelectEdit("");
                    }}
                  >
                    <MdOutlineCancel className="ft1" />
                    Annuler
                  </button>
                ) : (
                  <button
                    className="grade-all-btn"
                    id="delete11"
                    onDoubleClick={() => deleteType(item.id)}
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
          <h3>Formation Sanitaire</h3>
          <form className="grade-add" onSubmit={sendFormationSanitaire}>
            <input
              type="text"
              className="grade-input"
              placeholder="Formation Sanitaires"
              minLength={2}
              maxLength={50}
              required
              value={formationSanitaire}
              onChange={(e) => {
                setFormationSanitaire(e.target.value);
              }}
            />
            <button type="submit" className="btn-grade" id="ggm">
              Ajouter
            </button>
          </form>
          {formationSanitaireExist ? (
            <p className="alert1">Formation Sanitaires existe déjà</p>
          ) : null}
          {formationSanitaireDelete ? (
            <p className="alert1">
              Vous ne pouvez pas supprimer Formation Sanitaire car elle est
              utilisée par un ou plusieurs types.
            </p>
          ) : null}
          <div className="corps-show">
            {formationsSanitaires.map((item) => {
              return (
                <div key={item.id} className="corp-item">
                  {item.id !== formationSanitaireEdit ? (
                    <input
                      type="text"
                      className="corp-dd"
                      value={item.formation_sanitaire}
                      disabled
                    />
                  ) : (
                    <input
                      type="text"
                      className="corp-dd"
                      value={formationSanitaireEdited}
                      onChange={(e) => {
                        setFormationSanitaireEdited(e.target.value);
                      }}
                    />
                  )}
                  {item.id !== formationSanitaireEdit ? (
                    <button
                      className="grade-all-btn"
                      id="edit11"
                      onClick={() => {
                        setFormationSanitaireEdit(item.id);
                        setFormationSanitaireEdited(item.formation_sanitaire);
                        setTypeEdit(false);
                      }}
                      disabled={
                        item.formation_sanitaire_nbr === 1 ||
                        item.formation_sanitaire_nbr === 2 ||
                        item.formation_sanitaire_nbr === 3
                      }
                      style={
                        item.formation_sanitaire_nbr === 1 ||
                        item.formation_sanitaire_nbr === 2 ||
                        item.formation_sanitaire_nbr === 3
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
                        updateFormationSanitaire(item.id);
                      }}
                    >
                      <GiConfirmed className="ft1" />
                      Confirmer
                    </button>
                  )}
                  {item.id === formationSanitaireEdit ? (
                    <button
                      className="grade-all-btn"
                      onClick={() => {
                        setFormationSanitaireEdit(false);
                        setFormationSanitaireEdited("");
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
                        deleteFormationSanitaire(item.id);
                      }}
                      disabled={
                        item.formation_sanitaire_nbr === 1 ||
                        item.formation_sanitaire_nbr === 2 ||
                        item.formation_sanitaire_nbr === 3
                      }
                      style={
                        item.formation_sanitaire_nbr === 1 ||
                        item.formation_sanitaire_nbr === 2 ||
                        item.formation_sanitaire_nbr === 3
                          ? { backgroundColor: "#f6727fb3" }
                          : null
                      }
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

export default FormationSanitaire;
