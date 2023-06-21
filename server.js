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

//get user todos 

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

//update todo

app.put(`/users/:userid/todos`, function (req, res) {

  const {id,title,completed}=req.body
  console.log(completed);
  var completedValue =0; 
  if(completed)
   completedValue=1;
  console.log(completedValue)

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
    
    console.log(`${id} ${title}`);
    const query = `UPDATE todos SET title = '${title}' , completed ='${completedValue}' WHERE id = ${id}`;
    console.log(query)
    con.query(query, (err, result) => {
      if (err) {
        console.log("Error executing the query:", err);
        return;
      }
      console.log(result.length)
      res.status(200).send("the todo was updated")
        con.end();
      });
    });
 });

//delete todo

app.delete(`/users/:userId/todos/:todoId`, function (req, res) {

  const {userId,todoId}=req.params;
  console.log(`${userId} ${todoId}`);

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
    
    
    const query = `UPDATE todos SET deleted ='1' WHERE id = ${todoId}`;
    console.log(query)
    con.query(query, (err, result) => {
      if (err) {
        console.log("Error executing the query:", err);
        return;
      }
      console.log(result.length)
      res.status(200).send("the todo was deleted")
        con.end();
      });
    });
 });

 //add todo
 app.post(`/users/:userId/todos`, function (req, res) {

  const {userId}=req.params;
  const {newTodo}=req.body;
  console.log(`${userId} ${newTodo}`);

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
    
    
    const query=`INSERT INTO todos (userId,title,completed,deleted) VALUES ('${userId}','${newTodo}','0','0')`;
    console.log(query)
    con.query(query, (err, result) => {
      if (err) {
        console.log("Error executing the query:", err);
        return;
      }
      console.log("there is new todo in the database");
      const queGet=`SELECT * FROM todos WHERE userId = ${userId}`
      console.log(queGet);
      con.query(queGet, (err, result) => {
        if (err) {
          console.log("Error executing the query:", err);
          return;
        }
        console.log(result.length);
         return res.status(200).json(result) 
        });
        con.end();
      });
      
    });
 });


 //get user posts 

app.get(`/users/:userid/posts`, function (req, res) {
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

    const que = `SELECT * FROM posts WHERE userId = '${userid}'`;
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

  //update post
app.put(`/users/:userid/posts/:postId`, function (req, res) {
  const {postId}=req.params;
  const {title,body}=req.body;

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
    
    console.log(`${postId} ${title} ${body}`);
    const query = `UPDATE posts SET body = '${body}' ,  title = '${title}'  WHERE id = ${postId}`;
    console.log(query)
    con.query(query, (err, result) => {
      if (err) {
        console.log("Error executing the query:", err);
        return;
      }
      console.log("the post updated");
      res.status(200).send("the post was updated")
        con.end();
      });
    });
  });

//get comments for post
  app.get(`/users/:userid/posts/:postid`, function (req, res) {
    const postid=req.params.postid;
    console.log(postid)
  
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
  
      const que = `SELECT * FROM comments WHERE postId = '${postid}'`;
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


 //update comment   
app.put(`/users/:userid/posts/:postId/comments/:commentId`, function (req, res) {
  const {commentId}=req.params;
  const {commentName,commentBody}=req.body;

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
    
    console.log(`${commentId} ${commentName} ${commentBody}`);
    const query = `UPDATE comments SET name = '${commentName}' ,  body = '${commentBody}'  WHERE id = ${commentId}`;
    console.log(query)
    con.query(query, (err, result) => {
      if (err) {
        console.log("Error executing the query:", err);
        return;
      }
      console.log("the comment updated");
      res.status(200).send("the post was updated")
        con.end();
      });
    });
  });

//add post for user
  app.post(`/users/:userId/posts`, function (req, res) {

    const {userId}=req.params;
    const {newPostTitle,newPostBody}=req.body;
    console.log(`${newPostTitle} ${newPostBody}`);
  
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
      
      
      const query=`INSERT INTO posts (userId,title,body) VALUES ('${userId}','${newPostTitle}','${newPostBody}')`;
      console.log(query)
      con.query(query, (err, result) => {
        if (err) {
          console.log("Error executing the query:", err);
          return;
        }
        console.log("there is new todo in the database");
        const queGet=`SELECT * FROM posts WHERE userId = ${userId}`
        console.log(queGet);
        con.query(queGet, (err, result) => {
          if (err) {
            console.log("Error executing the query:", err);
            return;
          }
          console.log(result.length);
          return res.status(200).json(result) 
          });
          con.end();
        });
        
      });
  });
    
//delete post
app.delete(`/users/:userId/posts/:postId`, function (req, res) {

  const {userId,postId}=req.params;
  console.log(`${userId} ${postId}`);

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
    
    
    const query = `UPDATE posts SET deleted ='1' WHERE id ='${postId}'`;
    console.log(query)
    con.query(query, (err, result) => {
      if (err) {
        console.log("Error executing the query:", err);
        return;
      }
      console.log(result.length)
      res.status(200).send("the post was deleted")
        con.end();
      });
    });
  });

//add comment
  app.post(`/users/:userId/posts/:postId`, function (req, res) {

    const {postId}=req.params;
    const {newPostTitle,newPostBody,userEmail}=req.body;
    console.log(`${newPostTitle} ${newPostBody} ${userEmail}`);
  
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
      
      
      const query=`INSERT INTO comments (postId,name,email,body) VALUES ('${postId}','${newPostTitle}','${userEmail}','${newPostBody}')`;
      console.log(query)
      con.query(query, (err, result) => {
        if (err) {
          console.log("Error executing the query:", err);
          return;
        }
        console.log("there is new comment in the database");
        const queGet=`SELECT * FROM comments WHERE postId = ${postId}`
        console.log(queGet);
        con.query(queGet, (err, result) => {
          if (err) {
            console.log("Error executing the query:", err);
            return;
          }
          console.log(result.length);
          return res.status(200).json(result) 
          });
          con.end();
        });
        
      });
  });
    
//delete comment
  app.delete(`/users/:userId/posts/:postId/comments/:commentId`, function (req, res) {

    const {commentId}=req.params;
    console.log(`${commentId}`);
  
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
      
      
      const query = `UPDATE comments SET deleted ='1' WHERE id ='${commentId}'`;
      console.log(query)
      con.query(query, (err, result) => {
        if (err) {
          console.log("Error executing the query:", err);
          return;
        }
        console.log(result.length)
        res.status(200).send("the post was deleted")
          con.end();
        });
      });
    });
  
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
