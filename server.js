const express=require("express");
const app=express();
const cors=require("cors");
const mysql=require("mysql");

app.use(cors());
app.use(express.json());



//login require
app.post("./login",function(req,res)
 {
    const {userName,password}=req.body;

    if(!userName||!password){
        res.status(400).send("You most write User Name and Password");
    }
    else{
    console.log(`N: ${userName} P: ${password}`);
    }
 }
);

app.listen(3000,()=>{
    console.log("server is running on port 3000");
});

