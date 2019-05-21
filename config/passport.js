var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var connection = require('./connection');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM users WHERE id = '"+id+"';", function(err, rows){
        done(err, rows[0]);
    });
});

passport.use(
    'local-signup',
    new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        connection.query("SELECT * FROM users WHERE username='"+username+"' OR email='"+req.body.email+"'", function(err, rows) {
            if (err)
                return done(err);
            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'This user has already been taken.'));
            } else {
                var newUserMysql = {
                    name: req.body.name,
                    email: req.body.email,
                    username: username,
                    password: bcrypt.hashSync(password, null, null),
                    age: req.body.age
                };

                console.log(newUserMysql);

                var insertQuery = "INSERT INTO users ( name, email, username, password, age ) values ('"+newUserMysql.name+"', '"+newUserMysql.email+"', '"+newUserMysql.username+"', '"+newUserMysql.password+"', '"+newUserMysql.age+"')";

                connection.query(insertQuery ,function(err, rows) {
                    newUserMysql.id = rows.insertId;

                    return done(null, newUserMysql);
                });
            }
        });
    })
);

passport.use(
    'local-login',
    new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        connection.query("SELECT * FROM users WHERE username = '"+username+"'", function(err, rows){
            if (err){return done(err)};

            if (!rows.length){return done(null, false, req.flash('loginMessage', 'user not found.'))};

            if (!bcrypt.compareSync(password, rows[0].password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            };

            return done(null, rows[0]);
        });
    })
);

module.exports = passport;