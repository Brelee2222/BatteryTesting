DELIMITER $$

-- Battery procedures
CREATE PROCEDURE getBatteries()
BEGIN
    SELECT id, name, capacity, startVoltage, date FROM Batteries;
END$$

CREATE PROCEDURE getBattery(batteryId INT UNSIGNED)
BEGIN
    SELECT * FROM  WHERE id = batteryId LIMIT 1;
END$$

CREATE PROCEDURE addBattery(name VARCHAR(50), date DATE, description VARCHAR(255)) 
BEGIN
    INSERT INTO Batteries (name, date, description) VALUES(name, DATE(date), description);
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
    DELETE FROM Timestamps WHERE testId IN (SELECT startTime FROM Tests WHERE Tests.batteryId = batteryId);
    DELETE FROM Tests WHERE Tests.batteryId = batteryId;
    DELETE FROM batteryId WHERE id = batteryId;
END$$

CREATE PROCEDURE setCapacity(batteryId INT UNSIGNED, capacity DOUBLE, startVoltage DOUBLE)
BEGIN
    UPDATE Batteries
    SET Batteries.capacity = capacity, Batteries.startVoltage = startVoltage
    WHERE id = batteryId;
END$$



DELIMITER ;