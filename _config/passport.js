var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


//Registration strategy
passport.use('local.registration', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Unsafe Password').notEmpty().isLength({
    min: 5
  });
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });

    return done(null, false, req.flash('error', messages));
  }

  User.findOne({
    'email': email
  }, function(err, user) {
    //Checks if email is already in database. If it returns an error, 
    //the email is not in the db...
    if (err) {
      //...in which case we return the err, so passport knows the email isn't registered
      return done(err);
    }
    // If we find a user belonging to the entered email, we return a messge 
    if (user) {
      return done(null, false, {
        message: 'This Email is already registered'
      });
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function(err, result) {
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    })
  });
}));

//Login strategy
passport.use('local.login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid Password').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });

    return done(null, false, req.flash('error', messages));
  }

  User.findOne({
    'email': email
  }, function(err, user) {

    if (err) {
      //...in which case we return the error
      return done(err);
    }
    
    //If no matching user is found or the password is invalid we show the same error message.
    if (!user || !user.validPassword(password)) {
      return done(null, false, {
        message: 'Invalid Username or Password \n(Not telling you which though... :P )'
      });
    }
    return done(null, user);
    })
}));