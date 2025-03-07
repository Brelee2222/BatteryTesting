const dbBatteryQueries = require("./dbqueries/batteryQueries.js");
const dbTestsQueries = require("./dbqueries/testQueries.js");
const dbRecordQueries = require("./dbqueries/recordQueries.js");
const teams = require("./dbqueries/teams.js");
const matches = require("./matches.js");

module.exports = {
    get : {
        "/battery" : req => dbBatteryQueries.getBattery(req.query["battery-id"]),
        "/battery/all" : dbBatteryQueries.getBatteries,
        "/battery/dates" : dbBatteryQueries.getBatteryDates,
        "/battery/tests" : req => dbTestsQueries.getBatteryTests(req.query["battery-id"]),
        "/test" : req => dbTestsQueries.getTest(req.query["test-id"]),
        "/test/timestamps" : req => dbTestsQueries.getTimestamps(req.query["test-id"]),
        "/battery/notes" : req => dbRecordQueries.getBatteryNotes(req.query["battery-id"]),
        "/teams" : () => JSON.stringify(teams.getTeams()),
        "/event/current" : req => matches.getCurrentEventKey(req.query["team-number"]),
        "/event/current/matches" : req => matches.getCurrentEventMatches(req.query["team-number"]),
        "/events" : req => matches.getEvents(req.query["team-number"]), // Might be deprecated later on
        "/event" : req => matches.getEventKeyFromTime(req.query["team-number"], req.query["time"])
    },
    put : {
        "/battery" : req => {
            const body = req.body;
            const batteryId = req.query["battery-id"];
            
            if(batteryId)
                return dbBatteryQueries.editBattery(batteryId, body.batteryName, body.batteryDate, body.batteryDescription ?? "");

            return dbBatteryQueries.addBattery(body.batteryName, body.batteryDate, body.batteryDescription ?? "");
        },
        "/battery/remove" : req => dbBatteryQueries.removeBattery(req.query["battery-id"]),
        "/test/log" : async req => {
            const body = req.body;

            const capacity = await dbTestsQueries.logTest(req.query["battery-id"], body.time, body.name, body.startVoltage, body.success, body.timestamps);

            if(body.startVoltage > dbTestsQueries.MIN_START_VOLTAGE)
                return await dbBatteryQueries.setBatteryCapacity(
                    req.query["battery-id"], 
                    capacity,
                    body.startVoltage
                );
        },
        "/note" : req => {
            const body = req.body;
            
            return dbRecordQueries.recordNote(req.query["battery-id"], body.time, body.note);
        },
        "/note/remove" : req => dbRecordQueries.removeNote(req.query["note-id"]),
        "/match/log" : req => {
            const body = req.body;

            return dbRecordQueries.recordMatch(req.query["event-key"], req.query["match-key"], req.query["battery-id"], body.teamNumber, body.time, body.voltageHigh, body.voltageLow, body.note);
        }
    }
}