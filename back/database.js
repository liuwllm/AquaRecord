const session = require('express-session');

const mysql = require('mysql2');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();

// Sets up a connection to AquaRecord database to store sessions
const cookieStore = new MySQLStore({
    host: "aquarecordserver.mysql.database.azure.com",
    port: 3306,
    user: "azureuser",
    database: "AquaRecord",
    password: `${process.env.PASSWORD}`,
});

// Sets up a connection to AquaRecord to store user data
const aquaRecordDB = mysql.createConnection({
    host: "aquarecordserver.mysql.database.azure.com",
    user: "azureuser",
    port: 3306,
    database: "AquaRecord",
    password: `${process.env.PASSWORD}`,
    multipleStatements: true,  
});

// Function for verifying the login credentials of the user
const verifyUser = (username, pwd, done) => { 
    aquaRecordDB.query(`SELECT * FROM Users WHERE Username = '${username}'`, async function (error, results, fields) {
        if (error){ 
            console.log("Error occured while verifying user");
            return done(error);
        }

        if (results.length == 0) {
            console.log("User does not exist");
            return done(null, false, { message: "Invalid username" });
        }

        try {
            if (await bcrypt.compare(pwd, results[0].Password)) {
                const user = {
                    id: results[0].id,
                    firstname: results[0].FirstName,
                    lastname: results[0].LastName,
                    username: results[0].Username,
                    weight: results[0].Weight,
                };
                return done(null, user);
            } else {
                return done(null, false, { message: "Your password is incorrect" });
            }
        } catch(e) {
            return done(e);
        }
    })
}

// Function to register the user into the AquaRecord database
const registerUser = async (user) => {
    const hashed = await bcrypt.hash(user.pwd, 10);

    aquaRecordDB.query(
        "INSERT INTO Users (FirstName, LastName, Username, Password, Weight) VALUES (?, ?, ?, ?, ?)",
        [user.firstname, user.lastname, user.username, hashed, user.weight],
        function (err, result) {
            if (err){
                console.log("Error occured while registering user");
                console.log(err);
            }
            else {
                console.log("User inserted successfully!");
            }
    });
}

// Function to deserialize user
const deserializeUser = (userId, done) => {
    console.log("Deserializing user with id: ", userId);
    aquaRecordDB.query(`SELECT * FROM Users WHERE id=${userId}`, function(error, results) {
        if (error) {
            console.log("Error occured while deserializing user");
            console.log(error);
            return done(null, false);
        }
        const user = {
            id: results[0].id,
            FirstName: results[0].FirstName,
            LastName: results[0].LastName,
            Username: results[0].Username,
            Weight: results[0].Weight,
            CupsDrank: results[0].CupsDrank
        }
        return done(null, user);
    });
}

const setCupTracker = (cupCount, userId) => {
    console.log("Setting cup count to: ", cupCount);
    aquaRecordDB.query(`UPDATE Users SET CupsDrank = ${cupCount} WHERE id = ${userId}`, function(err, result) {
        if (err) {
            console.log("Error occured while setting cup count");
            console.log(err);
        }
    });
}

module.exports = { cookieStore, verifyUser, registerUser, deserializeUser, setCupTracker};
