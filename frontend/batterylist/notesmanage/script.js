{
    const battery = opener.getBattery();

    document.querySelector("#batteryName").innerText = battery.name + " Battery\nNotes Manage";

    document.querySelector("#notesContainer").appendChild(opener.document.querySelector("#notesListScreen").cloneNode(true));

    document.querySelectorAll("#notesListScreen div").forEach(note => note.addEventListener("click", () => {
        document.querySelector("#notesListScreen").childNodes.forEach(node => node.className = "item");
        note.className = "selected item";

        selectNote(note.noteTime);
    }));
}