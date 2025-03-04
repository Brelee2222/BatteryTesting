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
})();