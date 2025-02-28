{
    var showNotes = async function() {
        const notes = Object.values(await loadNotes());

        const notesListElement = document.querySelector("#notesListScreen");

        while(notesListElement.children[0])
            notesListElement.removeChild(notesListElement.children[0]);

        notes.forEach(note => {
            const noteItemElement = document.createElement("div");

            noteItemElement.className = "item";
            noteItemElement.setAttribute("noteTime", note.time);
            noteItemElement.note = note.note;

            const dateElement = document.createElement("p");

            dateElement.innerHTML = new Date(note.time).toLocaleString("en-US") + "<br>" + note.note;
            noteItemElement.appendChild(dateElement);

            notesListElement.appendChild(noteItemElement);
        });
    }

    document.querySelector("#manageNotes").addEventListener("click", () => {
        if(getBattery())
            window.open(`notesmanage/`, "Manage NotesWindow", "width=600,height=300");
    });
}