DELIMITER $$

-- Battery Procedures
CREATE PROCEDURE getBatteries()
BEGIN
    SELECT id, name, capacity, startVoltage, date 
    FROM Batteries;
END$$

CREATE PROCEDURE getBattery(batteryId INT UNSIGNED)
BEGIN
    SELECT * 
    FROM Batteries 
    WHERE id = batteryId 
    LIMIT 1;
END$$

CREATE PROCEDURE createBattery(name VARCHAR(50), date DATE, description VARCHAR(255)) 
BEGIN
    INSERT 
    INTO Batteries (name, date, description) 
    VALUES(name, DATE(date), description);

    SELECT LAST_INSERT_ID() as id;
END$$

CREATE PROCEDURE editBattery(batteryId INT UNSIGNED, name VARCHAR(50), date DATE, description VARCHAR(255))
BEGIN
    UPDATE Batteries
    SET Batteries.name = name, Batteries.date = date, Batteries.description = description
    WHERE id = batteryId;
END$$

CREATE PROCEDURE deleteBattery(batteryId INT UNSIGNED)
BEGIN
    DELETE 
    FROM Timestamps 
    WHERE testId IN (
        SELECT startTime FROM Tests WHERE Tests.batteryId = batteryId
    )
    LIMIT 1;
    
    DELETE 
    FROM Tests 
    WHERE Tests.batteryId = batteryId;

    DELETE 
    FROM batteryId 
    WHERE id = batteryId;
END$$

CREATE PROCEDURE setCapacity(batteryId INT UNSIGNED, capacity DOUBLE, startVoltage DOUBLE)
BEGIN
    UPDATE Batteries
    SET Batteries.capacity = capacity, Batteries.startVoltage = startVoltage
    WHERE id = batteryId;
END$$

-- Test Procedures
CREATE PROCEDURE getBatteryTests(batteryId INT UNSIGNED)
BEGIN
    SELECT * 
    FROM Tests 
    WHERE Tests.batteryId = batteryId;
END$$

CREATE PROCEDURE getTest(testId BIGINT UNSIGNED)
BEGIN
    SELECT Tests.batteryId, MIN(voltage) AS minVoltage, MAX(voltage) AS maxVoltage, MIN(current) AS minCurrent, MAX(current) AS maxCurrent 
    FROM Tests, (SELECT current, voltage FROM Timestamps WHERE Timestamps.testId = testId) AS Timestamps
    WHERE startTime = testId 
    GROUP BY startTime
    LIMIT 1;
END$$

CREATE PROCEDURE recordTest(batteryId INT UNSIGNED, startTime BIGINT UNSIGNED, duration BIGINT UNSIGNED, name VARCHAR(255), startVoltage DOUBLE, capacity DOUBLE, success BOOL, codeVersion INT)
BEGIN
    INSERT INTO Tests (batteryId, startTime, duration, name, startVoltage, capacity, success, codeVersion) 
    VALUES(batteryId, startTime, duration, name, startVoltage, capacity, success, codeVersion);
END$$

CREATE PROCEDURE deleteTest(testId BIGINT UNSIGNED)
BEGIN
    DELETE 
    FROM Timestamps 
    WHERE Timestamps.testId = testId;

    DELETE
    FROM Tests 
    WHERE Tests.startTime = testId
    LIMIT 1;
END$$

CREATE PROCEDURE getTimestamps(testId BIGINT UNSIGNED)
BEGIN
    SELECT * 
    FROM Timestamps 
    WHERE Timestamps.testId = testId;
END$$

CREATE PROCEDURE insertTimestamp(testId BIGINT UNSIGNED, time BIGINT UNSIGNED, voltage DOUBLE, current DOUBLE)
BEGIN
    INSERT 
    INTO Timestamps (testId, time, voltage, current) 
    VALUES (testId, time, voltage, current);
END$$

CREATE PROCEDURE setTestCapacity(testId BIGINT UNSIGNED, capacity DOUBLE)
BEGIN
    UPDATE Tests 
    SET capacity = capacity
    WHERE startTime = testId
    LIMIT 1;
END$$

-- Notes Procedures
CREATE PROCEDURE getBatteryNotes(batteryId INT UNSIGNED)
BEGIN
    SELECT time, note 
    FROM Battery_Notes 
    WHERE Battery_Notes.batteryId = batteryId;
END$$

CREATE PROCEDURE recordNote(batteryId INT UNSIGNED, time BIGINT UNSIGNED, note VARCHAR(1023))
BEGIN
    INSERT 
    INTO Battery_Notes (batteryId, time, note) 
    VALUES(batteryId, time, note);
END$$

CREATE PROCEDURE deleteNote(noteId BIGINT UNSIGNED)
BEGIN
    DELETE 
    FROM Battery_Notes
    WHERE time = noteId
    LIMIT 1;
END$$

CREATE PROCEDURE getEventMatches(batteryId INT UNSIGNED, eventKey VARCHAR(31))
BEGIN
    SELECT matchKey, teamNumber, time, voltageHigh, voltageLow
    FROM Matches
    WHERE Matches.batteryId = batteryId AND Matches.eventKey = eventKey;
END$$

CREATE PROCEDURE getBatteryMatches(batteryId INT UNSIGNED)
BEGIN
    SELECT eventKey, matchKey, teamNumber, time, voltageHigh, voltageLow
    FROM Matches
    WHERE Matches.batteryId = batteryId;
END$$

CREATE PROCEDURE getMatch(batteryId INT UNSIGNED, eventKey VARCHAR(31), matchKey VARCHAR(31))
BEGIN
    SELECT *
    FROM Matches
    WHERE Matches.eventKey = eventKey AND Matches.matchKey = matchKey AND Matches.batteryId = batteryId
    LIMIT 1;
END$$

CREATE PROCEDURE deleteMatch(batteryId INT UNSIGNED, eventKey VARCHAR(31), matchKey VARCHAR(31))
BEGIN
    DELETE
    FROM Matches
    WHERE Matches.eventKey = eventKey AND Matches.matchKey = matchKey AND Matches.batteryId = batteryId
    LIMIT 1;
END$$

CREATE PROCEDURE recordMatch(batteryId INT UNSIGNED, eventKey VARCHAR(31), matchKey VARCHAR(31), teamNumber INT UNSIGNED, time BIGINT UNSIGNED, voltageHigh DOUBLE, voltageLow DOUBLE)
BEGIN
    call deleteMatch(batteryId, eventKey, matchKey);

    INSERT INTO Matches(batteryId, eventKey, matchKey, teamNumber, time, voltageHigh, voltageLow) 
    VALUES(batteryId, eventKey, matchKey, teamNumber, time, voltageHigh, voltageLow);
END$$

-- Teams Procedures
CREATE PROCEDURE getTeams()
BEGIN
    SELECT * FROM Teams;
END$$

DELIMITER ;