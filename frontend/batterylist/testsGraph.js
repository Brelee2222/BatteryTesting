import { getTests } from "../utils/test.js";

// Canvas context for test graph
const graphContext = document.getElementById("testsGraph").getContext("2d");

// Values for generating axes
const AXIS_PADDING = 20;
const AXIS_WIDTH = 5;

// Values for generating and connecting points
const TEST_LINE_WIDTH = 2;

/**
 * @typedef Scale Graph dimensions
 * 
 * @property {number} minX
 * @property {number} minY
 * @property {number} maxX
 * @property {number} maxY
 */

/**
 * @type {Scale}
 */
const canvasScale = {
    minX : 0,
    minY : 0,
    maxX : graphContext.canvas.width,
    maxY : graphContext.canvas.height
};

/**
 * @type {Scale}
 */
const graphScale = {
    minX : AXIS_PADDING,
    minY : AXIS_PADDING,
    maxX : canvasDimensions.maxX - AXIS_PADDING,
    maxY : canvasDimensions.maxY - AXIS_PADDING
};

/**
 * @type {Scale}
 */
const testValueScale = {
    minX : 0,
    minY : 0,
    maxX : 0,
    maxY : 90
};

// draw graph axes
function drawAxes() {
    graphContext.lineWidth = AXIS_WIDTH;
    graphContext.moveTo(graphScale.minX, graphScale.minY);
    graphContext.lineTo(graphScale.minX, graphScale.maxY);
    graphContext.lineTo(graphScale.maxX, graphScale.maxY);
    graphContext.stroke();
}

function transferScale(point, fromScale, toScale) {
    return {
        x : (point.x - fromScale.minX) / (fromScale.maxX - fromScale.minX) * (toScale.maxX - toScale.minX) + toScale.minX,
        y : (point.y - fromScale.minY) / (fromScale.maxY - fromScale.minY) * (toScale.maxY - toScale.minY) + toScale.minY
    }
}

function testToPoint(test) {
    return transferScale({
        x : test.startTime,
        y : testValueScale.maxY - test.capacity
    },
    testValueScale,
    graphScale);
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