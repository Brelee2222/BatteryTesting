const database = require("../database.js");
const { createModel } = require('polynomial-regression');

const TESTS_TABLE = "Tests";
const TIMESTAMPS_TABLE = "Timestamps";
const CODE_VERSION = 1;

function getBatteryTests(batteryId) {
    // if(batteryId == undefined)
    //     return Error("Invalid Data");

    return database.execute(`SELECT * FROM ${TESTS_TABLE} WHERE batteryId=?;`, [batteryId], result => ({tests : result, length : result.length}));
}

function getTest(testId) {
    // if(testId == undefined)
    //     return Error("Invalid Data");

    return database.execute(`SELECT batteryId, startTime, name, success, capacity, codeVersion, startVoltage, duration, (SELECT MIN(voltage) FROM ${TIMESTAMPS_TABLE} WHERE testId=?) AS minVoltage, (SELECT MAX(voltage) FROM ${TIMESTAMPS_TABLE} WHERE testId=?) AS maxVoltage, (SELECT MIN(current) FROM ${TIMESTAMPS_TABLE} WHERE testId=?) AS minCurrent, (SELECT MAX(current) FROM ${TIMESTAMPS_TABLE} WHERE testId=?) AS maxCurrent FROM ${TESTS_TABLE} WHERE startTime=?;`, [testId, testId, testId, testId, testId], result => result[0]);
}

function removeTest(testId) {
    return database.execute(`DELETE FROM ${TESTS_TABLE} WHERE id=?;`, [testId], () => testId);
}

function getTimestamps(testId) {
    // if(testId == undefined)
    //     return Error("Invalid Data");

    return database.execute(`SELECT * FROM ${TIMESTAMPS_TABLE} WHERE testId=?;`, [testId], result => ({timestamps : result, length : result.length}));
}

function insertTimestamp(testId, time, voltage, current) {
    // if(testId == undefined)
    //     return Error("Invalid Data");

    return database.execute(`INSERT INTO ${TIMESTAMPS_TABLE} (testId, time, voltage, current) VALUES(?, ?, ?, ?)`, [testId, time, voltage, current], () => time);
}

// MUST BE SORTED IN ACENDING ORDER
const DEGREES = 3;
const estimation_degrees = [];
for(let degree = 0; degree <= DEGREES; degree++)
    estimation_degrees.push(degree);

function computeCapacity(timestamps) {
    const model = createModel();

    model.fit(timestamps.map(timestamp => [timestamp.time / 60 / 60 / 1000, timestamp.voltage * timestamp.current]), estimation_degrees);

    // get the coefficients
    const coefficients = [];
    for(let degree = 0, lastEst = 0; degree <= DEGREES; degree++) {
        const est = model.estimate(degree, 1);
        coefficients.push(est - lastEst);
        lastEst = est;
    }

    // console.log(coefficients);

    // get area under curve
    const lastTime = timestamps[timestamps.length-1].time / 60 / 60 / 1000;
    let result = 0;
    for(let degree = 0; degree <= DEGREES; degree++)
        result += (coefficients[degree] * Math.pow(lastTime, degree + 1)) / (degree + 1);

    // console.log(result)

    return isNaN(result) ? 0 : result;
    // let lastTime = 0;
    // let lastWatt = 0;
    // return timestamps.map(timestamp => {
    //     const watt = timestamp.current * timestamp.voltage;
        
    //     const energy = (lastWatt + watt) / 2 * (timestamp.time - lastTime);

    //     lastTime = timestamp.time;
    //     lastWatt = watt;

    //     return energy;
    // }).reduce((total, watt) => total + watt) / 60 / 60 / 1000;
}

async function setTestCapacity(id, capacity) {
    return database.execute(`UPDATE ${TESTS_TABLE} SET capacity = ? WHERE startTime = ?`, [capacity, id], () => "Success");
}

async function logTest(batteryId, time, name, startVoltage, success, timestamps) {
    const duration = timestamps[timestamps.length-1].time - time;
    
    timestamps.forEach(timestamp => timestamp.time -= time);

    const capacity = computeCapacity(timestamps);

    await database.execute(`INSERT INTO ${TESTS_TABLE} (batteryId, startTime, duration, name, startVoltage, capacity, success, codeVersion) VALUES(?, ?, ?, ?, ?, ?, ?, ?);`, [batteryId, time, duration, name.replaceAll('"', ''), startVoltage, capacity, success ? 1 : 0, CODE_VERSION], () => {});
    
    for(const timestamp of timestamps) {
        const result = await insertTimestamp(Number(time), Number(timestamp.time), Number(timestamp.voltage), Number(timestamp.current));

        if(result instanceof Error)
            return result;
    }

    return capacity;
} 

module.exports = {
    getBatteryTests,
    getTimestamps,
    logTest,
    getTest,
    computeCapacity,
    setTestCapacity
};