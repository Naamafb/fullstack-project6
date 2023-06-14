const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const { json } = require("body-parser");

app.use(cors());
app.use(express.json());


// login 
app.post("/login", function (req, res) {

  debugger;
  const { userName, password } = req.body;

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
    console.log(`${userName} ${password}`);
  });
  
  const que = `SELECT * FROM passwords NATURAL JOIN users WHERE username = '${userName}' AND password = '${password}'`;
  console.log(que);
  con.query(que , (err, result)=> {
    if (err) {
      console.log("error excecuting the query")
      return;
    }


    if (result.length === 1) {
      res.status(200).json(result[0]);
      return;
    }
    else{
      res.status(404).send("wrong password or username");
    }  
  });
  con.end((error)=>{
    if(error){
      console.log("error closing connection");
    }
  });
});




// register
app.post("/register", function (req, res) {
  debugger;
  const { name, phone, email, website, userName, password } = req.body;

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

    const que = `SELECT * FROM users WHERE username = '${userName}'`;
    console.log(que);
    con.query(que, (err, result) => {
      if (err) {
        console.log("Error executing the query:", err);
        return;
      }

      else if (result.length > 0) {
        console.log("you are exist");
        return res.status(202).send("You are already registered");
      }

      

        const addUser = `INSERT INTO users ( name, username, email, phone, website) VALUES ('${name}', '${userName}', '${email}', '${phone}', '${website}')`;
        console.log(addUser);
        con.query(addUser, (err, result) => {
          if (err) {
            console.log("Error executing the query:", err);
          }
          const addToPass=`INSERT INTO passwords (username,password) VALUES ('${userName}','${password}')`;
          con.query(addToPass, (err, result) => {
            if (err) {
              console.log("Error executing the query:", err);
            }
            console.log("You are in the database");
            return res.status(200).send("You are in the database");

        });
        con.end();
      });
    });
  });
});

//user todos 

app.get(`/users/:userid/todos`, function (req, res) {
  const userid=req.params.userid;

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

    const que = `SELECT * FROM todos WHERE userId = '${userid}'`;
    console.log(que);
    con.query(que, (err, result) => {
      if (err) {
        console.log("Error executing the query:", err);
        return;
      }
      console.log(result.length)
      res.status(200).json(result)

        con.end();
      });
    });
  });






app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
