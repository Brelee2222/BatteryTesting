const database = require("../database.js");

const NOTES_TABLE = "Battery_Notes";
const MATCHES_TABLE = "Matches"

function getBatteryNotes(batteryId) {
    return database.call(`getBatteryNotes(?);`, [batteryId], result => ({notes : result, length : result.length}));
}

function recordNote(batteryId, time, note) {
    return database.call(`recordNote(?,?, ?);`, [batteryId, time, note], () => { success : true });
}

function deleteNote(noteId) {
    return database.call(`deleteNote(?);`, [noteId], () => noteId);
}

function getMatch(eventKey, matchKey, batteryId) {
    return database.call(`getMatch(?, ?, ?);`, [batteryId, eventKey, matchKey], result => result[0]);
}

async function recordMatch(eventKey, matchKey, batteryId, teamNumber, time, voltageHigh, voltageLow, note) {
    await recordNote(batteryId, time, note);

    return await database.call(`recordMatch(?, ?, ?, ?, ?, ?, ?)`, [batteryId, eventKey, matchKey, teamNumber, time, voltageHigh, voltageLow], () => {});
} 

module.exports = {
    getBatteryNotes,
    recordNote,
    deleteNote,
    recordMatch
}