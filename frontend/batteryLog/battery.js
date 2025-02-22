{
    let __batteryList = [];

    let __currentBattery;

    var batteryInit = (async function() {
        __batteryList = (await fetch("/BatteryTestingAPI/battery/all", {method:"GET", mode:"cors", headers: {'Content-Type': 'application/json'}}).then(res => res.json())).batteries;
    })();

    function getBatteries() {
        return __batteryList.map(battery => ({
            name : battery.name,
            capacity : battery.capacity
        }));
    }
    
    function addBattery(battery) {
        __batteryList.push(battery);
    }

    function removeBattery(batteryId) {
        delete __batteryList[__batteryList.indexOf(__batteryList.find(battery => battery.id == batteryId))];
    }

    function selectBattery(batteryName) {
        const batteryInfo = __batteryList.find(battery => battery.name == batteryName);

        __currentBattery = {
            name : batteryInfo.name,
            capacity : batteryInfo.capacity
        };

        loadTests(batteryInfo.id);

        if(typeof useBattery == "function")
            useBattery(batteryInfo.id);
    }

    function getCurrentBattery() {
        return __currentBattery;
    }
}