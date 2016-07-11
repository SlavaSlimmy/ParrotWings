var express = require('express'),
    jwt     = require('express-jwt'),
    _       = require('lodash'),
    config  = require('./config'),
    data    = require('./data');

var app = module.exports = express.Router();
var users = data.getUsers();
var transactions = data.getTransactions();

var jwtCheck = jwt({
  secret: config.secret
});

app.use('/api/protected', jwtCheck);

app.get('/api/protected/transactions', function(req, res) {
  if (!req.user) {
    return res.status(401).send("The username don't found.");
  }
  var transactions_list = [];
  var transactions_list_temp = _.filter(transactions, {user_id: req.user.id});

  _(transactions_list_temp).forEach(function(value) {
    var username = _.find(users, {id: value.corr_user_id});
    transactions_list.push({id: value.id, date: value.date, username: username.username, amount: value.amount, balance: value.balance});
  });

  res.status(200).send({
    trans_token: transactions_list
  });
});

app.post('/api/protected/transactions', function(req, res) {
  var user = _.find(users, {id: req.user.id});
  var corr_user = _.find(users, {username: req.body.name});
  var amount = +req.body.amount;
  if (!corr_user) {
    return res.status(400).send("Account with such username not found.");
  }

  var trans_date = new Date().toLocaleString('ru');

  var user_balance = user.balance - amount;
  user.balance = user_balance;

  var user_trans = {user_id: req.user.id, date: trans_date, corr_user_id: corr_user.id, amount: -amount, balance: user_balance };
  user_trans.id = _.max(transactions, 'id').id + 1;
  transactions.push(user_trans);

  var user_trans_return = {id: user_trans.id, date: user_trans.date, username: corr_user.username, amount: user_trans.amount, balance: user_trans.balance};

  var corr_user_balance = corr_user.balance + amount;
  corr_user.balance = corr_user_balance;

  var corr_user_trans = {user_id: corr_user.id, date: trans_date, corr_user_id: user.id, amount: amount, balance: corr_user_balance };
  corr_user_trans.id = _.max(transactions, 'id').id + 1;
  transactions.push(corr_user_trans);

  res.status(200).send({
    trans_token: user_trans_return
  });
});

app.get('/api/protected/user-info', function(req, res) {
  if (!req.user) {
    return res.status(401).send("The username don't found.");
  }
  var user = _.find(users, {id: req.user.id});
  var user_info = {id: user.id, name: user.username, email: user.email, balance: user.balance};

  res.status(200).send({
    user_info_token: user_info
  });
});

app.post('/api/protected/users/list', function(req, res) {
  if (!req.user) {
    return res.status(401).send("The username don't found.");
  }
  if (!req.body.filter) {
    return res.status(401).send("No search string.");
  }

  var search_str = req.body.filter.trim().toLowerCase();
  var user_owner = _.find(users, {id: req.user.id});

  var users_list = [];
  var users_list_temp = _.without(users, user_owner);

  _(users_list_temp).forEach(function(value) {
    if (value.username.toLowerCase().indexOf(search_str) == 0) {
      users_list.push({id: value.id, name: value.username});
    }
  });

  res.status(200).send(users_list);

});