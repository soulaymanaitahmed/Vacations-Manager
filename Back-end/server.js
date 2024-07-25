const jwt = require("jsonwebtoken");
const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = 7766;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "conges",
  timezone: "Z",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to SQL database");
});
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ------------------------------------------ Login ----------------------------------
app.post("/users/login", (req, res) => {
  const { username, password, rememberMe } = req.body;

  const loginQuery = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(loginQuery, [username, password], (err, results) => {
    if (err) {
      console.error("Error performing login:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = results[0];
    const tokenExpiration = rememberMe ? "30d" : "1h";
    const token = jwt.sign(
      { username: user.username, type: user.type },
      "your-secret-key",
      { expiresIn: tokenExpiration }
    );
    return res
      .status(200)
      .json({ message: "Login successful", "gestion-des-conges": token });
  });
});
app.get("/vac", (req, res) => {
  const year = req.query.year;
  const getHolidaysByYearQuery = `
    SELECT
      id, 
      year, 
      DATE_FORMAT(start_date, '%Y-%m-%d') as start_date, 
      duration, 
      DATE_FORMAT(end_date, '%Y-%m-%d') as end_date, 
      hname 
    FROM holidays 
    WHERE year = ?
    ORDER BY start_date ASC`;

  db.query(getHolidaysByYearQuery, [year], (err, results) => {
    if (err) {
      console.error("Error fetching holidays:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(results);
  });
});
app.post("/vac", (req, res) => {
  const { year, start_date, duration, end_date, hname } = req.body;

  const createHolidayQuery = `
    INSERT INTO holidays (year, start_date, duration, end_date, hname) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    createHolidayQuery,
    [year, start_date, duration, end_date, hname],
    (err, result) => {
      if (err) {
        console.error("Error creating holiday:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      console.log("Holiday created successfully");
      res.status(201).json({ message: "Holiday created successfully" });
    }
  );
});
app.put("/vac/:id", (req, res) => {
  const holidayId = req.params.id;
  const { year, start_date, duration, end_date, hname } = req.body;
  const updateHolidayQuery = `
    UPDATE holidays 
    SET year = ?, start_date = ?, duration = ?, end_date = ?, hname = ?
    WHERE id = ?
  `;
  db.query(
    updateHolidayQuery,
    [year, start_date, duration, end_date, hname, holidayId],
    (err, result) => {
      if (err) {
        console.error("Error updating holiday:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Holiday not found" });
        return;
      }
      console.log("Holiday updated successfully");
      res.status(200).json({ message: "Holiday updated successfully" });
    }
  );
});
app.delete("/vac/:id", (req, res) => {
  const holidayId = req.params.id;
  const deleteHolidayQuery = `
    DELETE FROM holidays 
    WHERE id = ?
  `;
  db.query(deleteHolidayQuery, [holidayId], (err, result) => {
    if (err) {
      console.error("Error deleting holiday:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Holiday not found" });
      return;
    }
    console.log("Holiday deleted successfully");
    res.status(200).json({ message: "Holiday deleted successfully" });
  });
});
// ------------------------------------------ Employees ----------------------------------
app.post("/employees", (req, res) => {
  const { nom, prenom, cin, ppr, affec, type, gradeSel } = req.body;
  const checkIfExistsQuery = `
    SELECT * FROM personnels 
    WHERE (nom = ? AND prenom = ?) OR cin = ? OR ppr = ?
  `;
  db.query(checkIfExistsQuery, [nom, prenom, cin, ppr], (err, results) => {
    if (err) {
      console.error("Error checking if employee exists:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let nameExists = false;
    let cinExists = false;
    let pprExists = false;
    results.forEach((result) => {
      if (result.nom === nom && result.prenom === prenom) {
        nameExists = true;
      }
      if (result.cin === cin) {
        cinExists = true;
      }
      if (result.ppr === ppr) {
        pprExists = true;
      }
    });
    let errorCode = 0;
    if (nameExists) errorCode += 1;
    if (cinExists) errorCode += 2;
    if (pprExists) errorCode += 4;

    if (errorCode > 0) {
      res
        .status(400)
        .json({ error: `Employee already exists`, code: errorCode });
      return;
    }
    const createEmployeeQuery = `
      INSERT INTO personnels (nom, prenom, cin, ppr, affectation, type, grade) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      createEmployeeQuery,
      [nom, prenom, cin, ppr, affec, type, gradeSel],
      (err, result) => {
        if (err) {
          console.error("Error creating employee:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        console.log("Employee created successfully");
        res.status(201).json({ message: "Employee created successfully" });
      }
    );
  });
});
app.get("/employees", (req, res) => {
  const { id } = req.query;

  let query = `
  SELECT 
    personnels.*,
    grades.grade AS grade_name,
    corps.corp AS corp_name,
    corps.corp_nbr,
    formation_sanitaires.formation_sanitaire,
    types.type AS type_name
  FROM personnels
  INNER JOIN grades ON personnels.grade = grades.id
  INNER JOIN corps ON grades.corp_id = corps.id
  LEFT JOIN formation_sanitaires ON personnels.affectation = formation_sanitaires.id
  LEFT JOIN types ON personnels.type = types.id
  `;
  const queryParams = [];
  if (id && id !== "*") {
    query += ` WHERE corps.id = ?`;
    queryParams.push(id);
  }
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(results);
  });
});
app.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { nom, prenom, cin, ppr, affec, type, gradeSel } = req.body;

  const checkIfExistsQuery = `
    SELECT * FROM personnels 
    WHERE (cin = ? OR ppr = ?) AND id <> ?
  `;
  db.query(checkIfExistsQuery, [cin, ppr, id], (err, results) => {
    if (err) {
      console.error("Error checking if employee exists:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    let cinExists = false;
    let pprExists = false;

    results.forEach((result) => {
      if (result.cin === cin) {
        cinExists = true;
      }
      if (result.ppr === ppr) {
        pprExists = true;
      }
    });

    let errorCode = 0;
    if (cinExists) errorCode += 2;
    if (pprExists) errorCode += 4;

    if (errorCode > 0) {
      res.status(400).json({ error: `Conflicting data`, code: errorCode });
      return;
    }
    const updateEmployeeQuery = `
      UPDATE personnels 
      SET nom = ?, prenom = ?, cin = ?, ppr = ?, affectation = ?, type = ?, grade = ? 
      WHERE id = ?
    `;
    const queryParams = [nom, prenom, cin, ppr, affec, type, gradeSel, id];

    db.query(updateEmployeeQuery, queryParams, (err, result) => {
      if (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Employee not found" });
        return;
      }

      console.log("Employee updated successfully");
      res.status(200).json({ message: "Employee updated successfully" });
    });
  });
});
app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;

  const deleteEmployeeQuery = `DELETE FROM personnels WHERE id = ?`;
  db.query(deleteEmployeeQuery, [id], (err, result) => {
    if (err) {
      console.error("Error deleting employee:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }

    console.log("Employee deleted successfully");
    res.status(200).json({ message: "Employee deleted successfully" });
  });
});

// ------------------------------------------ Types ----------------------------------
app.post("/types", (req, res) => {
  const { type } = req.body;
  const checkIfExistsQuery = `SELECT * FROM types WHERE type = ?`;
  db.query(checkIfExistsQuery, [type], (err, results) => {
    if (err) {
      console.error("Error checking if type exists:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ error: "Type already exists" });
      return;
    }
    const createTypeQuery = `INSERT INTO types (type) VALUES (?)`;
    db.query(createTypeQuery, [type], (err, result) => {
      if (err) {
        console.error("Error creating type:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      console.log("Type created successfully");
      res.status(201).json({ message: "Type created successfully" });
    });
  });
});
app.get("/types", (req, res) => {
  const getAllTypesQuery = `SELECT * FROM types`;
  db.query(getAllTypesQuery, (err, results) => {
    if (err) {
      console.error("Error fetching types:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(results);
  });
});
app.put("/types/:id", (req, res) => {
  const { id } = req.params;
  const { typeEdited } = req.body;

  const updateTypeQuery = `UPDATE types SET type = ? WHERE id = ?`;
  db.query(updateTypeQuery, [typeEdited, id], (err, result) => {
    if (err) {
      console.error("Error updating type:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Type not found" });
      return;
    }

    console.log("Type updated successfully");
    res.status(200).json({ message: "Type updated successfully" });
  });
});
app.delete("/types/:id", (req, res) => {
  const typeId = req.params.id;
  const deleteTypeQuery = `DELETE FROM types WHERE id = ?`;
  db.query(deleteTypeQuery, [typeId], (err, result) => {
    if (err) {
      console.error("Error deleting type:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({
        error: "Type is referenced in another table and cannot be deleted",
      });
    }
    res.status(200).json({ message: "Type deleted successfully" });
  });
});

// ------------------------------------------ Formation Sanitaire ----------------------------------
app.post("/formation_sanitaires", (req, res) => {
  const { fSanitaire } = req.body;
  const checkIfExistsQuery = `SELECT * FROM formation_sanitaires WHERE formation_sanitaire = ?`;
  db.query(checkIfExistsQuery, [fSanitaire], (err, results) => {
    if (err) {
      console.error("Error checking if formation_sanitaire exists:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ error: "Formation_sanitaire already exists" });
      return;
    }
    const createFSanitaireQuery = `INSERT INTO formation_sanitaires (formation_sanitaire) VALUES (?)`;
    db.query(createFSanitaireQuery, [fSanitaire], (err, result) => {
      if (err) {
        console.error("Error creating formation_sanitaire:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      console.log("Formation_sanitaire created successfully");
      res
        .status(201)
        .json({ message: "Formation_sanitaire created successfully" });
    });
  });
});
app.get("/formation_sanitaires", (req, res) => {
  const getAllTypesQuery = `SELECT * FROM  formation_sanitaires`;
  db.query(getAllTypesQuery, (err, results) => {
    if (err) {
      console.error("Error fetching formation sanitaire:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(results);
  });
});
app.put("/formation_sanitaires/:id", (req, res) => {
  const { id } = req.params;
  const { fs } = req.body;

  const updateGradeQuery = `UPDATE formation_sanitaires SET formation_sanitaire = ? WHERE id = ?`;
  db.query(updateGradeQuery, [fs, id], (err, result) => {
    if (err) {
      console.error("Error updating formation sanitaires:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Formation sanitaires not found" });
      return;
    }

    console.log("Formation sanitaires updated successfully");
    res
      .status(200)
      .json({ message: "Formation sanitaires updated successfully" });
  });
});
app.delete("/formation_sanitaires/:id", (req, res) => {
  const fSanitaireId = req.params.id;
  const deleteFSanitaireQuery = `DELETE FROM formation_sanitaires WHERE id = ?`;
  db.query(deleteFSanitaireQuery, [fSanitaireId], (err, result) => {
    if (err) {
      console.error("Error deleting formation_sanitaire:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({
        error:
          "Formation_sanitaire is referenced in another table and cannot be deleted",
      });
    }
    res
      .status(200)
      .json({ message: "Formation_sanitaire deleted successfully" });
  });
});

// ------------------------------------------ Grades ----------------------------------
app.post("/grades", (req, res) => {
  const { grade, corp } = req.body;
  const checkIfExistsQuery = `SELECT * FROM grades WHERE grade = ? AND corp_id = ?`;
  db.query(checkIfExistsQuery, [grade, corp], (err, results) => {
    if (err) {
      console.error("Error checking if grade exists:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ error: "Grade already exists" });
      return;
    }
    const createGradeQuery = `INSERT INTO grades (grade, corp_id) VALUES (?, ?)`;
    db.query(createGradeQuery, [grade, corp], (err, result) => {
      if (err) {
        console.error("Error creating grade:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      console.log("Grade created successfully");
      res.status(201).json({ message: "Grade created successfully" });
    });
  });
});
app.get("/grades", (req, res) => {
  const getAllGradesQuery = `
    SELECT grades.*, corps.corp
    FROM grades
    JOIN corps ON grades.corp_id = corps.id
  `;
  db.query(getAllGradesQuery, (err, results) => {
    if (err) {
      console.error("Error fetching grades:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(results);
  });
});
app.get("/gradesun", (req, res) => {
  const getAllGradesQuery = `SELECT * FROM grades`;
  db.query(getAllGradesQuery, (err, results) => {
    if (err) {
      console.error("Error fetching grades:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(results);
  });
});
app.put("/grades/:id", (req, res) => {
  const { id } = req.params;
  const { grade, corp_id } = req.body;

  const updateGradeQuery = `UPDATE grades SET grade = ?, corp_id = ? WHERE id = ?`;
  db.query(updateGradeQuery, [grade, corp_id, id], (err, result) => {
    if (err) {
      console.error("Error updating grade:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Grade not found" });
      return;
    }

    console.log("Grade updated successfully");
    res.status(200).json({ message: "Grade updated successfully" });
  });
});
app.delete("/grades/:id", (req, res) => {
  const GradeId = req.params.id;
  const deleteGradeQuery = `DELETE FROM grades WHERE id = ?`;
  db.query(deleteGradeQuery, [GradeId], (err, result) => {
    if (err) {
      console.error("Error deleting grade:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({
        error: "Grade is referenced in another table and cannot be deleted",
      });
    }
    res.status(200).json({ message: "Grade deleted successfully" });
  });
});

// ------------------------------------------ Corps ----------------------------------
app.post("/corps", (req, res) => {
  const { corp } = req.body;
  const checkIfExistsQuery = `SELECT * FROM corps WHERE corp = ?`;
  db.query(checkIfExistsQuery, [corp], (err, results) => {
    if (err) {
      console.error("Error checking if corp exists:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ error: "Corp already exists" });
      return;
    }
    const createCorpQuery = `INSERT INTO corps (corp) VALUES (?)`;
    db.query(createCorpQuery, [corp], (err, result) => {
      if (err) {
        console.error("Error creating corp:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      console.log("Corp created successfully");
      res.status(201).json({ message: "Corp created successfully" });
    });
  });
});
app.get("/corps", (req, res) => {
  const getAllCorpsQuery = `SELECT * FROM corps`;
  db.query(getAllCorpsQuery, (err, results) => {
    if (err) {
      console.error("Error fetching corps:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(results);
  });
});
app.put("/corps/:id", (req, res) => {
  const { id } = req.params;
  const { corpEdited } = req.body;

  const updateCorpQuery = `UPDATE corps SET corp = ? WHERE id = ?`;
  db.query(updateCorpQuery, [corpEdited, id], (err, result) => {
    if (err) {
      console.error("Error updating corp:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Corp not found" });
      return;
    }

    console.log("Corp updated successfully");
    res.status(200).json({ message: "Corp updated successfully" });
  });
});
app.delete("/corps/:id", (req, res) => {
  const corpId = req.params.id;
  const deleteCorpQuery = `DELETE FROM corps WHERE id = ?`;
  db.query(deleteCorpQuery, [corpId], (err, result) => {
    if (err) {
      console.error("Error deleting corp:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({
        error: "Corp is referenced in another table and cannot be deleted",
      });
    }
    res.status(200).json({ message: "Corp deleted successfully" });
  });
});

// ------------------------------------------ Users ----------------------------------
app.get("/users", (req, res) => {
  const { type } = req.query;
  let getUsersQuery = `
    SELECT id, username, type, nom, prenom, password
    FROM users
  `;

  if (type) {
    getUsersQuery += " WHERE type = ?";
  }

  getUsersQuery += " ORDER BY username ASC";

  db.query(getUsersQuery, type ? [type] : [], (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(results);
  });
});
app.post("/users", (req, res) => {
  const { username, password, type, nom, prenom } = req.body;
  const createUserQuery = `
    INSERT INTO users (username, password, type, nom, prenom)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    createUserQuery,
    [username, password, type, nom, prenom],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.status(400).json({ error: "User already exists" });
        } else {
          console.error("Error creating user:", err);
          res.status(500).json({ error: "Internal server error" });
        }
        return;
      }
      console.log("User created successfully");
      res.status(201).json({ message: "User created successfully" });
    }
  );
});
app.put("/users/:username", (req, res) => {
  const { username } = req.params;
  const { password, type, nom, prenom } = req.body;
  const updateUserQuery = `
    UPDATE users
    SET password = ?, type = ?, nom = ?, prenom = ?
    WHERE username = ?
  `;
  db.query(
    updateUserQuery,
    [password, type, nom, prenom, username],
    (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      console.log("User updated successfully");
      res.status(200).json({ message: "User updated successfully" });
    }
  );
});
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const deleteUserQuery = `
    DELETE FROM users
    WHERE id = ?
  `;
  db.query(deleteUserQuery, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.log("User deleted successfully");
    res.status(200).json({ message: "User deleted successfully" });
  });
});

// ------------------------------------------ API ------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
