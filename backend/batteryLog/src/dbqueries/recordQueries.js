const database = require("../database.js");

const NOTES_TABLE = "Battery_Notes";
const MATCHES_TABLE = "Matches"

function getBatteryNotes(batteryId) {
    return database.execute(`SELECT time, note FROM ${NOTES_TABLE} WHERE batteryId=?;`, [batteryId], result => ({notes : result, length : result.length}));
}

function recordNote(batteryId, time, note) {
    return database.execute(`INSERT INTO ${NOTES_TABLE} (batteryId, time, note) VALUES(?, ?, ?);`, [batteryId, time, note], () => { success : true });
}

function removeNote(noteId) {
    return database.execute(`DELETE FROM ${NOTES_TABLE} WHERE time=?;`, [noteId], () => noteId);
}

function getMatch(eventKey, matchKey, batteryId) {
    return database.execute(`SELECT * FROM ${MATCHES_TABLE} WHERE eventKey=?, matchKey=?, batteryId=?;`, [eventKey, matchKey, batteryId], result => result[0]);
}

async function recordMatch(eventKey, matchKey, batteryId, teamNumber, time, voltageHigh, voltageLow, note) {
    await recordNote(batteryId, time, note);

    return await database.execute(`INSERT INTO ${MATCHES_TABLE} (eventKey, matchKey, batteryId, time, teamNumber, voltageHigh, voltageLow) VALUES(?, ?, ?, ?, ?, ?, ?);`, [eventKey, matchKey, batteryId, time, teamNumber, voltageHigh, voltageLow], () => {});
} 

module.exports = {
    getBatteryNotes,
    recordNote,
    removeNote,
    recordMatch
}