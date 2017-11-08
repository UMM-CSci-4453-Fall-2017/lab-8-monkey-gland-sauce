Promise=require('bluebird')
mysql=require('mysql');
dbf=require('./dbf-setup.js');
var credentials = require('./credentials.json');

var express=require('express'),
app = express(),
port = process.env.PORT || 1337;

var buttons = [];
var list = [];
var databases = [];
var totalAmt = [];

var queryDatabase = function(dbf, sql){
  queryResults = dbf.query(mysql.format(sql));
  return(queryResults);
}

var fillInArray = function(result){
  buttons = result;
  return(buttons);
}

var sendToDatabase = function(dbf, sql){
  dbf.query(mysql.format(sql));
}


app.use(express.static(__dirname + '/public')); //Serves the web pages
app.get("/buttons",function(req,res){
  var sql = "SELECT * FROM " + credentials.user + ".till_buttons";
  var query = queryDatabase(dbf, sql)
  .then(fillInArray)
  .then(function (buttons) {
    res.send(buttons);})
  .catch(function(err){console.log("DANGER:",err)});
});

app.post("/void",function(req,res){
  var sql = "TRUNCATE TABLE " + credentials.user + ".transaction";
  var query = sendToDatabase(dbf, sql);
  res.send();
});

app.get("/list",function(req,res){
  var sql = "SELECT * FROM " + credentials.user + ".transaction";
  var query = queryDatabase(dbf, sql)
  .then(fillInArray)
  .then(function (list) {
    res.send(list);})
  .catch(function(err){console.log("DANGER:",err)});
});

app.post("/click",function(req,res){
  var id = req.param('id');
  var sql;
  if (id == '1'){
    sql = 'insert into ' + credentials.user + '.transaction values (1, "hot dogs", 1, 0.78) ' +
    'on duplicate key update amount = amount + 1, cost = cost + 0.78';
  }
  if (id == '2'){
    sql = 'insert into ' + credentials.user + '.transaction values (2, "dabu dabu", 1, 1.78) ' +
    'on duplicate key update amount = amount + 1, cost = cost + 1.78';
  }
  if (id == '3'){
    sql = 'insert into ' + credentials.user + '.transaction values (3, "anchovy paste", 1, 2.50) ' +
    'on duplicate key update amount = amount + 1, cost = cost + 2.50';
  }
  if (id == '4'){
    sql = 'insert into ' + credentials.user + '.transaction values (4, "tabasco", 1, 1.25) ' +
    'on duplicate key update amount = amount + 1, cost = cost + 1.25';
  }
  var query = sendToDatabase(dbf, sql);
  res.send();
});

app.post("/delete", function(req,res){
  var id = req.param('id');
  var sql = 'DELETE FROM ' + credentials.user + '.transaction where id = ' + id;
  var query = sendToDatabase(dbf, sql);
  res.send();
});

app.get("/total", function(req, res){
  var sql = 'SELECT SUM(cost) AS TOTAL FROM ' + credentials.user + '.transaction';
  var query = queryDatabase(dbf, sql)
  .then(fillInArray)
  .then(function (totalAmt) {
    res.send(totalAmt);})
  .catch(function(err){console.log("DANGER:",err)});
})

app.listen(port);
