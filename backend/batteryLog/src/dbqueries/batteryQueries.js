const database = require("../database.js");

// const BATTERIES_TABLES = "Batteries";

function getBattery(batteryId) {
    // if(batteryId == undefined)
    //     return Error("Invalid Data");

    return database.execute(`call getBattery(?);`, [batteryId], result => result[0][0]);
}

async function addBattery(name, date, description) {
    if(typeof name != "string" || typeof date != "string" || typeof description != "string")
        return Error("Invalid Data");

    return await getBattery(await database.execute(`call createBattery(?, ?, ?);`, [name, date, description], result => result[0][0].id));
}

async function editBattery(id, name, date, description) {
    await database.execute(`call editBattery(?, ?, ?, ?)`, [id, name, String(date), description], () => {});
    return await database.execute(`call getBattery(?);`, [id], result => result[0][0]);
}

// Might not work due to foreign keys
function removeBattery(id) {
    // if(id == undefined)
    //     return Error("Invalid Data");

    return database.execute(`call deleteBattery(?);`, [id], () => id);
}

function getBatteries() {
    return database.execute(`call getBatteries();`, [], result => ({batteries : result[0], length : result[0].length}));
    // return database.query(`SELECT id, name, date FROM ${BATTERIES_TABLES};`, result => JSON.stringify({batteries : result, length : result.length}));
}

// function getBatteryIds() {
//     return database.query(`SELECT id FROM ${BATTERIES_TABLES};`, result => ({ids : result.map(data => data.id), length : result.length}));
//     // return database.query(`SELECT id, date FROM ${BATTERIES_TABLES};`, result => JSON.stringify({ids : result.map(data => data.id), length : result.length}));
// }

function getBatteryDates() {
    return database.execute(`SELECT id, date FROM ${BATTERIES_TABLES};`, [], result => result);
}

function setBatteryCapacity(id, capacity, startVoltage) {    
    return database.execute(`setCapacity(?, ?, ?);`, [id, capacity, startVoltage], () => "Success");
}

module.exports = {
    getBattery,
    addBattery,
    editBattery,
    removeBattery,
    getBatteries,
    getBatteryDates,
    setBatteryCapacity
};