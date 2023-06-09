const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "324170521", // your password here
  port: 3306,
  database: "FullStackProject6", // remove comment after first run
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database!");
});

// login route
app.post("/login", function (req, res) {
  const { userName, password } = req.body;

  var sql = "SELECT * FROM passwords WHERE username = ? AND password = ?";
  con.query(sql, ['Bret', '1vcrQXTk'], function (err, result) {
    if (err) {
      console.errnoor("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length === 0) {
      console.log("User not found");
      res.status(404).send("The username or the password are incorrect");
      return;
    }

    console.log("User found:", result);
    res.status(200).send(result);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
