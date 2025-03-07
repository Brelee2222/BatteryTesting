const database = require("../database.js");

const BATTERIES_TABLES = "Batteries";

function getBattery(batteryId) {
    // if(batteryId == undefined)
    //     return Error("Invalid Data");

    return database.execute(`call getBattery(?);`, [batteryId], result => result[0]);
}

async function addBattery(name, date, description) {
    if(typeof name != "string" || typeof date != "string" || typeof description != "string")
        return Error("Invalid Data");

    await database.execute(`call createBattery(?, ?, ?);`, [name, date, description], () => {});
    return await await database.execute(`SELECT id, name, date, description FROM ${BATTERIES_TABLES} WHERE name=?;`, [name], result => result[0]);
}

async function editBattery(id, name, date, description) {
    await database.execute(`UPDATE ${BATTERIES_TABLES} SET name = ?, date = DATE(?), description = ? WHERE id = ?`, [name, String(date), description, id], () => {});
    return await database.execute(`SELECT id, name, date, description FROM ${BATTERIES_TABLES} WHERE name=?;`, [name], result => result[0]);
}

// Might not work due to foreign keys
function removeBattery(id) {
    // if(id == undefined)
    //     return Error("Invalid Data");

    return database.execute(`DELETE FROM ${BATTERIES_TABLES} WHERE id=?;`, [id], () => id);
}

function getBatteries() {
    return database.execute(`SELECT id, name, capacity, startVoltage, date FROM ${BATTERIES_TABLES};`, [], result => ({batteries : result, length : result.length}));
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
    return database.execute(`UPDATE ${BATTERIES_TABLES} SET capacity = ?, startVoltage = ? WHERE id = ?`, [capacity, startVoltage, id], () => "Success");
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