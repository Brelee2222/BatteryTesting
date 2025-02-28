{
    const battery = opener.getBattery();

    document.querySelector("#batteryName").innerText = battery.name + " Notes Manage";

    document.querySelector("#notesContainer").appendChild(opener.document.querySelector("#notesListScreen").cloneNode(true));

    document.querySelectorAll("#notesListScreen div").forEach(note => note.addEventListener("click", () => note.className = "selected"));
}