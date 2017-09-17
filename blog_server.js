"use strict";

const _            = require('lodash');
const express      = require('express');
const bodyParser   = require('body-parser');
const config  = require('./knexfile.js');

// Initialize Express.
const app = express();
app.use(bodyParser.json());

// Configure & Initialize Bookshelf & Knex.
console.log('Running in environment: ' + process.env.NODE_ENV);
const knex = require('knex')(config[process.env.NODE_ENV]);
const bookshelf = require('bookshelf')(knex);

// models
const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  posts: function() {
    return this.hasMany('Posts');
  }
});
exports.User = User;

const Posts = bookshelf.Model.extend({
  tableName: 'posts',
  hasTimestamps: true,

  author: function() {
    return this.belongsTo('User');
  }
});
exports.Posts = Posts;

exports.Comments = bookshelf.Model.extend({
  tableName: 'comments',
  hasTimestamps: true
});

// routes

const validUser = user => (
  user && user.name && user.email && user.username
)

app.post('/user', (req, res) => {
  const user = req.body;
  if (validUser(user)) {
    User.forge(user).save()
    .then(usr => {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json; charset=utf-8');
      res.end(JSON.stringify(usr));
    });
  } else {
    res.statusCode = 400;
    res.end();
  }
});

app.get('/user/:id', (req, res) => {
  User.forge({id: req.params.id})
    .fetch()
    .then((user) => {
      if (user) {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json; charset=utf-8');
        res.end(JSON.stringify(user));
      } else {
        res.sendStatus(404);
      }
    });
});

app.get('/post/:id', (req, res) => {
  Posts.forge({id: req.params.id})
    .fetch({withRelated: ['author']})
    .then((post) => {
      if (post) {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json; charset=utf-8');
        console.log(JSON.stringify(post))
        res.end(JSON.stringify(post));
      } else {
        res.sendStatus(404);
      }
    });
});

// Exports for Server hoisting.
const listen = (port) => {
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      resolve();
    });
  });
};

exports.up = (justBackend) => {
  return knex.migrate.latest([process.env.NODE_ENV])
    .then(() => {
      return knex.migrate.currentVersion();
    })
    .then((val) => {
      console.log('Done running latest migration:', val);
      return listen(3000);
    })
    .then(() => {
      console.log('Listening on port 3000...');
    });
};

