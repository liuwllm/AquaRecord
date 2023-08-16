const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const date = require('moment');
const aquaRecord = require('./database.js');

// Define Middleware
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    });
    next();
});
app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(session({
    secret: "temp cookie key",
    store: aquaRecord.cookieStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 400 * 60 * 60 * 24,
        secure: false,
        sameSite: 'lax'
    }
}));
/*
app.use((req, res, next) => {
    console.log("Session data: ", req.session);
    next();
});
*/
app.use(passport.initialize());
app.use(passport.session());

const strategy = new LocalStrategy({passwordField: 'pwd'}, aquaRecord.verifyUser);
passport.use(strategy);
passport.serializeUser((user, done) => {
    console.log("Serializing user with id:", user.id);

    done(null, user.id);
});
passport.deserializeUser(aquaRecord.deserializeUser);



// API

app.get("/api/user-info", (req, res) => {
    if (req.isAuthenticated()) {
        res.send(req.user);
    } else {
        res.send(null);
    }
})

app.post("/api/register", (req, res, next) => {
    const user = req.body;
    aquaRecord.registerUser(user);
    res.status(201);
    res.end();
});

app.post("/api/login", function (req, res, next){
    passport.authenticate('local',
    function (err, user, info) {
        if (err){
            console.log("Error occured in POST request", err);
        };
        if (!user) {
            console.log("Credentials are incorrect");
            res.send({authenticated: false, message: info.message});
        }
        else{
            req.logIn(user, err => {
                if (err){
                    console.log("Error occured during login request", err);
                    res.send({ authenticated: false });
                } else {
                    res.send({ authenticated: true });
                }
            });
        }
    })(req, res, next);
});

app.post("/api/logout", (req, res, next) => {
    console.log("Logging out...");
    req.logOut( err => {
        if (err) { return next(err); }
        res.send("Log out successful");
    });
});

app.post("/api/daily_intake/post", (req, res) => {
    const userId = req.user.id;
    const cur_date = date().format('YYYY-MM-DD HH:mm:ss').slice(0,10);
    const intake = req.body.cups;

    aquaRecord.logIntake(userId, cur_date, intake);

    res.status(200);
});

app.get("/api/daily_intake/get", async (req, res) => {
    const userId = req.user.id;
    const cur_date = date().format('YYYY-MM-DD HH:mm:ss').slice(0,10);
    
    const result = await aquaRecord.getIntake(userId, cur_date);
    if (result === false) {
        res.send("Failed to retrieve intake info");
    } else {
        res.send({cupCount: result});
    }
    
})

app.listen(5000, () => {
    console.log("App listening on port 5000");
});