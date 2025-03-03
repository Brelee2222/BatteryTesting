let currentEventKey;
let matches;

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

    teamListElement.addEventListener("select", async event => {
        currentEventKey = await (fetch(`/BatteryTestingAPI/event/current?team-number=${event.target.value}`).then(res => res.text()));
        matches = await (fetch(`/BatteryTestingAPI/event/current/matches?team-number=${event.target.value}`).then(res => res.json()));
    });
})();