const dbBatteryQueries = require("./queries/batteryQueries.js");
const dbTestsQueries = require("./queries/testQueries.js");
const ID_RANGE = 500;

module.exports = {
    get : {
        "/battery" : req => dbBatteryQueries.getBattery(req.query["battery-id"]),
        "/battery/all" : dbBatteryQueries.getBatteries,
        "/battery/dates" : dbBatteryQueries.getBatteryDates,
        "/battery/tests" : req => dbTestsQueries.getBatteryTests(req.query["battery-id"]),
        "/test" : req => dbTestsQueries.getTest(req.query["test-id"])
    },
    put : {
        "/battery" : async req => {
            const body = req.body;

            if(typeof body.batteryName != "string" || typeof body.batteryDate != "string")
                return Error("Invalid types");

            const ids = (await dbBatteryQueries.getBatteryIds()).ids;

            let id;
 
            do {
                id = Math.floor(Math.random() * ID_RANGE);
            } while(ids.includes(id));

            return await dbBatteryQueries.addBattery(id, body.batteryName, body.batteryDate);
        },
        "/battery/remove" : req => dbBatteryQueries.removeBattery(req.query["battery-id"]),
        "/test/log" : req => {
            const body = req.body;
            
            return dbTestsQueries.logTest(req.query["battery-id"], body.time, body.name, body.startVoltage, body.success, body.timestamps);
        }
    }
}