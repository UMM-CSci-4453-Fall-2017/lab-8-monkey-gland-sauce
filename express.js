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

var getButtonsInfo = function(dbf){
  var sql = "SELECT * FROM " + credentials.user + ".till_buttons";
  queryResults = dbf.query(mysql.format(sql));
  return(queryResults);
}

var fillInButtonsArray = function(result){
  buttons = result;
  return(buttons);
}

var getTransactionData = function(dbf){
  var sql = "SELECT * FROM " + credentials.user + ".transaction";
  queryResults = dbf.query(mysql.format(sql));
  return(queryResults);
}

var getTransactionAmount = function(dbf, sql){
  queryResults = dbf.query(mysql.format(sql));
  return(queryResults);
}

var fillIntotalAmt = function(result){
  totalAmt = result;
  return(totalAmt);
}

var fillInList = function(result){
  list = result;
  return(list);
}

var insertIntoTransaction = function(dbf, sql){
  dbf.query(mysql.format(sql));
}

var truncateTable = function(dbf, sql){
  dbf.query(mysql.format(sql));
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

app.get("/list",function(req,res){
  var query = getTransactionData(dbf)
  .then(fillInList)
  .then(function (list) {
    res.send(list);})
  .catch(function(err){console.log("DANGER:",err)});
});

// app.get("/user", function(req, res){
//   console.log("helloo");
//   res.send(credentials.user);
// });

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
  var query = insertIntoTransaction(dbf, sql);
  //.catch(function(err){console.log("DANGER:",err)});
});

app.post("/delete", function(req,res){
  var id = req.param('id');
  var sql = 'DELETE FROM ' + credentials.user + '.transaction where id = ' + id;
  var query = insertIntoTransaction(dbf, sql);
});

app.get("/total", function(req, res){
  var sql = 'SELECT SUM(cost) AS TOTAL FROM ' + credentials.user + '.transaction';
  var query = getTransactionAmount(dbf, sql)
  .then(fillIntotalAmt)
  .then(function (totalAmt) {
    res.send(totalAmt);})
  .catch(function(err){console.log("DANGER:",err)});
})

app.listen(port);
