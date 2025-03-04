import { getBattery, addBattery, removeBattery } from "./battery.js";

export function deleteBatteryProfile() {
    const batteryId = getBattery().id;

    return fetch(`/BatteryTestingAPI/battery/remove/?battery-id=${batteryId}`, {method:"PUT"}).then(res => res.json()).then(() => removeBattery(batteryId));
}

export function addBatteryProfile(name, date, description) {
    return fetch("/BatteryTestingAPI/battery/", {method:"PUT", mode:"cors", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
        batteryName : name,
        batteryDate : date,
        batteryDescription : description
    })}).then(res => res.json()).then(res => addBattery(res));
}

export function editBatteryProfile(name, date, description) {
    const batteryId = getBattery().id;

    return fetch(`/BatteryTestingAPI/battery/?battery-id=${batteryId}`, {method:"PUT", mode:"cors", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
        batteryName : name,
        batteryDate : date,
        batteryDescription : description
    })}).then(res => res.json()).then(res => {
        removeBattery(batteryId);
        addBattery(res);
    });
}