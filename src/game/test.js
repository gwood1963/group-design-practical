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
        [2, 3]
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
    dummyGraph;
    readSeed = new ReadSeed;
    maxFlowSolver = new MaxFlowSolver;

    constructor() {}

    test1() {
        this.graph = graph1;
        //this.graph.logInfo();

        this.dummyGraph = new Graph(5, [
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
        ])



        console.log("graph edge info");
        //console.log(this.graph.adjList()); //test.js:62 Uncaught TypeError: this.graph.adjList is not a function
        console.log(this.dummyGraph.A);
        console.log(this.dummyGraph.adjMatrixWithCap());
        console.log("end graph edge info");

        console.log(this.graph.getA());
        //console.log(this.graph.adjList());


        console.log("Max flow: " + this.maxFlowSolver.maxFlow(this.graph));
    }

    test2() {
        this.graph = graph1;
        //this.graph.logInfo();

        this.dummyGraph = new Graph(6, [
            [
                [1, 10],
                [2, 10]
            ],
            [
                [2, 2],
                [3, 4],
                [4, 8]
            ],
            [
                [4, 9]
            ],
            [
                [5, 10]
            ],
            [
                [3, 6],
                [5, 10]
            ],
            []
        ])



        console.log("graph edge info");
        //console.log(this.graph.adjList()); //test.js:62 Uncaught TypeError: this.graph.adjList is not a function
        console.log(this.dummyGraph.A);
        console.log(this.dummyGraph.adjMatrixWithCap());
        console.log("end graph edge info");

        console.log(this.graph.getA());
        //console.log(this.graph.adjList());


        console.log("Max flow: " + this.maxFlowSolver.maxFlow(this.dummyGraph));
    }
}


function runTest1() {
    var tester = new Test;

    tester.test1();
};

function runTest2() {
    var tester = new Test;

    tester.test2();
};

function log3() {
    console.log(3);
};

console.log("hi");
runTest1();
console.log("______________________________________________________")
runTest2();