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

CREATE PROCEDURE addBattery(name VARCHAR(50), date DATE, description VARCHAR(255)) 
BEGIN
    INSERT 
    INTO Batteries (name, date, description) 
    VALUES(name, DATE(date), description);

    SELECT LAST_INSERT_ID();
END$$

CREATE PROCEDURE editBattery(batteryId INT UNSIGNED, name VARCHAR(50), date DATE, description VARCHAR(255))
BEGIN
    UPDATE Batteries
    SET Batteries.name = name, Batteries.date = date, Batteries.description = description
    WHERE id = batteryId;
END$$

CREATE PROCEDURE removeBattery(batteryId INT UNSIGNED)
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

CREATE PROCEDURE removeTest(testId BIGINT UNSIGNED)
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
    SELECT * FROM Timestamps WHERE Timestamps.testId = testId;
END$$

CREATE PROCEDURE insertTimestamp(testId BIGINT UNSIGNED, time BIGINT UNSIGNED, voltage DOUBLE, current DOUBLE)
BEGIN
    INSERT 
    INTO Timestamps (testId, time, voltage, current) 
    VALUES (testId, time, voltage, current);
END$$


DELIMITER ;