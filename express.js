Promise=require('bluebird')
mysql=require('mysql');
dbf=require('./dbf-setup.js');
var credentials = require('./credentials.json');

var express=require('express'),
app = express(),
port = process.env.PORT || 1337;

var buttons = [];
var databases = [];

var getButtonsInfo = function(dbf){
  var sql = "SELECT * FROM " + credentials.user + ".till_buttons";
  queryResults = dbf.query(mysql.format(sql));
  return(queryResults);
}

var insertIntoTransaction = function(dbf, sql){
  dbf.query(mysql.format(sql));
}

var truncateTable = function(dbf, sql){
  dbf.query(mysql.format(sql));
}

var fillInButtonsArray = function(result){
  buttons = result;
  return(buttons);
}

var getCurrentUser = function(){
  return(credentials.user);
}


app.use(express.static(__dirname + '/public')); //Serves the web pages
app.get("/buttons",function(req,res){
  var query = getButtonsInfo(dbf)
  .then(fillInButtonsArray)
  .then(function (buttons) {
    res.send(buttons);})
  .catch(function(err){console.log("DANGER:",err)});
});

app.post("/void",function(req,res){
  var sql = "TRUNCATE TABLE " + credentials.user + ".transaction";
  var query = truncateTable(dbf, sql);
});

app.get("/user", function(req, res){
  res.send(getCurrentUser());
});

app.post("/click",function(req,res){
  var id = req.param('id');
  var sql;
  if (id == '1'){
    sql = 'INSERT INTO ' + credentials.user + '.transaction(name, amount, cost) values ("hot dogs", 1, 2.50)';
  }

  if (id == '2'){
    sql = 'INSERT INTO ' + credentials.user + '.transaction(name, amount, cost) values ("dabu dabu", 1, 1.50)';
  }

  if (id == '3'){
    sql = 'INSERT INTO ' + credentials.user + '.transaction(name, amount, cost) values ("anchovy paste", 1, 3.50)';
  }

  if (id == '4'){
    sql = 'INSERT INTO ' + credentials.user + '.transaction(name, amount, cost) values ("tabasco", 1, 4.50)';
  }

  var query = insertIntoTransaction(dbf, sql);
  //.catch(function(err){console.log("DANGER:",err)});
  });
app.listen(port);
