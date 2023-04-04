/*
This file serves to represent the backend needed for roudn 1
*/

import { Graph } from './Graph.js'
import { ReadSeed } from './ReadSeed.js'
import { MaxFlowSolver } from './MaxFlowSolver.js'
import { Generate } from './Generate.js';
import { Display } from './Display.js'

export class Round1 {
    theGraph = new Graph;
    theA;
    theANoCap;
    theN;
    seedReader = new ReadSeed;
    maxFlowEngine = new MaxFlowSolver;
    generate = new Generate;
    display = new Display; //likely not needed in the end

    //constructor() {}

    gen() {
        this.generate.generate(6, 6, 2, 2, 1, 10)
        var randomG = this.generate.export();
        this.theGraph = randomG;
        var randomA = randomG.getA();
        this.theA = randomA;
        var randomANoCap = randomG.getAWithoutCaps();
        this.theANoCap = randomANoCap;
        var n = randomA.length;
        this.theN = n;
        /* console.log(this.generate.isDirected(randomA))
        console.log(this.generate.isConnected(randomA))
        for (var i = 0; i < n; i++) {
            console.log("A[" + i + "]: " + randomA[i])
        }
        console.log("Max flow: " + this.maxFlowSolver.maxFlow(randomG)) */
        //var randomANoCap = randomG.getAWithoutCaps();
        var coords = this.display.getPositions(6, randomANoCap, 1000, 500);
        //this.display.consoleDisplay(6, randomANoCap, coords, 100, 100)
    }

    getGraph() {
        return this.theGraph;
    }

    getA() {
        return this.theA;
    }

    getANoCap() {
        return this.theANoCap;
    }

    getN() {
        return this.theN;
    }

    getCoords(w, h) {
        //var randomANoCap = randomG.getAWithoutCaps();
        var coords = this.display.getPositions(this.theN, this.theANoCap, w, h);
        return coords
    }

    readSeed(seed) {
        this.seedReader.readSeed(seed);
        this.theGraph = this.seedReader.getGraph();
    }

    loadGraph(graph) {
        this.theGraph = graph;
    }


    optimalFlow() {
        this.maxFlowEngine.setGraph(this.theGraph);
        return this.maxFlowEngine.maxFlow();
    }
}