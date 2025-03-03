const teams = require("./dbqueries/teams.js");

const MISC_EVENT_KEY = "misc";

// list of lists of jsons
const teamEvents = {};

const currentTeamsEventKey = {};
const currentTeamsEventMatches = {};

function requestGetTBA(path) {
    return fetch(
        path,
        {
            method : "GET",
            headers: {
                "X-TBA-Auth-Key" : process.env.TBA_API_KEY
            }
        }
    );
}

function getEvents(teamNumber) {
    return teamEvents[teamNumber];
}

function getEventFromTime(teamNumber, time) {
    const events = getEvents(teamNumber);
    for(const event of events) {
        const startDate = new Date(event.start_date).getTime();
        const endDate = new Date(event.end_date).getTime() + (1000 * 60 * 60 * 24);
        if(startDate <= time && endDate >= time)
            return event;
    }

    return null;
}

async function getCurrentEvent(teamNumber) {
    return await (requestGetTBA(`https://thebluealliance.com/api/v3/team/frc${teamNumber}/event/2024orore/matches/key`).then(res => res.json()));
    const event = getEventFromTime(teamNumber, Date.now());
    const key = event?.key ?? "misc";

    if(key != "misc" && key != currentTeamsEventKey[teamNumber])
        currentTeamsEventMatches[teamNumber] = await (requestGetTBA(`https://thebluealliance.com/api/v3/team/frc${teamNumber}/event/${key}/matches/key`).then(res => res.json()));

    currentTeamsEventKey[teamNumber] = key;
    return event;
}

async function getCurrentEventKey(teamNumber) {
    return (await getCurrentEvent(teamNumber))?.key ?? "misc";
}

async function getCurrentEventMatches() {
    // Updates the event
    await getCurrentEvent();

    return currentTeamsEventMatches[teamNumber];
}

function getEventKeyFromTime(teamNumber, time) {
    return getEventFromTime(teamNumber, time)?.key ?? "misc";
}

(async function() {
    await teams.init;

    for(const team of teams.getTeams())
        teamEvents[team.teamNumber] = await (requestGetTBA(`https://thebluealliance.com/api/v3/team/frc${team.teamNumber}/events/${new Date().getFullYear()}`).then(res => res.json()));
})();

module.exports = {
    MISC_EVENT_KEY,
    getEvents,
    getCurrentEventKey,
    getEventKeyFromTime,
    getCurrentEventMatches
}