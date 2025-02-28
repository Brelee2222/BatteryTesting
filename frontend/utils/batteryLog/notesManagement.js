{
    function addNote(note) {
        return fetch(`/BatteryTestingAPI/note/?battery-id=${batteryId}`, {method:"PUT", mode:"cors", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
            time : Date.now(),
            note
        })});
    }
    
    function removeNote() {
        return fetch(`/BatteryTestingAPI/note/remove/?note-id=${getNote().time}`, {method:"PUT"});
    }
}