{
    let _notes = {};

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
        return _notes[getBattery().id];
    }
}