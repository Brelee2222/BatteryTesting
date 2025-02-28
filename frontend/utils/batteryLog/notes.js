{
    let _notes = {};

    let _currentNoteId;

    function loadNotes() {
        const batteryId = getBattery().id;

        if(_notes[batteryId])
            return _notes[batteryId];

        _notes[batteryId] = {};

        return fetch(`/BatteryTestingAPI/battery/notes/?battery-id=${batteryId}`, {method:"GET", mode:"cors", headers: {'Content-Type': 'application/json'}})
        .then(res => res.json())
        .then(res => {
            res.notes.forEach(note => _notes[batteryId][note.time] = note);
            return _notes[batteryId];
        });
    }

    function getNotes() {
        return Object.values(_notes[getBattery().id]);
    }

    function selectNote(noteId) {
        _currentNoteId = noteId;
    }

    function getNote() {
        return _notes[getBattery().id][_currentNoteId];
    }
}