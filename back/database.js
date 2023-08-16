const session = require('express-session');

const mysql = require('mysql2');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();

// Sets up a connection to AquaRecord database to store sessions
const cookieStore = new MySQLStore({
    host: `${process.env.HOST}`,
    port: 3306,
    user: `${process.env.SERVERUSER }`,
    database: "AquaRecord",
    password: `${process.env.PASSWORD}`,
});

// Sets up a connection to AquaRecord to store user data
const aquaRecordDB = mysql.createConnection({
    host: `${process.env.HOST}`,
    user: `${process.env.SERVERUSER}`,
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

// Function to add/update the water intake amount for the day in the AquaRecord database
const logIntake = (userId, date, cups) => {
    console.log(`Logging ${cups} cups drank by user with id ${userId} on ${date}`);

    // Check if an entry for water intake already exists for the user on the given date (UserId and Date form a composite candidate key)
    aquaRecordDB.query(`SELECT * FROM WaterIntake WHERE UserId=${userId} AND Date='${date}'`, 
        function(error, results) {
            if (error) {
                console.log("Error occured while logging intake");
                console.log(error);
            } else if (results.length === 0) {
                // if there isn't an entry then create a new entry
                console.log(`Creating new entry for user with id ${userId} on ${date}`);
                aquaRecordDB.query(`INSERT WaterIntake (UserId, Date, IntakeAmount) VALUES (${userId}, '${date}', ${cups})`,
                    function(err, res) {
                        if (err) {
                            console.log("Error occured while inserting new entry");
                            console.log(err);
                        } else {
                            console.log("Insert Successful");
                        }
                    }
                );
            } else { // if there is an entry, then that means the user clicked the button to update IntakeAmount
                console.log(`Updating entry for user with id ${userId} on ${date}`);
                aquaRecordDB.query(`UPDATE WaterIntake SET IntakeAmount=${cups} WHERE UserId=${userId} AND Date='${date}'`,
                    function(err, res) {
                        if (err) {
                            console.log("Error occured while updating intake");
                            console.log(err);
                        } else {
                            console.log("Update Successful");
                        }
                    }
                );
            }
            
        }
    );
}

// Function to retrieve the water intake from the database
const getIntake = async (userId, date) => {
    console.log("Retrieving water intake info...");
    const result = await aquaRecordDB.promise().query(`SELECT * FROM WaterIntake WHERE UserId=${userId} AND Date='${date}'`);    
    
    if (result[0].length === 0) {
        return 0;
    } else {
        return result[0][0].IntakeAmount;
    }
}

module.exports = { cookieStore, verifyUser, registerUser, deserializeUser, logIntake, getIntake };
