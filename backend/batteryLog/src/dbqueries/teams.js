const database = require("../database.js");

let teams;

function getTeams() {
    return teams;
}

const init = (async function() {
    teams = await database.execute("call getTeams();", [], result => result);
})();


module.exports = {
    getTeams,
    init
};