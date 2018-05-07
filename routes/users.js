var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var joi =require('joi');

var conn=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'myapp',
  port : 3306
});
conn.connect(function(err){
  if(err) throw err;
  console.log('Connected to DB');
});

/* GET users listing. */
//Select all
router.get('/', function(req, res, next) {
  //with sql
  var sql="Select * from user";
  conn.query(sql,function(err,result){
    console.log("hi"+ result);
    if (err) throw err;
    res.send(result)
  });
});

//Select by id
router.get('/:id',(req,res,next)=>{
  var sql="Select * from user where id="+req.params.id;
  conn.query(sql,function(err,result){
    if (err) throw err;
    console.log("Hi result "+result)
    if(JSON.stringify(result)==='[]')
    return res.status(404).send("The given ID wasn't found");
    else {res.send(result);}
  });
});

// Insert(POST)
router.post('/',(req,res)=>{
  //validate value
  const {error}=validateValue(req.body);
  if(error){return res.status(400).send(error.details[0].message);}
  //insert
  var sql="INSERT INTO user(name) VALUES ('"+req.body.name+"')";
  conn.query(sql,function(err,result){
    if (err) throw err;
    res.send(req.body.name+" is successfully save!")
  });
});

// Update(PUT)
router.put('/:id',(req,res)=>{
  //validate value
  const {error}=validateValue(req.body);
  if(error){return res.status(400).send(error.details[0].message);}
  //update
  var sql="Update user set name='"+req.body.name+"' where id="+req.params.id;
  conn.query(sql,function(err,result){
    if (err) throw err;
    console.log("result "+result.affectedRows)
    if(result.affectedRows>0)
    res.send("id "+req.params.id+" is successfully updated!");
    else {return res.status(404).send("The given ID wasn't found");}
  });
});

//Delete 
router.delete('/:id',(req,res)=>{
    //delete
    var sql="Delete from user where id="+req.params.id;
    conn.query(sql,function(err,result){
      if (err) throw err;
      console.log("result "+result.affectedRows)
      if(result.affectedRows>0)
      res.send("id "+req.params.id+" is successfully deleted!");
      else {return res.status(404).send("The given ID wasn't found");}
    });
});

// custom function
function validateValue(user){
  const schema= {name:joi.string().required()};
  return joi.validate(user,schema)
}
module.exports = router;
