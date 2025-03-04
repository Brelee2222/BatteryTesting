import { batteryInit, getBatteries, selectBattery, loadBattery } from "../utils/battery.js";
import { showNotes } from "./notes.js";

(async function() {
    await batteryInit;

    fillBatteryList();
})();

let _batteryId;

function fillBatteryList() {
    const batteryListElement = document.querySelector("#batteryListScreen .list");

    while(batteryListElement.children[0])
        batteryListElement.removeChild(batteryListElement[0]);

    getBatteries().forEach(battery => {
        const batteryItemElement = document.createElement("div");

        batteryItemElement.className = "item";
        batteryItemElement.batteryId = battery.id;

        const nameElement = document.createElement("span");
        nameElement.innerText = battery.name;
        batteryItemElement.appendChild(nameElement);

        const startVoltageElement = document.createElement("span");
        startVoltageElement.innerText = battery.startVoltage;
        batteryItemElement.appendChild(startVoltageElement);

        const capacityElement = document.createElement("span");
        if(battery.capacity != null)
            capacityElement.innerText = battery.capacity.toLocaleString(2);
        batteryItemElement.appendChild(capacityElement);

        batteryItemElement.addEventListener("click", () => {
            batteryListElement.childNodes.forEach(batteryItem => batteryItem.className = "item");
            batteryItemElement.className = "item itemSelected";

            switchBattery(batteryItemElement.batteryId);
        });

        batteryListElement.appendChild(batteryItemElement);
    });
}

async function switchBattery(batteryId) {
    if(_batteryId == batteryId)
        return;

    selectBattery(_batteryId = batteryId);

    const battery = await loadBattery();

    document.querySelector("#batteryDescription .description").innerText = battery.description;
    document.querySelector("#batteryDate .date").innerText = new Date(battery.date).toLocaleDateString("en-us");

    showNotes();
}