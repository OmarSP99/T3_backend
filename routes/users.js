var express = require('express');
var router = express.Router();
const { Pool } = require('pg')
const conn = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'omar1401',
  port: 5432,
}
const pool = new Pool(conn)

router.get('/', function(req, res) {
  pool.query("SELECT * FROM Users;", (err, response) => {
    if(err) {
      res.status(500).send( { error : err } );
    } else {
      res.status(200).send( { usuarios : response.rows } );
    }
  });
});

router.post('/', function(req, res) {
  let body = req.body;
  let name = body.name;
  let age = body.age;
  
  if( name == undefined || age == undefined ) {
    res.status(400).send( { error : "Faltan datos" } );
    return;
  }
  if(name.length < 5) {
    res.status(400).send( { error : "Nombre muy corto" } );
    return;
  }
  if(age <= 0) {
    res.status(400).send( { error : "La edad debe de ser mayor a 0" } );
    return;
  }

  let query = "INSERT INTO Users(name, age) VALUES($1, $2) RETURNING *;";
  let values = [`${name}`, `${age}`];

  pool.query(query, values, (err, response) => {
    if(err) {
      res.status(500).send( { error : err } );
    } else {
      res.status(201).send( { status : "usuario creado", usuario : response.rows[0] } );
    }
  });
});

router.put('/:id', function(req,res){
  let id = req.params.id;
  let body = req.body;
  let name = body.name;
  let age = body.age;
  
  if( name == undefined || age == undefined ) {
    res.status(400).send( { error : "faltan datos" } );
    return;
  }
  if(name.length < 5) {
    res.status(400).send( { error : "Nombre muy corto" } );
    return;
  }
  if(age <= 0) {
    res.status(400).send( { error : "la edad debe ser mayor a 0" } );
    return;
  }

  let query = "UPDATE Users SET name = $1, age = $2 WHERE userid = $3 RETURNING *;";
  let values = [`${name}`, `${age}`,`${id}`];

  pool.query(query, values, (err, response) => {
    if(err) {
      res.status(500).send( { error : err } );
    } else {
      res.status(201).send( { status : "Usuario modificado", usuario : response.rows[0] } );
    }
  });

});

router.delete('/:id', function(req, res) {
  let id = req.params.id;
  let query = "DELETE FROM Users WHERE userid = $1 RETURNING *;";
  let values = [`${id}`];
  pool.query(query, values, (err, response) => {
    if(err) {
      res.status(500).send( { error : err } );
    } else {
      res.status(201).send( { status : "Usuario eliminado", usuario : response.rows[0] } );
    }
  });
});

module.exports = router;