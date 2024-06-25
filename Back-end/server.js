const jwt = require("jsonwebtoken");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

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

app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers["gestion-des-conges"];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

// ------------------------------------------ Users ----------------------------------
app.post("/users", (req, res) => {
  const { username, password, type, nom, prenom } = req.body;
  const checkIfExistsQuery = `SELECT * FROM users WHERE username = ?`;
  db.query(checkIfExistsQuery, [username], (err, results) => {
    if (err) {
      console.error("Error checking if user exists:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ error: "User already exists" });
      return;
    }
    const createUserQuery = `INSERT INTO users (username, password, type, nom, prenom) VALUES (?, ?, ?, ?, ?)`;
    db.query(
      createUserQuery,
      [username, password, type, nom, prenom],
      (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        console.log("User created successfully");
        res.status(201).json({ message: "User created successfully" });
      }
    );
  });
});
app.put("/users/:username", (req, res) => {
  const { password, type, nom, prenom } = req.body;
  const { username } = req.params;
  const checkIfExistsQuery = `SELECT * FROM users WHERE username = ?`;
  db.query(checkIfExistsQuery, [username], (err, results) => {
    if (err) {
      console.error("Error checking if user exists:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const updateUserQuery = `UPDATE users SET password = ?, type = ?, nom = ?, prenom = ? WHERE username = ?`;
    db.query(
      updateUserQuery,
      [password, type, nom, prenom, username],
      (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        console.log("User updated successfully");
        res.status(200).json({ message: "User updated successfully" });
      }
    );
  });
});
app.get("/users", (req, res) => {
  const { type } = req.query;
  let sql = "SELECT * FROM users";

  if (type) {
    sql += " WHERE type = ?";
  }

  db.query(sql, [type], (err, results) => {
    if (err) {
      console.error("Error getting users:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    console.log("Users retrieved successfully");
    res.status(200).json(results);
  });
});
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM users WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Internal server error" });
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
