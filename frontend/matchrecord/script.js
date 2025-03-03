(async function() {
    const teamListElement = document.querySelector("#teamNumber");

    for(const team of await (fetch("/BatteryTestingAPI/teams").then(res => res.json()))) {
        const teamOptionElement = document.createElement("option");

        teamOptionElement.value = team.teamNumber;
        teamOptionElement.label = team.teamNumber;

        teamListElement.appendChild(teamOptionElement);
    }
})();