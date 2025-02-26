{
    (async function() {
        await batteryInit;

        fillBatteryList();
    })();

    const fillBatteryList = function() {
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

    const switchBattery = async function(batteryId) {
        selectBattery(batteryId);

        const battery = await loadBattery();

        document.querySelector("#batteryDescription .description").innerText = battery.description;
    }
}