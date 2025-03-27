-- lang mysql

-- Create Batteries table
CREATE TABLE Batteries (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    date DATE NOT NULL, -- Manufacture Date
    manufacturer VARCHAR(25),
    description VARCHAR(255) NOT NULL,

    -- Test data
    capacity DOUBLE,
    startVoltage DOUBLE,

    -- Constraints
    PRIMARY KEY (id),
    UNIQUE (name)
);

-- Create Tests table
CREATE TABLE Tests (
    startTime BIGINT UNSIGNED NOT NULL,
    batteryId INT UNSIGNED NOT NULL,
    name VARCHAR(64),

    -- Result data
    duration BIGINT UNSIGNED NOT NULL,
    startVoltage DOUBLE NOT NULL,
    capacity DOUBLE NOT NULL,
    success BOOLEAN NOT NULL,
    codeVersion INT NOT NULL, -- Needed to understand how certain values were calculated

    -- Constraints
    PRIMARY KEY (startTime),
    FOREIGN KEY (batteryId) REFERENCES Batteries(id)
);

-- Create Timestamps table
CREATE TABLE Timestamps (
    testId BIGINT UNSIGNED NOT NULL,
    time BIGINT UNSIGNED NOT NULL,

    voltage DOUBLE NOT NULL,
    current DOUBLE NOT NULL,

    FOREIGN KEY (testId) REFERENCES Tests(startTime)
);

-- Create Notes table
CREATE TABLE Battery_Notes (
    batteryId INT UNSIGNED NOT NULL,
    time BIGINT UNSIGNED NOT NULL,
    note VARCHAR(1023) NOT NULL,

    PRIMARY KEY (batteryId, time)
);

-- Create Teams table
CREATE TABLE Teams (
    teamNumber INT UNSIGNED NOT NULL,
    name VARCHAR(63) NOT NULL,

    PRIMARY KEY (teamNumber),
    UNIQUE (name)
);

-- Create Match table
CREATE TABLE Matches (
    eventKey VARCHAR(31) NOT NULL,
    matchKey VARCHAR(31) NOT NULL,
    batteryId INT UNSIGNED NOT NULL,

    teamNumber INT UNSIGNED NOT NULL,
    time BIGINT UNSIGNED,

    voltageHigh DOUBLE UNSIGNED NOT NULL,
    voltageLow DOUBLE UNSIGNED NOT NULL,

    PRIMARY KEY (eventKey, matchKey, batteryId),
    FOREIGN KEY (teamNumber) REFERENCES Teams(teamNumber),
    FOREIGN KEY (batteryId) REFERENCES Batteries(id),
);