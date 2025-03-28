import { getTests, loadTests } from "../utils/test.js";

const graphContext = document.getElementById("testsGraph").getContext("2d");

const AXIS_PADDING = 20;
const AXIS_WIDTH = 5;

const TEST_LINE_WIDTH = 2;

const canvasWidth = graphContext.canvas.width;
const canvasHeight = graphContext.canvas.height;

const graphWidth = canvasWidth - AXIS_PADDING * 2;
const graphHeight = canvasHeight - AXIS_PADDING * 2;

let dateFro = 0;
let dateTo = 0;

let minCapacity = 10;
let maxCapacity = 90;

// draw graph axes
function drawAxes() {
    graphContext.lineWidth = AXIS_WIDTH;
    graphContext.moveTo(AXIS_PADDING, AXIS_PADDING);
    graphContext.lineTo(AXIS_PADDING, canvasHeight-AXIS_PADDING);
    graphContext.lineTo(canvasWidth-AXIS_PADDING, canvasHeight-AXIS_PADDING);
    graphContext.stroke();
}

function testToPoint(test) {
    return {
        x : (test.startTime - dateFro) / (dateTo - dateFro) * graphWidth + AXIS_PADDING,
        y : (maxCapacity - test.capacity) / (maxCapacity - minCapacity) * graphHeight + AXIS_PADDING
    };
}

export async function drawTests() {
    const tests = getTests().filter(test => test.startTime >= dateFro && test.startTime <= dateTo);

    graphContext.lineWidth = TEST_LINE_WIDTH;
    graphContext.moveTo(AXIS_PADDING, AXIS_PADDING);
    tests.map(testToPoint).forEach(testPoint => graphContext.lineTo(testPoint.x, testPoint.y));
    graphContext.stroke();
}

export function changeDateRange(from, to) {
    dateFro = from;
    dateTo = to;
} 

drawAxes();

window.drawTests = drawTests;