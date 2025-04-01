import { getTests } from "../utils/test.js";

// Values for generating axes
const AXIS_PADDING = 20;
const AXIS_WIDTH = 5;
const AXIS_COLOR = "black";

// Values for generating and connecting points
const TEST_LINE_WIDTH = 2;

const LOW_VOLTAGE_COLOR = {
    r : 255,
    g : 0,
    b : 0
};

const HIGH_VOLTAGE_COLOR = {
    r : 0,
    g : 255,
    b : 0
};


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
    minX : 14,
    minY : 90,
    maxX : 10,
    maxY : 0
};

/**
 * @type {Scale}
 */
const testDateScale = {
    minX : 0,
    minY : 90,
    maxX : 0,
    maxY : 0
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

    testToPoint;

    constructor(canvasId, scale, testToPoint) {
        this.graphContext = document.getElementById(canvasId).getContext("2d");
        this.testToPoint = testToPoint;

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

        graphContext.beginPath();

        graphContext.lineWidth = AXIS_WIDTH;
        graphContext.strokeStyle = AXIS_COLOR;

        graphContext.moveTo(graphScale.minX, graphScale.minY);
        graphContext.lineTo(graphScale.minX, graphScale.maxY);
        graphContext.lineTo(graphScale.maxX, graphScale.maxY);

        graphContext.stroke();
    }

    transferScale(point) {
        const scale = this.getScale();
        const graphScale = this.getGraphScale();

        return {
            x : (point.x - scale.minX) / (scale.maxX - scale.minX) * (graphScale.maxX - graphScale.minX) + graphScale.minX,
            y : (point.y - scale.minY) / (scale.maxY - scale.minY) * (graphScale.maxY - graphScale.minY) + graphScale.minY
        };
    }

    async displayTests(tests) {
        const graphContext = this.getContext();

        graphContext.reset();

        this.drawAxes();
    
        const testPoints = 
            tests.filter(test => 
                test.startTime >= testDateScale.minX && test.startTime <= testDateScale.maxX
            ).map(test => {
                const multiplier = (test.startVoltage - testVoltageScale.minX) / (testVoltageScale.maxX - testVoltageScale.minX);
                
                return {
                    color : `rgb(${multiplier * (LOW_VOLTAGE_COLOR.r - HIGH_VOLTAGE_COLOR.r) + HIGH_VOLTAGE_COLOR.r} ${multiplier * (LOW_VOLTAGE_COLOR.g - HIGH_VOLTAGE_COLOR.g) + HIGH_VOLTAGE_COLOR.g} ${multiplier * (LOW_VOLTAGE_COLOR.b - HIGH_VOLTAGE_COLOR.b) + HIGH_VOLTAGE_COLOR.b})`, 
                    point : this.transferScale(this.testToPoint(test))
                }
            }).sort((a, b) => a.point.x - b.point.x);    

        let lastPoint = testPoints.shift();
    
        graphContext.lineWidth = TEST_LINE_WIDTH;

        testPoints.forEach(testPoint => {
            const gradient = graphContext.createLinearGradient(lastPoint.point.x, lastPoint.point.y, testPoint.point.x, testPoint.point.y);
            
            gradient.addColorStop(0, lastPoint.color);
            gradient.addColorStop(1, testPoint.color);

            graphContext.beginPath();

            graphContext.strokeStyle = gradient;

            graphContext.moveTo(lastPoint.point.x, lastPoint.point.y);

            graphContext.lineTo(testPoint.point.x, testPoint.point.y);

            graphContext.stroke();

            lastPoint = testPoint;
        });
    }
}

const graphs = [
    new TestGraph("voltageGraph", testVoltageScale, test => ({
        x : test.startVoltage,
        y : test.capacity
    }))
];

export function changeDateRange(from, to) {
    testDateScale.minX = from;
    testDateScale.maxX = to;
} 

export function displayGraphs() {
    const tests = getTests();

    graphs.forEach(graph => graph.displayTests(tests));
}