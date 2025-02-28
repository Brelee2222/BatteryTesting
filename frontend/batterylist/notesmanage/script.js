{
    const battery = opener.getBattery();

    document.querySelector("#batteryName").innerText = battery.name + " Battery\nNotes Manage";

    document.querySelector("#notesContainer").appendChild(opener.document.querySelector("#notesListScreen").cloneNode(true));

    const noteItems = document.querySelectorAll("#notesListScreen div");
    noteItems.forEach(note => note.addEventListener("click", () => {
        noteItems.forEach(node => node.className = "item");
        note.className = "selected item";

        selectNote(note.noteTime);
    }));

    document.querySelector("#removeNote").addEventListener("click", removeNote);
}