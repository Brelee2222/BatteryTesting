import { batteryInit, getBatteries, getBattery, selectBattery } from "../utils/battery.js";
import { getTests, selectTest, loadTest } from "../utils/test.js";
import { getTimestamps } from "../utils/testManagement.js";

(async function() {
    // waiting for battery initialization
    await batteryInit;

    // make list of batteries
    const batteryNamesElement = document.querySelector("#battery .list");
    getBatteries().map(battery => {
        const element = document.createElement("option");
        element.value = battery.id;
        element.label = battery.name;
        return element;
    }).forEach(batteryNamesElement.appendChild, batteryNamesElement);
})();

// add button functionality
document.querySelector("#battery .select").addEventListener("click", async () => {
    await selectBattery(document.querySelector("#battery .list").value);
    document.querySelector("#battery .name").innerText = getBattery().name;

    // Remove current tests
    const testNamesElement = document.querySelector("#test .list");
    while(testNamesElement.children[0])
        testNamesElement.removeChild(testNamesElement.children[0]);
    
    // Add new tests
    const tests = getTests().sort((a, b) => b.startTime - a.startTime);
    tests.map(test => {
        const element = document.createElement("option");
        element.value = test.startTime;
        element.label = test.name;
        return element;
    }).forEach(testNamesElement.appendChild, testNamesElement);

    testNamesElement.label = tests[0].name;
    testNamesElement.value = tests[0].startTime;

    switchTest(tests[0].startTime);
});

document.querySelector("#test .list").addEventListener("change", event => switchTest(event.target.value));

async function switchTest(testId) {
    selectTest(testId);

    const test = await loadTest();

    document.querySelector("#test #info #duration").innerText = test.duration / 1000;
    document.querySelector("#test #info #startVoltage").innerText = test.startVoltage;
    document.querySelector("#test #info #capacity").innerText = test.capacity;
    document.querySelector("#test #info #minVoltage").innerText = test.minVoltage;
    document.querySelector("#test #info #maxVoltage").innerText = test.maxVoltage;
    document.querySelector("#test #info #minCurrent").innerText = test.minCurrent;
    document.querySelector("#test #info #maxCurrent").innerText = test.maxCurrent;
}

async function downloadTest() {
    const test = await loadTest();
    
    const timestamps = (await getTimestamps()).timestamps.map(timestamp => `${timestamp.time},${timestamp.voltage},${timestamp.current}\n`);
    const a = document.createElement("a");
    const blob = new Blob([`Battery Name,,${getBattery().name}\n`, `Test Name,,${test.name}\n`, `Test Duration (s),,${test.duration}\n`, `Capacity (Wh),,${test.capacity}\n`,`Idle Voltage (V),,${test.startVoltage}\n`,`Voltage Max (V),,${test.maxVoltage}\n`, `Voltage Min (V),,${test.minVoltage}\n`, `Current Max (A),,${test.maxCurrent}\n`, `Current Min (A),,${test.minCurrent}\n`, "\nTimestamps\n", "Time,Voltage,Current\n", ...timestamps], {type: "text/plain"});

    a.href = URL.createObjectURL(blob);
    a.download = `${test.name}.csv`;
    a.click();
    a.remove();
}

document.querySelector("#test .download").addEventListener("click", downloadTest);