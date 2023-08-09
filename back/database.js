const session = require('express-session');

const mysql = require('mysql2');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();

// Sets up a connection to AquaRecord database to store sessions
const cookieStore = new MySQLStore({
    host: "aquarecordserver.mysql.database.azure.com",
    port: "3306",
    user: "azureuser",
    database: "AquaRecord",
    password: process.env.PASSWRORD,
    ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem", 'utf8')}
});

// Sets up a connection to AquaRecord to store user data
const aquaRecordDB = mysql.createConnection({
    host: "aquarecordserver.mysql.database.azure.com",
    user: "azureuser",
    database: "AquaRecord",
    password: process.env.PASSWORD,
    multipleStatements: true,  
    ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem", 'utf8')}
});

// Function for verifying the login credentials of the user
const verifyUser = (username, pwd, done) => { 
    console.log(process.env.PASSWORD)

    aquaRecordDB.query(`SELECT * FROM Users WHERE Username = '${username}'`, async function (error, results, fields) {
        if (error){ 
            return done(error);
        }

        if (results.length == 0)
            return done(null, false, { message: "No user with that username." });

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
                throw err;
            }
            else {
                console.log("User inserted successfully!");
            }
    });
}

// Function to deserialize user
const deserializeUser = (userId, done) => {
    console.log("Deserializing user with id: ", userId);
    aquaRecordDB.query(`SELECT * EXCLUDE (Password, id) FROM Users WHERE id=${userId}`, function(error, results) {
        return done(null, results[0]);
    });
}

module.exports = { cookieStore, verifyUser, registerUser, deserializeUser};