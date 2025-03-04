import { sendSerialMessage } from "./serialPort.js";
import { getLoadTestingConfig } from "./configs.js";
import { getNextReading, READING_INTERVAL_MILLIS } from "./reading.js";
import { logTest } from "../utils/testManagement.js";

/**
 * set configuration for the test
 */
async function setupConfigs() {
    const mode = getLoadTestingConfig("mode");
    const level = getLoadTestingConfig("high")  ? "HIGH" : "LOW";

    // Set the mode
    const levelPromise = sendSerialMessage(`LEVEL ${level}`);

    // HIGH cannot be set lower than LOW, and LOW can't be set higher HIGH, therefore when to set HIGH to a value lower than the load's LOW, the LOW must be set first.
    const high1Promise = sendSerialMessage(`${mode}:HIGH ${getLoadTestingConfig(`constantModeValues.${mode}.HIGH`)}`);
    const lowPromise = sendSerialMessage(`${mode}:LOW ${getLoadTestingConfig(`constantModeValues.${mode}.LOW`)}`);
    const high2Promise = sendSerialMessage(`${mode}:HIGH ${getLoadTestingConfig(`constantModeValues.${mode}.HIGH`)}`);

    const ldOnPromise = sendSerialMessage(`ldonv ${getLoadTestingConfig("loadTestingSettings.onVoltage")}`);
    const ldOffPromise = sendSerialMessage(`ldoffv ${getLoadTestingConfig("loadTestingSettings.offVoltage")}`);

    const onPromise = sendSerialMessage(`LOAD ON`);

    await levelPromise;
    await high1Promise;
    await lowPromise;
    await high2Promise;
    await ldOnPromise;
    await ldOffPromise;
    await onPromise;
}

/**
 * creates a test and begins recording data. When the current goes to 0.1 or below, the test deemed done
 */
async function testBattery() {
    document.querySelector("#test .start").disabled = true;
    
    const 
        name = new Date().toUTCString(), 
        time = Date.now(), 
        startVoltage = (await getNextReading()).voltage;

    setupConfigs();

    const timestamps = [];
    while(true) {
        await new Promise(res => setTimeout(res, READING_INTERVAL_MILLIS));

        const readings = await getNextReading();

        // check current
        if(readings.current <= 0.1) {
            logTest(name, time, startVoltage, true, timestamps);
            return finishBatteryTesting();
        }

        timestamps.push(readings);
    }
}

/**
 * Concludes the test and makes it available for next ones
 */
function finishBatteryTesting() {
    sendSerialMessage(`LOAD OFF`);

    document.querySelector("#test .start").disabled = false;
}

// add button functionality
document.querySelector("#test .start").addEventListener("click", testBattery);