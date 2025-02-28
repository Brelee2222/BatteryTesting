{
    const battery = opener.getBattery();
    let noteId;

    document.querySelector("#batteryName").innerText = battery.name + " Battery\nNotes Manage";

    function copyNotesList() {
        document.querySelector("#notesContainer").appendChild(opener.document.querySelector("#notesListScreen").cloneNode(true));

        const noteItems = document.querySelectorAll("#notesListScreen div");
        noteItems.forEach(note => note.addEventListener("click", () => {
            noteItems.forEach(node => node.className = "item");
            note.className = "selected item";

            noteId = note.getAttribute("noteTime");
        }));
    }

    function deleteNote() {
        removeNote(noteId);

        delete opener.getNotes()[noteId];
        
        opener.showNotes();
        copyNotesList();
    }

    document.querySelector("#removeNote").addEventListener("click", () => deleteNote);
}