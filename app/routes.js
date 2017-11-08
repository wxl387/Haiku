// app/routes.js

var mysql = require('mysql');
var connection = mysql.createConnection(require('../config/connnection.js'));

module.exports = function(app, passport) {
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    // app.get('/profile', isLoggedIn, function(req, res) {
    // 	console.log(req.user.id);
    // 	res.render('profile.ejs', {
    // 		user : req.user // get the user out of session and pass to template
    // 	});
    // });
    app.get('/profile', isLoggedIn, function(req, res) {
        return new Promise(function(resolve, reject) {
            var queryStr = "SELECT * FROM posts WHERE auther = " + req.user.id;
            connection.query(queryStr, function(err, data) {
                res.render('profile.ejs', {
                    user: req.user,
                    data: data,
                });
                resolve();
            });
        });
    });

    app.post('/post', function(req, res) {
        var user = req.user;
        return new Promise(function(resolve, reject) {
            var results = Haiku(req.body.hik);
            if (results == 1) {
                var queryStr = "INSERT INTO posts (auther,post) VALUES (" + parseInt(req.user.id) + ',"' + req.body.hik + '");'
                connection.query(queryStr, function(err, data) {
                    resolve(res.redirect('/profile'));
                });
            } else {
                resolve(res.redirect('/profile'));
            }
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure
var isLoggedIn = function(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

var syllableCount = function(string) {
    //http://harcourtprogramming.co.uk/blogs/benh/tag/javascript/
    var matches = string.match(syllableCount.pattern);
    if (matches == null) return 0; // No vowels found...

    var currentSyllableCount = matches.length;

    if (string.match(syllableCount.silentE) != null) currentSyllableCount -= string.match(syllableCount.silentEs).length;

    return currentSyllableCount;
}
syllableCount.pattern = new RegExp("[aeiouy]([^aieouy]|$)", 'gim'); // Vowel followed be non-vowel or end of string. Matches all in multi-line string, case insensitively.
syllableCount.silentE = new RegExp("[aeiouy][^aeiouy]e([^a-z]s|[^a-z]|$)", 'i'); // words ending vce / vces where v is some vowel, c is some consonant
syllableCount.silentEs = new RegExp("[aeiouy][^aeiouy]e([^a-z]s|[^a-z]|$)", 'gim'); // as above, but match all in multi=line string (previous matches only first - used to find if there are any quickly)

var Haiku = function(str) {
    parts = str.split("\n");
    if (parts.length != 3) {
        return 0;
    } else {
        parts.forEach(function(part) {
            //console.log("Part length: " + part.length);
            //console.log("Syllables: " + syllableCount(part));
        });
        //console.log("Parts length: "+ parts.length);
        //console.log(str);
        if (syllableCount(parts[0]) == 5 && syllableCount(parts[1]) == 7 && syllableCount(parts[2]) == 5) {
            //console.log("this is a haiku");
            return 1;
        } else {
            return 0;
        }
    }
}