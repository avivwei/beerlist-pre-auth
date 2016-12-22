var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local').Strategy;
//------------------------
// For authentication:
var passport = require('passport');
var expressSession = require('express-session');


// mongoose.connect('mongodb://localhost/beers');
var Beer = require("./models/BeerModel");
var Review = require("./models/ReviewModel");
var User = require("./models/UserModel");


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());
//------------------------

app.get('/beers', function (req, res) {
  Beer.find(function (error, beers) {
    res.send(beers);
  });
});

app.post('/beers', function (req, res, next) {
  var beer = new Beer(req.body);

  beer.save(function(err, beer) {
    if (err) { return next(err); }

    res.json(beer);
  });
});

app.put('/beers/:id',  function(req, res, next) {
  Beer.findById(req.params.id, function (error, beer) {
    beer.name = req.body.name;

    beer.save(function(err, beer) {
      if (err) { return next(err); } 

      res.json(beer);
    });
  });
});

app.delete('/beers/:id', function (req, res) {
  Beer.findById(req.params.id, function (error, beer) {
    if (error) {
      res.status(500);
      res.send(error);
    } else {
      beer.remove();
      res.status(204);
      res.end();
    }
  });
});

app.post('/beers/:id/reviews', function(req, res, next) {
  Beer.findById(req.params.id, function(err, beer) {
    if (err) { return next(err); }

    var review = new Review(req.body);

    beer.reviews.push(review);

    beer.save(function (err, beer) {
      if (err) { return next(err); }
    
      res.json(review);
    });
  });
});

app.delete('/beers/:beer/reviews/:review', function(req, res, next) {
  Beer.findById(req.params.beer, function (err, beer) {
    for (var i = 0; i < beer.reviews.length; i ++) {
      if (beer.reviews[i]["_id"] == req.params.review) {
        beer.reviews.splice(i, 1);
        beer.save();

        res.status(204);
        res.end();
      }
    }
  });
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

// send the current user back!
app.get('/currentUser', function (req, res) {
  res.send(req.user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


passport.use('register', new LocalStrategy(function (username, password, done) {
  var user = {
    username: username,
    password: password
  };

  console.log(user);

  done(null, user);
}));

app.post('/register', passport.authenticate('register'), function (req, res) {
console.log("Hadas");

  res.json(req.user);
});

app.listen(8000);