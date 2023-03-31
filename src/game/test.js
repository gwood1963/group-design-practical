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

var goodA = [
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
]

var graph2 = new Graph(6, goodA)

var badA = [
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
        [4, 2],
        [5, 10]
    ],
    [
        [3, 6],
        [5, 10]
    ],
    []
]

var unconnectedA = [
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
    [

    ],
    [
        [7, 8]
    ],
    [
        [8, 8]
    ],
    [
        [6, 2]
    ]
]

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
        this.graph = graph2;
        //this.graph.logInfo();



        console.log("graph edge info");
        //console.log(this.graph.adjList()); //test.js:62 Uncaught TypeError: this.graph.adjList is not a function

        console.log(this.graph.getA());
        //console.log(this.graph.adjList());


        console.log("Max flow: " + this.maxFlowSolver.maxFlow(this.graph));
    }

    generationTest1() { //bad A, has edge going both ways
        console.log("Is directed?")
        console.log(this.generate.isDirected(badA))
    }

    generationTest2() { //Good A, connected too
        console.log("Is directed?")
        console.log(this.generate.isDirected(goodA))
    }

    generationTest3() {
        console.log("Is good for random?")
        this.generate.generate(6, 6, 2, 2, 1, 10)
        var randomG = this.generate.export();
        var randomA = randomG.getA();
        var n = randomA.length
        console.log(this.generate.isDirected(randomA))
        console.log(this.generate.isConnected(randomA))
        for (var i = 0; i < n; i++) {
            console.log("A[" + i + "]: " + randomA[i])
        }
        console.log("Max flow: " + this.maxFlowSolver.maxFlow(randomG))
    }

    generationTest4() { //bad A, unconnected
        console.log("Is connected?")
        console.log(this.generate.isConnected(unconnectedA))
    }

    generationTest5() { //good A, connected
        console.log("Is connected?")
        console.log(this.generate.isConnected(goodA))
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

function runGenerationTest1() {
    var tester = new Test;

    tester.generationTest1();
}

function runGenerationTest2() {
    var tester = new Test;

    tester.generationTest2();
}

function runGenerationTest3() {
    var tester = new Test;

    tester.generationTest3();
}

function runGenerationTest4() {
    var tester = new Test;

    tester.generationTest4();
}

function runGenerationTest5() {
    var tester = new Test;

    tester.generationTest5();
}

function log3() {
    console.log(3);
};

console.log("hi");
runTest1();
//runGenerationTest1();
console.log("______________________________________________________")
runTest2();
//runGenerationTest2();
console.log("______________________________________________________")
runGenerationTest4();
console.log("______________________________________________________")
runGenerationTest5();

console.log("______________________________________________________")
console.log("generate a good adj list")
runGenerationTest3();