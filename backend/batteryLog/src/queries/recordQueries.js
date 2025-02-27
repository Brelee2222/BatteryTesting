const database = require("../database.js");

const NOTES_TABLE = "Battery_Notes";

function getNotesFromBattery(batteryId) {
    return database.execute(`SELECT time, note FROM ${NOTES_TABLE} WHERE batteryId=?;`, [batteryId], result => ({notes : result, length : result.length}));
}

function recordNote(batteryId, time, note) {
    return database.execute(`INSERT INTO ${NOTES_TABLE} (batteryId, time, note) VALUES(?, ?, ?);`, [batteryId, time, note], () => { success : true });
}

module.exports = {
    getNotesFromBattery,
    recordNote
}