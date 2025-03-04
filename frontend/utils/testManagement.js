import { getBattery } from "./battery.js";
import { getTest } from "./test.js";

export function logTest(name, time, startVoltage, success, timestamps) {
    return fetch(`/BatteryTestingAPI/test/log/?battery-id=${getBattery().id}`, {method:"PUT", mode:"cors", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
        time,
        name,
        startVoltage,
        success,
        timestamps
    })});
}

export function getTimestamps() {
    return fetch(`/BatteryTestingAPI/test/timestamps/?test-id=${getTest().startTime}`, {method:"GET", mode:"cors", headers: {'Content-Type': 'application/json'}}).then(res => res.json());
}