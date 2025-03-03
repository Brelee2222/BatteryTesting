import { getLoadTestingConfig } from "./configs.js";
import { startReading } from "./reading.js";

// serial port
let _serialPort;

// For turning text into sendable data
const encoder = new TextEncoder();

// For turning data into readable text
const decoder = new TextDecoder("utf-8");

/**
 * Requests the client to select a port. If for any reason the port selected is undefined, an error will be logged.
 */
async function selectPort() {
    if(_serialPort == undefined) {
        _serialPort = await navigator.serial.requestPort();

        if(_serialPort == undefined)
            return console.error("Could not find serial device");

        document.querySelector("#serial .check").innerText = "Tester Selected";
    } else {
        _serialPort.close();
    }
}

/**
 * Connects to the serial port
 */
async function connect() {
    await _serialPort.open(getLoadTestingConfig("portOptions"));

    listen();

    startReading();

    // Basic serial test to confirm a solid communication 
    document.querySelector("#serial .name").innerText = await requestSerialMessage("name");
}

// message delay
const TIMEOUT_DELAY = 25;

// Queue of messages to send over serial
let queue = [];

// the current listener's id
let listenerID = 0;

/**
 * Function loop. Waits for messages in the queue, and serves them to the load tester. If a question mark is added to the end of a message, the function waits for a response and sends it through a callback function. If it waits for too long, another listener will take its place, and the preceding listener will have its id invalidated. 
 */
async function listen() {
    // Set the listener ID to a new value.
    const id = ++listenerID;
    
    // For sending data to the load tester
    const writer = _serialPort.writable.getWriter();

    // For receiveing data
    const reader = _serialPort.readable.getReader();

    while(_serialPort.connected) {
        // loop until a request is in the queue
        let request;
        do {
            // Timeout to keep javascript from freezing
            await new Promise(res => setTimeout(res, TIMEOUT_DELAY));
            request = queue.shift();
        } while(!request);

        // Add a new line to the end to indicate the end of a command
        writer.write(encoder.encode(request.message + "\n"));

        if(request.message.endsWith("?")) {
            let returnedMessage = "";

            while(true) {

                // To detect when the load tester does not respond.
                const timeout = setTimeout(() => {
                    console.error("Load tester took too long to respond.");
                    queue.unshift(request);

                    // make writer and reader available again
                    writer.releaseLock();
                    reader.releaseLock();
                    
                    listen();
                }, 10000);

                const { value, done } = await reader.read();

                // if a new listener was started, pass the request back into the queue, and stop
                if(listenerID != id)
                    return;

                clearTimeout(timeout);

                const char = decoder.decode(value);

                if(done || char == "\n")
                    break;
                
                returnedMessage += char;
            }

            if(returnedMessage == "Error" || returnedMessage == "error")
                alert("Load Tester Error");

            request.response(returnedMessage);
        } else {
            request.response("");
        }
    }
}

/**
 * Send a message to the load tester
 * @param {string} message message to send
 * @returns {Promise<string | void>} Promise for the completion of the process
 */
export function sendSerialMessage(message) {
    return new Promise(response => queue.push({
        message,
        response
    }));
}

/**
 * Sends a request to the load tester
 * @param {string} message message to send
 * @returns {Promise<string>} Promise for the return message from the tester
 */
export function requestSerialMessage(message) {
    return sendSerialMessage(message + "?");
}

// add button functionality
document.querySelector("#serial .select").addEventListener("click", selectPort);
document.querySelector("#serial .connect").addEventListener("click", connect);
document.querySelector("#command .send").addEventListener("click", async () => alert(await sendSerialMessage(document.querySelector("#command .input").value)));