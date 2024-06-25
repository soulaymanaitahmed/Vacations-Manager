import { IoSearchCircle } from "react-icons/io5";
import { MdPersonAdd } from "react-icons/md";

import "../Style/grades.css";

function Grades() {
  return (
    <>
      <div className="user-list-header">
        <h3 className="user-header">Grades</h3>
        <div className="searcher">
          <IoSearchCircle className="search-icon" />
          <input
            type="text"
            id="servh12"
            placeholder="Search"
            className="searcher1"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            name="type"
            className="filter-priv"
            // value={filter1}
            // onChange={(e) => setFilter1(e.target.value)}
            required
          >
            <option value={"*"}>Tous</option>
            <option value={"rh"}>RH</option>
            <option value={"invité"}>Invité</option>
            <option value={"admin"}>Admins</option>
          </select>
        </div>
        <button className="add-user-btn">
          Ajouter un utilisateur <MdPersonAdd className="add-icon" />
        </button>
      </div>
      <br />
      <hr />
      <br />
      <div className="user-show">
        <div className="grade-list">Grade list</div>
        <div className="corps-list">Corps</div>
      </div>
    </>
  );
}

export default Grades;
