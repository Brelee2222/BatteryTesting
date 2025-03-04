import { batteryInit, getBatteries, selectBattery, loadBattery } from "../utils/battery.js"; 
import { deleteBatteryProfile, addBatteryProfile, editBatteryProfile } from "../utils/batteryManagement.js";

(async function() {
    await batteryInit;

    fillBatteryList();
})();

function fillBatteryList() {
    const batteryNamesElement = document.querySelector("#select .list");

    while(batteryNamesElement.children[0])
        batteryNamesElement.removeChild(batteryNamesElement.children[0]);

    getBatteries().map(battery => {
        const element = document.createElement("option");
        element.value = battery.id;
        element.label = battery.name;
        return element;
    }).forEach(batteryNamesElement.appendChild, batteryNamesElement);
}

const switchBattery = function(batteryId) {
    selectBattery(batteryId);

    showBatteryInfo();
}

const showBatteryInfo = async function() {
    const battery = await loadBattery();

    const date = new Date(Date.parse(battery.date));

    document.querySelector("#info #name input").value = battery.name;
    document.querySelector("#info #date input").value = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
    document.querySelector("#info #description input").value = battery.description;
}

const deleteBattery = function() {
    if(!confirm("Please confirm with someone before deleting a battery."))
        return;

    deleteBatteryProfile().then(fillBatteryList);
}

const addBattery = function() {
    addBatteryProfile(document.querySelector("#info #name input").value, document.querySelector("#info #date input").value, document.querySelector("#info #description input").value).then(fillBatteryList);
}

const editBattery = function() {
    editBatteryProfile(document.querySelector("#info #name input").value, document.querySelector("#info #date input").value, document.querySelector("#info #description input").value).then(fillBatteryList);
}

document.querySelector("#select .list").addEventListener("change", event => switchBattery(event.target.value));
document.querySelector("#options .delete").addEventListener("click", deleteBattery);
document.querySelector("#options .add").addEventListener("click", addBattery);
document.querySelector("#options .edit").addEventListener("click", editBattery);