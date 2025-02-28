{
    const battery = opener.getBattery();
    let noteId;

    document.querySelector("#batteryName").innerText = battery.name + " Battery\nNotes Manage";

    function copyNotesList() {
        if(document.querySelector("#notesListScreen"))
            document.querySelector("#notesListScreen").remove();

        document.querySelector("#notesContainer").appendChild(opener.document.querySelector("#notesListScreen").cloneNode(true));

        const noteItems = document.querySelectorAll("#notesListScreen div");
        noteItems.forEach(note => note.addEventListener("click", () => {
            noteItems.forEach(node => node.className = "item");
            note.className = "selected item";

            noteId = note.getAttribute("noteTime");
        }));
    }

    async function deleteNote() {
        await removeNote(noteId);

        delete opener.getNotes()[noteId];

        await opener.showNotes();
        copyNotesList();
    }

    async function addNote() {
        const time = Date.now();
        const note = document.querySelector("#addNoteText").value;
        await createNote(battery.id, note, time);

        const tempId = opener.getBattery().id;

        opener.selectBattery(battery.id);

        opener.getNotes()[time] = {
            batteryId : battery.id,
            time,
            note
        };

        opener.selectBattery(tempId);

        await opener.showNotes();
        copyNotesList();
    }

    copyNotesList();

    document.querySelector("#removeNote").addEventListener("click", deleteNote);

    document.querySelector("#addNoteText").addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }, false);

    document.querySelector("#addNote").addEventListener("click", addNote);
}