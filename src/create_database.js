// כל הקובץ הזה הוא חוכמתו הבלעדית של ה' יתברך ואין לי שום קרטית או חלק בכל אות ואות שנכבתה כאן, ובכלל
const mysql = require('mysql2');
const http = require('http');

/*
  Hi There!
  Thanks for Choosing Us.
  Steps For Activation:
  1) check the password property to your password at line 106
  2) if you HAVEN'T use the old file, just run the code and after that uncomment 109
  3) if you do use the old file, uncomment line 109, and uncomment lines 123-134 (included)
  and make a first run. after that comment lines 123-134 (included) and run again.
  FINISH
  Good-Luck
 */

const getDataJPH = async (path_name) => {
    const options = {
      hostname: 'jsonplaceholder.typicode.com',
      path: `/${path_name}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    let data = '';
  
    return new Promise((resolve, reject) => {
      const request = http.request(options, (response) => {
        // Set the encoding, so we don't get logged a bunch of gibberish binary data
        response.setEncoding('utf8');
  
        // As data starts streaming in, add each chunk to "data"
        response.on('data', (chunk) => {
          data += chunk;
        });
  
        // The whole response has been received
        response.on('end', () => {
          console.log('Finish Get Data');
          resolve(data); // Resolve the promise with the received data
        });
      });
  
      // Log errors if any occur
      request.on('error', (error) => {
        reject(error); // Reject the promise if an error occurs
      });
  
      // End the request
      request.end();
    });
};

const addColumn = async (tableName, columnName, values, datatype) =>{

      // Create the ALTER TABLE query to add the new column
      const alterTableQuery = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${datatype}`;

      // Execute the ALTER TABLE query to add the new column
      return await new Promise((resolve,reject) => {
        con.query(alterTableQuery, (err) => {
          if (err) throw err;
          console.log(`Column '${columnName}' added successfully`);

          // Loop through the values and insert them into the table
          values.forEach((value, index) => {
            const insertQuery = `UPDATE ${tableName} SET ${columnName} = ? WHERE id = ?`;

            con.query(insertQuery, [value, index + 1], (err, result) => {
              if (err) throw reject(err);
              console.log(`Value '${value}' inserted successfully`);
              resolve(result)
            });
          });
        })
      });
}

const modifyColumn = (tableName, columnName, signs) => {
  const sql = `ALTER TABLE ${tableName} MODIFY ${columnName} ${signs.join(' ')}`
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(`Modify ${columnName} for table ${tableName} Successfully Done`);
  });
}

const addForeignKey = (tableName, constraint_name, ColumnName,foreignTableName,foreignColumnName) => {
  const sql = `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraint_name} FOREIGN KEY (${ColumnName}) REFERENCES ${foreignTableName} (${foreignColumnName})`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Foreign key constraint added successfully');
  });
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  
  return randomString;
}

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "324170521",
    port: 3306,
    database: 'FullStackProject6'
  });
  
