const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const aquaRecord = require('./database.js');

// Define Middleware
const app = express();
app.use(session({
    key: "temp cookie name", // Not sure what to do for this
    secret: "temp cookie key", // and this
    store: aquaRecord.cookieStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 400 * 60 * 60 * 24,
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(cors({
    origin: "http://localhost:5173"
}))

const strategy = new LocalStrategy({passwordField: 'pwd'}, aquaRecord.verifyUser);
passport.use(strategy);
passport.serializeUser((user, done) => {
    console.log("Serializing user with id:", user.id);

    done(null, user.id);
});
passport.deserializeUser(aquaRecord.deserializeUser);

// API

app.post("/api/register", (req, res, next) => {
    const user = req.body;
    aquaRecord.registerUser(user);
    res.status(201);
    res.end();
});

app.post("/api/login", function (req, res){
    passport.authenticate('local',
    function (err, user) {
       res.send({user: user});
    })(req, res);
});


app.listen(5000, () => {
    console.log("App listening on port 5000");
});