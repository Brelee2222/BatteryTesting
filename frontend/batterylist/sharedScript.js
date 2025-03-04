import { getBattery, selectBattery } from "../utils/battery.js";
import { getNotes } from "../utils/notes.js";
import { showNotes } from "./notes.js";

window.selectBattery = selectBattery;
window.getBattery = getBattery;
window.getNotes = getNotes;
window.showNotes = showNotes;