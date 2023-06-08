const express=require("express");
const app=express();
const cors=require("cors");
const mysql=require("mysql2");

app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "324170521", // your password here
    port: 3306,
    database: 'FullStackProject6' //- remove comment after first run
  });
  con.connect(async function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


//login require
app.post("/login",function(req,res)
 {
    const {userName,password}=Json.parse(req.body);
            //  console.log("hi im here")
            // res.status(200).send("hi");

     var sql = 'SELECT id FROM passwords WHERE username = ? AND password = ?';
     con.query(sql, [userName, password], function (err, result) {
        console.log(result)
        res.status(200).send(result);
         if (err){
            console.log("not found")
            res.status(404).send("The username or the password aren't correct");
         }
     });
    });

app.listen(3000,()=>{
    console.log("server is running on port 3000");
});

