import React, { useEffect, useState } from "react";
import axios from "axios";

import "../Style/employee.css";

function Employees() {
  axios.defaults.withCredentials = true;
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  });
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:7766/employees", {
        withCredentials: true,
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return <div className="employees">Employees</div>;
}

export default Employees;
