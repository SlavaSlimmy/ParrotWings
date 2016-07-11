var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken'),
    data    = require('./data');

var app = module.exports = express.Router();
var users = data.getUsers();
var transactions = data.getTransactions();
var signup_bonus = 500;

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60*5 });
}

app.post('/users', function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }
  if (_.find(users, {email: req.body.email})) {
   return res.status(400).send("A user with that email already exists");
  }

  var profile = _.pick(req.body, 'username', 'password', 'email', 'extra');
  profile.id = _.max(users, 'id').id + 1;
  profile.balance = signup_bonus;

//  var system_trans = {user_id: profile.id, date: new Date().toLocaleString('ru'), corr_user_id: 1, amount: signup_bonus, balance: signup_bonus};
//  system_trans.id = _.max(transactions, 'id').id + 1;

//  transactions.push(system_trans);

  users.push(profile);

  res.status(201).send({
    id_token: createToken(profile)
  });
});

app.post('/sessions/create', function(req, res) {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("You must send email and password.");
  }

  var user = _.find(users, {email: req.body.email});
  if (!user) {
    return res.status(401).send("Account with such email not found.");
  }

  if (!(user.password === req.body.password)) {
    return res.status(401).send("Invalid password.");
  }

  res.status(201).send({
    id_token: createToken(user)
  });
});
