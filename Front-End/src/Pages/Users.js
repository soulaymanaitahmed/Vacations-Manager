import { IoSearchCircle } from "react-icons/io5";
import { MdPersonAdd } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import React, { useEffect, useState } from "react";
import axios from "axios";

import "../Style/users.css";

import { baseURL } from "../config";

function Users() {
  const [addUser, setAddUser] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [conf, setConf] = useState(false);

  const [filter1, setFilter1] = useState("*");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [usernameExists, setUsernameExists] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setPrenom(user?.prenom || "");
    setNom(user?.nom || "");
    setUsername(user?.username || "");
    setPassword(user?.password || "");
    setType(user?.type || "client");
    setPassVisible(false);
  }, [user]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(term) ||
          user.nom.toLowerCase().includes(term) ||
          user.prenom.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/users`, {
        nom,
        prenom,
        username,
        password,
        type,
      });
      console.log("User added successfully:", response.data);
      setAddUser(false);
      setUser(null);
      fetchUsers();
      setUsernameExists(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setUsernameExists(true);
      } else {
        console.error("There was an error adding the user:", error);
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${baseURL}/users/${user.id}`, {
        nom,
        prenom,
        username,
        password,
        type,
      });
      console.log("User updated successfully:", response.data);
      fetchUsers();
      setAddUser(false);
      setUser(null);
      setUsernameExists(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("User not found");
      } else {
        console.error("There was an error updating the user:", error);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/users/${id}`);
      console.log("User deleted successfully:", response.data);
      setConf(false);
      setAddUser(false);
      setUser(null);
      fetchUsers();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("User not found");
      } else {
        console.error("There was an error deleting the user:", error);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/users`, {
        params: {
          type: filter1 === "*" ? undefined : filter1,
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter1]);

  const Annuler = () => {
    setUsernameExists(false);
    setAddUser(false);
    setUser(null);
    setNom("");
    setPrenom("");
    setUsername("");
    setPassword("");
    setType("client");
  };

  return (
    <div className="users-cont">
      {conf == true && user ? (
        <div className="confirm88">
          <div className="conf-card-99">
            <p className="conf-text5">Are you sure?</p>
            <div className="conf-btn-77">
              <button
                className="cbtn5 conf99"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
              <button className="cbtn5 cancel99" onClick={() => setConf(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="user-list-header">
        <h3 className="user-header">Utilisateurs</h3>
        <div className="searcher">
          <IoSearchCircle className="search-icon" />
          <input
            type="text"
            id="servh12"
            placeholder="Search"
            className="searcher1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            name="type"
            className="filter-priv"
            value={filter1}
            onChange={(e) => setFilter1(e.target.value)}
            required
          >
            <option value={"*"}>Tous</option>
            <option value={0}>Invité</option>
            <option value={1}>Bureau d'ordre</option>
            <option value={2}>Chef archaic</option>
            <option value={3}>Le délégué</option>
            <option value={4}>RH</option>
            <option value={20}>Admin</option>
          </select>
        </div>
        <button
          className="add-user-btn"
          onClick={() => {
            setUsernameExists(false);
            setAddUser(true);
            setUser(null);
            setNom("");
            setPrenom("");
            setUsername("");
            setPassword("");
            setType("client");
          }}
        >
          Ajouter un utilisateur <MdPersonAdd className="add-icon" />
        </button>
      </div>
      <br />
      <hr />
      <br />
      <div className="user-show">
        <div className="user-list">
          {filteredUsers.map((us, index) => {
            return (
              <div
                className="user-card"
                key={index}
                id={us.username === user?.username ? "active-card" : ""}
                onClick={() => {
                  setUser(us);
                  setAddUser(false);
                }}
              >
                <div className="user-card-infos">
                  <span
                    className="nn1"
                    id={us.username === user?.username ? "active-card1" : ""}
                  >
                    Prenom :
                  </span>
                  <span
                    className="nn2"
                    id={us.username === user?.username ? "active-card1" : ""}
                  >
                    {us.prenom}
                  </span>
                </div>
                <div className="user-card-infos">
                  <span
                    className="nn1"
                    id={us.username === user?.username ? "active-card1" : ""}
                  >
                    Nom :
                  </span>
                  <span
                    className="nn2"
                    id={us.username === user?.username ? "active-card1" : ""}
                  >
                    {us.nom}
                  </span>
                </div>
                <div className="user-card-infos">
                  <span
                    className="nn1"
                    id={us.username === user?.username ? "active-card1" : ""}
                  >
                    Username :
                  </span>
                  <span
                    className="nn2"
                    id={us.username === user?.username ? "active-card1" : ""}
                  >
                    {us.username}
                  </span>
                </div>
                <div className="user-card-infos">
                  <span
                    className="nn1"
                    id={us.username === user?.username ? "active-card1" : ""}
                  >
                    Privileges :
                  </span>
                  <span className="nn3">
                    {us.type === 1
                      ? "Bureau d'ordre"
                      : us.type === 2
                      ? "Chef archaic"
                      : us.type === 3
                      ? "Le délégué"
                      : us.type === 4
                      ? "RH"
                      : us.type === 20
                      ? "Admin"
                      : us.type === 0
                      ? "Invité"
                      : us.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {addUser ? (
          <form className="add-user fade-in" onSubmit={handleSubmit}>
            <h3 className="add-hea">Nouvel Utilisateur</h3>
            <div className="input-lab">
              <input
                required
                className="addInput"
                id="prenom"
                name="prenom"
                type="text"
                minLength={1}
                maxLength={50}
                value={prenom}
                onChange={(e) => {
                  setPrenom(e.target.value);
                }}
              />
              <label htmlFor="prenom" className="add-lab">
                Prénom
              </label>
            </div>
            <div className="input-lab">
              <input
                required
                className="addInput"
                id="nom"
                name="nom"
                type="text"
                minLength={1}
                maxLength={50}
                value={nom}
                onChange={(e) => {
                  setNom(e.target.value);
                }}
              />
              <label htmlFor="nom" className="add-lab">
                Nom
              </label>
            </div>
            {usernameExists && (
              <span className="alr">Ce nom d'utilisateur existe déjà</span>
            )}
            <div className="input-lab">
              <input
                required
                className="addInput"
                id="username"
                name="username"
                type="text"
                minLength={4}
                maxLength={50}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <label htmlFor="username" className="add-lab">
                Username
              </label>
            </div>
            <div className="input-lab">
              <MdVisibility
                className="visible"
                onClick={() => {
                  setPassVisible(!passVisible);
                }}
              />
              <input
                required
                className="addInput"
                id="password"
                name="password"
                minLength={4}
                maxLength={50}
                type={passVisible ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <label htmlFor="password" className="add-lab">
                Password
              </label>
            </div>
            <div className="add-selection">
              <input className="select-lab" value="Privileges" id="hhkvcn" />
              <select
                name="type"
                className="privl"
                defaultValue="client"
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value={0}>Invité</option>
                <option value={1}>Bureau d'ordre</option>
                <option value={2}>Chef archaic</option>
                <option value={3}>Le délégué</option>
                <option value={4}>RH</option>
                <option value={20}>Admin</option>
              </select>
            </div>
            <div className="add-actions">
              <button onClick={Annuler} className="add-btn-user2">
                Annuler
              </button>
              <button className="add-btn-user" type="submit">
                Ajouter
              </button>
            </div>
          </form>
        ) : null}
        {user ? (
          <form className="add-user fade-in" onSubmit={handleUpdateUser}>
            <div className="input-lab">
              <input
                required
                className="addInput"
                id="prenom"
                name="prenom"
                type="text"
                minLength={1}
                maxLength={50}
                value={prenom}
                onChange={(e) => {
                  setPrenom(e.target.value);
                }}
              />
              <label htmlFor="prenom" className="add-lab">
                Prénom
              </label>
            </div>
            <div className="input-lab">
              <input
                required
                className="addInput"
                id="nom"
                name="nom"
                type="text"
                minLength={1}
                maxLength={50}
                value={nom}
                onChange={(e) => {
                  setNom(e.target.value);
                }}
              />
              <label htmlFor="nom" className="add-lab">
                Nom
              </label>
            </div>
            <div className="input-lab">
              <input
                required
                className="addInput"
                id="username"
                name="username"
                type="text"
                minLength={1}
                maxLength={50}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <label htmlFor="username" className="add-lab">
                Username
              </label>
            </div>
            <div className="input-lab">
              <MdVisibility
                className="visible"
                onClick={() => {
                  setPassVisible(!passVisible);
                }}
              />
              <input
                required
                className="addInput"
                id="password"
                name="password"
                minLength={4}
                maxLength={50}
                type={passVisible ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <label htmlFor="password" className="add-lab">
                Password
              </label>
            </div>
            <div className="add-selection">
              <input className="select-lab" value="Privileges" id="hhkvcn" />
              <select
                name="type"
                className="privl"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value={0}>Invité</option>
                <option value={1}>Bureau d'ordre</option>
                <option value={2}>Chef archaic</option>
                <option value={3}>Le délégué</option>
                <option value={4}>RH</option>
                <option value={20}>Admin</option>
              </select>
            </div>
            <div className="add-actions">
              <button onClick={Annuler} className="add-btn-user2">
                Annuler
              </button>
              <div
                className="add-btn-user2"
                id="add-btn-id"
                onClick={() => setConf(true)}
              >
                <MdDelete className="add-btn-delete" />
              </div>
              <button className="add-btn-user" type="submit">
                Confirmer
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default Users;
