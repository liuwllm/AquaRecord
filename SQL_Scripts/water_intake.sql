USE AquaRecord;

CREATE TABLE WaterIntake (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    UserId INT NOT NULL,
    Date DATE NOT NULL,
    IntakeAmount INT,
    CONSTRAINT WaterIntakeUK UNIQUE (UserId, Date),
    FOREIGN KEY (UserId) REFERENCES Users(id)
);

CREATE INDEX UserIndex ON WaterIntake (UserId);
CREATE INDEX DateIndex ON WaterIntake (Date);

