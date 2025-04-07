import { loadTests } from "./test.js";

/**
 * @typedef {number} BatteryId
 * @typedef {{capacity : number, date : string, id : BatteryId, name : string, startVoltage : number}} Battery
 * @typedef {Battery & {description : string, manufacturer : string}} FullBattery
 */

/**
 * @type {{[index : number] : Battery}}
 * This contains a JSON of batteries. The battery Id is key, and the values are partial information.
 */
let _batteryList = {};

/**
 * @type {{[index : number] : FullBattery}}
 * This contains a JSON of loaded batteries. Full details about batteries are stored in this variable to reduced traffic to the server.
 */
let _loadedBatteries = {};

/**
 * @type {BatteryId}
 * Id of current selected battery.
 */
let _currentBatteryId;

/**
 * Promise for the async function initializing the base information about the batteries.
 */
export const batteryInit = (async function() {
    return fetch("/BatteryTestingAPI/battery/all", {method:"GET", mode:"cors", headers: {'Content-Type': 'application/json'}}) // Request to server
    .then(res => res.json()) // Convert to JSON
    .then(res => res.batteries.forEach(battery => _batteryList[battery.id] = battery)); // Store battery into _batteryList
})();

/**
 * Gets current list of batteries
 * @returns {Battery[]}
 */
export function getBatteries() {
    return Object.values(_batteryList);
}

/**
 * Add battery to the list
 * @param {Battery} battery 
 */
export function addBattery(battery) {
    _batteryList[battery.name] = battery;
}

/**
 * Remove battery from the list
 * @param {BatteryId} batteryId 
 */
export function removeBattery(batteryId) {
    delete _batteryList[batteryId];
    delete _loadedBatteries[batteryId];
}

/**
 * Selects battery to get information for.
 * @param {BatteryId} batteryId 
 * @returns Tests if tests.js module is present
 */
export function selectBattery(batteryId) {
    _currentBatteryId = batteryId;

    if(typeof loadTests == "function")
        return loadTests();
}

/**
 * @returns {FullBattery} Full details about the selected battery
 */
export function loadBattery() {
    const batteryId = _currentBatteryId;

    if(isBatteryLoaded())
        return _loadedBatteries[batteryId];

    return fetch(`/BatteryTestingAPI/battery/?battery-id=${batteryId}`, {method:"GET", mode:"cors", headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(res => _loadedBatteries[batteryId] = res);
}

/**
 * @returns {FullBattery | Battery} Current battery's information
 */
export function getBattery() {
    return _loadedBatteries[_currentBatteryId] ?? _batteryList[_currentBatteryId];
}

/**
 * @returns {boolean} If current battery has full detail
 */
export function isBatteryLoaded() {
    return !!_loadedBatteries[_currentBatteryId];
}