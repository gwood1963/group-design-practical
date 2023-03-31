/*
This file serves to represent the backend needed for roudn 1
*/

import { Graph } from './Graph.js'
import { ReadSeed } from './ReadSeed.js'
import { MaxFlowSolver } from './MaxFlowSolver.js'

class Round1 {
    theGraph = new Graph;
    seedReader = new ReadSeed;
    maxFlowEngine = new MaxFlowSolver;

    constructor() {}

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