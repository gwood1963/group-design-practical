/*
Test suite for other files in the same directory
*/

import { Generate } from './Generate.js'
import { Graph } from './Graph.js'
import { ReadSeed } from './ReadSeed.js'
import { MaxFlowSolver } from './MaxFlowSolver.js'

//all capacities equal to 5 in this case
//simple test
var n1 = 5;
var sampleA1Mat = [
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 1],
    [0, 0, 0, 0, 0]
]
var sampleA1List = [
    [
        [1, 5],
        [2, 5]
    ],
    [
        [2, 5],
        [4, 5]
    ],
    [
        [3, 5]
    ],
    [
        [1, 5],
        [4, 5]
    ],
    []
]

var graph1 = new Graph(n1, sampleA1List);

/*

0 -> 1 -> 4
 \   | \  |
  \> 2 -> 3

*/

class Test {
    generate = new Generate;
    graph = new Graph;
    readSeed = new ReadSeed;
    maxFlowSolver = new MaxFlowSolver;

    constructor() {}

    test1() {
        this.graph = graph1;
        this.graph.logInfo();
        console.log("Max flow: " + this.maxFlowSolver.maxFlow(this.graph));
    }
}


function runTest() {
    var tester = new Test;

    tester.test1();
};

function log3() {
    console.log(3);
};

console.log("hi");
runTest();