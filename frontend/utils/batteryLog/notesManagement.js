{
    function createNote(batteryId, note, time) {
        return fetch(`/BatteryTestingAPI/note/?battery-id=${batteryId}`, {method:"PUT", mode:"cors", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
            time,
            note
        })});
    }
    
    function removeNote(noteId) {
        return fetch(`/BatteryTestingAPI/note/remove/?note-id=${noteId}`, {method:"PUT"});
    }
}