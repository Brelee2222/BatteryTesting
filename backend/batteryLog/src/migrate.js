require("dotenv").config();

const testQueries = require("./dbqueries/testQueries.js");
const batteryQueries = require("./dbqueries/batteryQueries.js");

(async function() {    
    for(const battery of (await batteryQueries.getBatteries()).batteries) {
        console.log(battery.name);

        const tests = (await testQueries.getBatteryTests(battery.id)).tests;
        for(const test of tests) {
            const timestamps = (await testQueries.getTimestamps(test.startTime)).timestamps;

            await testQueries.setTestCapacity(test.startTime, testQueries.computeCapacity(timestamps));
        }

        const filteredTests = tests.filter(test => test.startVoltage > testQueries.MIN_START_VOLTAGE);
        if(filteredTests.length) {
            const latestTest = filteredTests.reduce((a, b) => a.startTime > b.startTime ? a : b);
            await batteryQueries.setBatteryCapacity(battery.id, latestTest.capacity, latestTest.startVoltage);
        }
    }
})();