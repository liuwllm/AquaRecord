CREATE DATABASE AquaRecord;
USE AquaRecord;
CREATE TABLE Users (
	id integer PRIMARY KEY AUTO_INCREMENT, 
    FirstName VarChar(40) NOT NULL, 
	LastName VarChar(60) NOT NULL, 
    Username VarChar(40) NOT NULL,
    Password VarChar(100) NOT NULL,
    Weight Float(0)
);
