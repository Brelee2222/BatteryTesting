import { getBatteries, batteryInit } from "../utils/battery.js";

let currentEventKey;
let matchKeys;

function fillMatchKeys() {
    const matchKeyListElement = document.querySelector("#matchKey");

    while(matchKeyListElement.childNodes[0])
        matchKeyListElement.removeChild(matchKeyListElement.childNodes[0]);

    for(const matchKey of matchKeys) {
        const matchKeyOptionElement = document.createElement("option");

        matchKeyOptionElement.value = matchKey;
        matchKeyOptionElement.label = matchKey;

        matchKeyListElement.appendChild(matchKeyOptionElement);
    }
}

(async function() {
    const teamListElement = document.querySelector("#teamNumber");

    for(const team of await (fetch("/BatteryTestingAPI/teams").then(res => res.json()))) {
        const teamOptionElement = document.createElement("option");

        teamOptionElement.value = team.teamNumber;
        teamOptionElement.label = team.teamNumber;

        teamListElement.appendChild(teamOptionElement);
    }

    teamListElement.value = "";
    teamListElement.label = "";

    teamListElement.addEventListener("change", async event => {
        currentEventKey = await (fetch(`/BatteryTestingAPI/event/current?team-number=${event.target.value}`).then(res => res.text()));
        matchKeys = await (fetch(`/BatteryTestingAPI/event/current/matches?team-number=${event.target.value}`).then(res => res.json()));

        fillMatchKeys();
    });

    await batteryInit;

    const batteryListElement = document.querySelector("#battery");
    for(const battery of getBatteries()) {
        const batteryOption = document.createElement("option");

        batteryOption.value = battery.id;
        batteryOption.label = battery.name;

        batteryListElement.appendChild(batteryOption);
    }
})();

document.querySelector("#noteText").addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}, false);

document.querySelector("#submit").addEventListener("click", async() => {
    fetch(`/BatteryTestingAPI/match/log?event-key=${currentEventKey}&match-key=${document.querySelector("#matchKey").value}&battery-id=${document.querySelector("#battery").value}`, {method:"PUT", mode:"cors", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
        teamNumber : document.querySelector("#teamNumber").value,
        voltageHigh : document.querySelector("#voltageHigh").value,
        voltageLow : document.querySelector("#voltageLow").value,
        time : Date.now(),
        note : document.querySelector("#noteText").value
    })});
});