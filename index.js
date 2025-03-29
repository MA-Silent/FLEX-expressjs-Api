const express = require('express');
const mysql = require('mysql2')
const fs = require('fs');
const app = express();
const port = 80;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const c = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'admin',
    password: 'admin',
    database: 'books'
});

c.connect((err)=>{
    if (err) throw err;
    console.log('SQL Connected!');
})

let id;
c.query('SELECT MAX(id) FROM author', (err, result)=>{
    if (err instanceof Error) throw err;
    id = result[0]["MAX(id)"] +1;
});

app.get("/", (req,res)=>{
    res.send(`test`);
})

app.get("/api", (req,res)=>{
    c.query('SELECT * FROM author', (err, result)=>{
        if (err instanceof Error) throw err;
        res.json(JSON.stringify(result))
    })
});

app.get("/api/:id", (req,res)=>{
    const sql = `SELECT * FROM author WHERE id = ${req.params.id}`
    c.query(sql,(err, result)=>{
        if (err instanceof Error) throw err;
        res.json(JSON.stringify(result))
    })
});

app.post("/api", jsonParser,(req,res)=>{
    const sql = 'INSERT INTO `author`(`id`,`name`,`most_populair`) VALUES (?,?,?)'
    const values = [id,`${req.body.name}`,`${req.body.most_populair}`];
    c.execute(sql,values, (err, result, fields)=> {
        if(err instanceof Error){
            console.log(err)
        }
        res.send(`Added with id \`${id}\``);
        id++;
    })
});

app.delete("/api/:id",(req,res)=>{
    const sql = `DELETE FROM author WHERE id = ${req.params.id}`;
    c.execute(sql, (err,result)=>{
        if (err instanceof Error) throw err;
            res.write(`${result.affectedRows} Rows were affected`);
        res.send();
    })
});

app.listen(port, ()=>{
    console.log(`app is online on http://localhost:${port}`)
})