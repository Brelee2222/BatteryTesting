import { getTests } from "../utils/test.js";

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
const testVoltageScale = {
    minX : 0,
    minY : 0,
    maxX : 14,
    maxY : 90
};

/**
 * @type {Scale}
 */
const testDateScale = {
    minX : 0,
    minY : 0,
    maxX : 0,
    maxY : 90
};

class TestGraph {
    graphContext;

    /**
     * @type {Scale}
     */
    scale;

    /**
     * @type {Scale}
     */
    canvasScale;

    /**
     * @type {Scale}
     */
    graphScale;

    testsToPoints;

    constructor(canvasId, scale, testsToPoints) {
        this.graphContext = document.getElementById(canvasId).getContext("2d");
        this.testsToPoints = testsToPoints;

        this.scale = scale;

        this.canvasScale = {
            minX : 0,
            minY : 0,
            maxX : this.graphContext.canvas.width,
            maxY : this.graphContext.canvas.height
        };

        this.graphScale = {
            minX : AXIS_PADDING,
            minY : AXIS_PADDING,
            maxX : this.canvasScale.maxX - AXIS_PADDING,
            maxY : this.canvasScale.maxY - AXIS_PADDING
        };
    }

    getContext() {
        return this.graphContext;
    }

    getScale() {
        return this.scale;
    }

    getCanvasScale() {
        return this.canvasScale;
    }

    getGraphScale() {
        return this.graphScale;
    }

    // draw graph axes
    drawAxes() {
        const graphContext = this.getContext();
        const graphScale = this.getGraphScale();
        
        graphContext.lineWidth = AXIS_WIDTH;
        graphContext.moveTo(graphScale.minX, graphScale.minY);
        graphContext.lineTo(graphScale.minX, graphScale.maxY);
        graphContext.lineTo(graphScale.maxX, graphScale.maxY);
    }

    transferScale(points) {
        const scale = this.getScale();
        const graphScale = this.getGraphScale();

        return points.map(point => ({
            x : (point.x - scale.minX) / (scale.maxX - scale.minX) * (graphScale.maxX - graphScale.minX) + graphScale.minX,
            y : (point.y - scale.minY) / (scale.maxY - scale.minY) * (graphScale.maxY - graphScale.minY) + graphScale.minY
        }));
    }

    async displayTests(tests) {
        const graphContext = this.getContext();

        graphContext.reset();

        graphContext.lineWidth = TEST_LINE_WIDTH;
    
        const testPoints = tests.filter(test => 
            test.startTime >= testDateScale.minX && test.startTime <= testDateScale.maxX
        );
    
        graphContext.moveTo(AXIS_PADDING, AXIS_PADDING);
    
        this.transferScale(this.testsToPoints(testPoints)).forEach(testPoint => graphContext.lineTo(testPoint.x, testPoint.y));
        
        graphContext.stroke();
    }
}

const graphs = [
    new TestGraph("voltageGraph", testVoltageScale, tests => tests.map(test => ({
        x : test.startingVoltage,
        y : test.capacity
    })))
];

export function changeDateRange(from, to) {
    testDateScale.minX = from;
    testDateScale.maxX = to;
} 

export function displayGraphs() {
    const tests = getTests();

    graphs.forEach(graph => graph.displayTests(tests));
}

window.displayGraphs = displayGraphs;