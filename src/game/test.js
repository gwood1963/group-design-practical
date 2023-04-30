/*
Test suite for other files in the same directory
*/

import { Generate } from './Generate.js'
import { Graph } from './Graph.js'
import { ReadSeed } from './ReadSeed.js'
import { MaxFlowSolver } from './MaxFlowSolver.js'
import { Display } from './Display.js'
import { Round1 } from './Round1.js'
import { Round2 } from './Round2.js'
import { Round3 } from './Round3.js'

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

var sampleA1ListNoCap = [
    [
        1,
        2
    ],
    [
        2,
        4
    ],
    [
        3
    ],
    [
        1,
        4
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

var goodANoCap = [
    [
        1,
        2
    ],
    [
        2,
        3,
        4
    ],
    [
        4
    ],
    [
        5
    ],
    [
        3,
        5
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

var simpleANoCap = [
    [
        1,
        2
    ],
    [
        2,
        3
    ],
    [
        3
    ],
    []
]

var clusterANoCap = [
    [
        1,
        2
    ],
    [
        0,
        2
    ],
    [
        0,
        1,
        3
    ],
    [

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
    display = new Display;

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

    displayTest1() {
        var coords = this.display.getPositionsRandom(5, sampleA1ListNoCap, 100, 100);
        this.display.consoleDisplay(5, sampleA1ListNoCap, coords, 100, 100);
        console.log("Coordinates with width 100 and height 100: ");
        for (var i = 0; i < coords.length; i++) {
            const x = coords[i][0];
            const y = coords[i][1];
            console.log("Node " + i + ":");
            console.log("(" + x + ", " + y + ")");
        }
    }

    displayTest2() {
        var coords = this.display.getPositionsRandom(6, goodANoCap, 100, 100);
        this.display.consoleDisplay(6, goodANoCap, coords, 100, 100);
        console.log("Coordinates with width 100 and height 100: ");
        for (var i = 0; i < coords.length; i++) {
            const x = coords[i][0];
            const y = coords[i][1];
            console.log("Node " + i + ":");
            console.log("(" + x + ", " + y + ")");
        }
    }
    displayTest3() {
        var coords = this.display.getPositionsRandom(4, simpleANoCap, 100, 100);
        this.display.consoleDisplay(4, simpleANoCap, coords, 100, 100);
        console.log("Coordinates with width 100 and height 100: ");
        for (var i = 0; i < coords.length; i++) {
            const x = coords[i][0];
            const y = coords[i][1];
            console.log("Node " + i + ":");
            console.log("(" + x + ", " + y + ")");
        }
    }
    displayTest4() {
        var coords = this.display.getPositionsRandom(4, clusterANoCap, 100, 100);
        this.display.consoleDisplay(4, clusterANoCap, coords, 100, 100);
        console.log("Coordinates with width 100 and height 100: ");
        for (var i = 0; i < coords.length; i++) {
            const x = coords[i][0];
            const y = coords[i][1];
            console.log("Node " + i + ":");
            console.log("(" + x + ", " + y + ")");
        }
    }
    fullTest() {
        this.generate.generate(6, 5, 3, 2, 1, 10)
        var randomG = this.generate.export();
        var randomA = randomG.getA();
        var n = randomA.length
        console.log(this.generate.isDirected(randomA))
        console.log(this.generate.isConnected(randomA))
        for (var i = 0; i < n; i++) {
            console.log("A[" + i + "]: " + randomA[i])
        }
        console.log("Max flow: " + this.maxFlowSolver.maxFlow(randomG))
        var randomANoCap = randomG.getAWithoutCaps();
        var coords = this.display.getPositionsRandom(6, randomANoCap, 100, 100)
        this.display.consoleDisplay(6, randomANoCap, coords, 100, 100)
    }
    fullTest2() {
        this.generate.generate(5, 2, 2, 2, 1, 10)
        var randomG = this.generate.export();
        var randomA = randomG.getA();
        var n = randomA.length
        console.log(this.generate.isDirected(randomA))
        console.log(this.generate.isConnected(randomA))
        for (var i = 0; i < n; i++) {
            console.log("A[" + i + "]: " + randomA[i])
        }
        console.log("Max flow: " + this.maxFlowSolver.maxFlow(randomG))
        var randomANoCap = randomG.getAWithoutCaps();
        var coords = this.display.getPositionsRandom(5, randomANoCap, 100, 100)
        this.display.consoleDisplay(5, randomANoCap, coords, 100, 100)
    }

    round2SeedTest() {
        const s = "5%500%1%2%3.34%4%20,30%25,70%37,50%60,20%80,25%";
        const round2 = new Round2;
        round2.readSeed(s);
        console.log(round2.getCoords());
        console.log(round2.getN());
        console.log(round2.moneyRemaining());
        console.log(round2.getBankParams());
        console.log(round2.getCoords());
        this.display.consoleDisplay(round2.getN(), round2.getANoCap(), round2.getCoords(), 100, 100);
        round2.addRoad(1, 2, 10, 10);
        console.log(round2.moneyRemaining());
        console.log(round2.getA());
        this.display.consoleDisplay(round2.getN(), round2.getANoCap(), round2.getCoords(), 100, 100);
        console.log(round2.makeSeed());
        round2.logInfo();

    }

    round2RandomTest() {
        const round2 = new Round2;
        round2.genRandom(5, 100, 100);
        console.log(round2.getCoords());
        console.log(round2.getN());
        console.log(round2.moneyRemaining());
        this.display.consoleDisplay(round2.getN(), round2.getANoCap(), round2.getCoords(), 100, 100);
        console.log(round2.makeSeed());
    }

    round2RandomTest2() {
        const round2 = new Round2;
        round2.setBankParams(1, 1, 1, 2);
        round2.genRandom(5, 100, 100);
        round2.addRoad(0, 3, 3, 4);
        round2.addRoad(2, 4, 5, 2);
        const A = round2.getA();
        /* for (var i = 0; i < A.length; i++) {
            console.log(A[i]);
        } */
        console.log(round2.getCoords());
        console.log(round2.getN());
        console.log(round2.moneyRemaining());
        this.display.consoleDisplay(round2.getN(), round2.getANoCap(), round2.getCoords(), 100, 100);
        round2.deleteRoad(2, 4);
        round2.deleteRoad(3, 2);
        console.log(round2.moneyRemaining());
        this.display.consoleDisplay(round2.getN(), round2.getANoCap(), round2.getCoords(), 100, 100);
        console.log(round2.makeSeed());
    }

    noFlowTest() {
        const badGraph = new Graph(9, unconnectedA);
        console.log(this.maxFlowSolver.maxFlow(badGraph));
    }

    round3SeedTest() {
        const s = "5%500%1%2%3.34%4%-2%3%2%0%-3%20,30%25,70%37,50%60,20%80,25%";
        const round3 = new Round3;
        round3.readSeed(s);
        console.log(round3.getCoords());
        console.log(round3.getN());
        console.log(round3.moneyRemaining());
        console.log(round3.getBankParams());
        console.log(round3.getDemands());
        this.display.consoleDisplay(round3.getN(), round3.getANoCap(), round3.getCoords(), 100, 100);
        round3.addRoad(1, 2, 10, 10);
        console.log(round3.moneyRemaining());
        console.log(round3.getA());
        this.display.consoleDisplay(round3.getN(), round3.getANoCap(), round3.getCoords(), 100, 100);
        console.log(round3.makeSeed());
    }

    round3FullSeedTest() {
        const s = "5%50%1%2%3.34%4%-2%3%2%0%-3%20,30%25,70%37,50%60,20%80,25%";
        const round3 = new Round3;
        round3.readSeed(s);
        console.log(round3.getCoords());
        console.log(round3.getN());
        console.log(round3.moneyRemaining());
        console.log(round3.getBankParams());
        console.log(round3.getDemands());
        this.display.consoleDisplay(round3.getN(), round3.getANoCap(), round3.getCoords(), 100, 100);

        round3.addRoad(3, 1, 3, 1);
        round3.addRoad(0, 2, 2, 1);
        console.log(round3.moneyRemaining());
        console.log(round3.getA());
        console.log(round3.getRawScore());
        this.display.consoleDisplay(round3.getN(), round3.getANoCap(), round3.getCoords(), 100, 100);

        round3.addRoad(4, 1, 3, 1);
        console.log(round3.moneyRemaining());
        console.log(round3.getA());
        console.log(round3.getRawScore());
        this.display.consoleDisplay(round3.getN(), round3.getANoCap(), round3.getCoords(), 100, 100);

        console.log(round3.makeSeed());
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

function runDisplayTest1() {
    var tester = new Test;

    tester.displayTest1();
}

function runDisplayTest2() {
    var tester = new Test;

    tester.displayTest2();
}

function runDisplayTest3() {
    var tester = new Test;

    tester.displayTest3();
}

function runDisplayTest4() {
    var tester = new Test;

    tester.displayTest4();
}

function runFullTest() {
    var tester = new Test;

    tester.fullTest();
}

function runFullTest2() {
    var tester = new Test;

    tester.fullTest2();
}

function runNoFlowTest() {
    var tester = new Test;

    tester.noFlowTest();
}

function testRound1() {
    const round1 = new Round1;
    round1.genRandom(5, 3, 2, 2, 5, 10);
    round1.theGraph.logInfo();

    /* const graph = round1.getGraph();
    const A = round1.getA();
    const ANoCap = round1.getANoCap();
    const n = round1.getN(); */
    const seed = round1.makeSeed();
    console.log(seed);
    const Round1_ = new Round1;
    Round1_.readSeed(seed);
    Round1_.theGraph.logInfo();
}

function runRound2SeedTest() {
    var tester = new Test;
    tester.round2SeedTest();
}

function runRound2RandomTest() {
    var tester = new Test;
    tester.round2RandomTest();
}

function runRound2RandomTest2() {
    var tester = new Test;
    tester.round2RandomTest2();
}

function runRound3SeedTest() {
    var tester = new Test;
    tester.round3SeedTest();
}

function runRound3FullSeedTest() {
    var tester = new Test;
    tester.round3FullSeedTest();
}

//console.log("hi");
//runTest1();
//runGenerationTest1();
//console.log("______________________________________________________")
//runTest2();
//runGenerationTest2();
//console.log("______________________________________________________")
//runGenerationTest4();
//console.log("______________________________________________________")
//runGenerationTest5();

//console.log("______________________________________________________")
//console.log("generate a good adj list")
//runGenerationTest3();

//console.log(1 / 0)

//runDisplayTest1();    
//runDisplayTest2();
//runDisplayTest3();
//runDisplayTest4();
//runFullTest();
//runFullTest2();

//testRound1();
runRound2SeedTest();
//runRound2RandomTest();
//runRound2RandomTest2();

//runNoFlowTest();

//runRound3SeedTest();
//runRound3FullSeedTest();