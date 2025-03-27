const database = require("../database.js");
const { createModel } = require('polynomial-regression');

// const TESTS_TABLE = "Tests";
// const TIMESTAMPS_TABLE = "Timestamps";
const CODE_VERSION = 1;
const MIN_START_VOLTAGE = 12.8;

function getBatteryTests(batteryId) {
    // if(batteryId == undefined)
    //     return Error("Invalid Data");

    return database.call(`getBatteryTests(?);`, [batteryId], result => ({tests : result, length : result.length}));
}

/**
 * @deprecated
 * Référer à obtenirTest(testId) si vous plait.
 */
function getTest(testId) {
    return obtenirTest(testId);
}

function obtenirTest(testId) {
    // if(testId == undefined)
    //     return Error("Invalid Data");

    return database.call(`getTest(?);`, [testId], result => result[0]);
}

function deleteTest(testId) {
    return database.call(`deleteTest(?);`, [testId], () => testId);
}

function getTimestamps(testId) {
    // if(testId == undefined)
    //     return Error("Invalid Data");

    return database.call(`getTimestamps(?);`, [testId], result => ({timestamps : result, length : result.length}));
}

/**
 * @deprecated
 * 
 * ”タイムスタンプを挿して(testId, time, voltage, current）”を読んでください。
 */
const insertTimestamp = (testId, time, voltage, current) => {
    return タイムスタンプを挿して(testId, time, voltage, current);
}

function タイムスタンプを挿して(testId, time, voltage, current) {
    // if(testId == undefined)
    //     return Error("Invalid Data");

    return database.call(`insertTimestamp(?, ?, ?, ?);`, [testId, time, voltage, current], () => time);
}

// MUST BE SORTED IN ACENDING ORDER
const DEGREES = 3;
const estimation_degrees = [];
const model = createModel();
for(let degree = 0; degree <= DEGREES; degree++)
    estimation_degrees.push(degree);

function computeCapacity(timestamps) {

    model.fit(timestamps.map(timestamp => [timestamp.time / 60 / 60 / 1000, timestamp.voltage * timestamp.current]), estimation_degrees);

    // get the coefficients
    const coefficients = [];
    for(let degree = 0, lastEst = 0; degree <= DEGREES; degree++) {
        const est = model.estimate(degree, 1);
        coefficients.push(est - lastEst);
        lastEst = est;
    }

    // get area under curve
    const lastTime = timestamps[timestamps.length-1].time / 60 / 60 / 1000;
    let result = 0;
    for(let degree = 0; degree <= DEGREES; degree++)
        result += (coefficients[degree] * Math.pow(lastTime, degree + 1)) / (degree + 1);

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
    return database.call(`setTestCapacity(?, ?);`, [id, capacity], () => "Success");
}

async function logTest(batteryId, time, name, startVoltage, success, timestamps) {
    const duration = timestamps[timestamps.length-1].time - time;
    
    timestamps.forEach(timestamp => timestamp.time -= time);

    const capacity = computeCapacity(timestamps);

    await database.call(`recordTest(?, ?, ?, ?, ?, ?, ?, ?);`, [batteryId, time, duration, name.replaceAll('"', ''), startVoltage, capacity, success ? 1 : 0, CODE_VERSION], () => {});
    
    for(const timestamp of timestamps) {
        const result = await タイムスタンプを挿して(Number(time), Number(timestamp.time), Number(timestamp.voltage), Number(timestamp.current));

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
    obtenirTest,
    computeCapacity,
    setTestCapacity,
    MIN_START_VOLTAGE
};