con.connect(async function(err) {
    if (err) throw err;
    console.log("Connected!");

    // con.query("SELECT api_key FROM users", function (err, result) {
    //   if (err) throw err;
    //   console.log(result);
    // });
    // return;
    
    // con.query("DROP DATABASE FullStackProject6", function (err, result) {
    //     if (err) throw err;
    //     console.log("Database Dropped");
    // });

    //Creating The database
    // con.query("CREATE DATABASE FullStackProject6", function (err, result) {
    //   if (err) throw err;
    //   console.log("Database Created");
    // });

    //  return;

    const convertTypes = {'number': 'INT','string':'VARCHAR(511)','boolean':'BOOLEAN'}
    const tableNames = ['users','posts','todos','comments']
    // loop through the list:
    for (const tableName of tableNames){
        // make api call to jsonplaceholder
        let data = await getDataJPH(tableName)
        data = JSON.parse(data)

        // set string to create table
        let sql = `CREATE TABLE ${tableName} (`
        const instanceExample = data[0]
        Object.entries(instanceExample).forEach(([key, value]) => {
            const value_type = typeof(value)
            if (value_type === 'number' || value_type === 'string' || value_type === 'boolean')
                sql += `${key} ${convertTypes[value_type]},`
        });
        sql = sql.slice(0, -1) + ')';

        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });

        // set string to insert into the table
        sql = `INSERT INTO ${tableName} (`
        Object.entries(instanceExample).forEach(([key, value]) => {
            const value_type = typeof(value)
            if (value_type === 'number' || value_type === 'string'|| value_type === 'boolean' )
                sql += `${key},`
        });
        sql = sql.slice(0, -1) + ') VALUES ?';
        // set values for the table
        const values = data.map((instance) => {
            return Object.values(instance).filter(value => (typeof(value) === 'number' || typeof(value) === 'string' || typeof(value) === 'boolean'));
        })
        // make a query
        con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        });
    }

    // Create user-password Table
    con.query("SELECT id, username FROM users", async function (err, result, fields) {
      if (err) throw err;
      result = result.map(value => { return {...value, password:generateRandomString(8)}})
      let sql = "CREATE TABLE passwords (id INT, username VARCHAR(511), password VARCHAR(32))";
      con.query(sql, function (err, result2) {
          if (err) throw err;
          
          sql = 'INSERT INTO passwords ('
          Object.entries(result[0]).forEach(([key, value]) => {
            sql += `${key},`
          });
          sql = sql.slice(0, -1) + ') VALUES ?';
          // set values for the table
          const values = result.map((instance) => {
              return Object.values(instance);
          })
          // make a query
          con.query(sql, [values], function (err, result3) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
          });
      });

      // Fix Signs To Columns

      // modify id
      tableNames.push('passwords');
      const tablesVarchar = 'VARCHAR(511)';
      const tablesInt = 'INT'

      tableNames.forEach((tableName) => {
        modifyColumn(tableName,'id',[tablesInt, 'AUTO_INCREMENT', 'PRIMARY KEY'])
      });

      // users
      let tableName = 'users'
      await addColumn(tableName,'`rank`',Array(10).fill('user'),'VARCHAR(20)')
      await addColumn(tableName,'api_key',Array(10).fill().map(() => generateRandomString(20)),'VARCHAR(20)')
      modifyColumn(tableName,'api_key',['VARCHAR(20)', 'UNIQUE', 'NOT NULL'])
      modifyColumn(tableName,'username',[tablesVarchar, 'UNIQUE', 'NOT NULL'])
      modifyColumn(tableName,'`rank`',['VARCHAR(20)', 'NOT NULL'])

      // posts
      tableName = 'posts'
      Array( 'title', 'body').forEach((columnName) => modifyColumn(tableName,columnName, [tablesVarchar, 'NOT NULL']))
      modifyColumn(tableName,'userId',[tablesInt, 'NOT NULL'])
      addForeignKey(tableName,'postUserId','userId','users','id')

      // todos
      tableName = 'todos'
      modifyColumn(tableName,'title',[tablesVarchar, 'NOT NULL'])
      modifyColumn(tableName,'userId',[tablesInt, 'NOT NULL'])
      modifyColumn(tableName,'completed',['BOOLEAN', 'NOT NULL', 'default 0'])
      addForeignKey(tableName,'todosUserId','userId','users','id')

      // comments
      tableName = 'comments'
      Array('name', 'body', 'email').forEach((columnName) => modifyColumn(tableName,columnName,[tablesVarchar, 'NOT NULL']))
      modifyColumn(tableName, 'postId', [tablesInt,'NOT NULL'])
      addForeignKey(tableName,'commentPostId','postId','posts','id')

      // passwords
      tableName = 'passwords'
      modifyColumn(tableName,'password',['VARCHAR(32)','NOT NULL'])
      addForeignKey(tableName,'userusername','username','users','username')

      console.log('Wow! Everthing Is Up And Ready To Go!\nHappy Hacking!')
   });
});