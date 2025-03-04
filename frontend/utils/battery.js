import { loadTests } from "./test.js";

let _batteryList = {};

let _loadedBatteries = {};

let _currentBatteryId;

export const batteryInit = (async function() {
    return fetch("/BatteryTestingAPI/battery/all", {method:"GET", mode:"cors", headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(res => res.batteries.forEach(battery => _batteryList[battery.id] = battery));
})();

export function getBatteries() {
    return Object.values(_batteryList);
}

export function addBattery(battery) {
    _batteryList[battery.name] = battery;
}

export function removeBattery(batteryId) {
    delete _batteryList[batteryId];
    delete _loadedBatteries[batteryId];
}

export function selectBattery(batteryId) {
    _currentBatteryId = batteryId;

    if(typeof loadTests == "function")
        return loadTests();
}

export function loadBattery() {
    const batteryId = _currentBatteryId;

    if(isBatteryLoaded())
        return _loadedBatteries[batteryId];

    return fetch(`/BatteryTestingAPI/battery/?battery-id=${batteryId}`, {method:"GET", mode:"cors", headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(res => _loadedBatteries[batteryId] = res);
}

export function getBattery() {
    return _loadedBatteries[_currentBatteryId] ?? _batteryList[_currentBatteryId];
}

export function isBatteryLoaded() {
    return !!_loadedBatteries[_currentBatteryId];
}