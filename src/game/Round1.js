/*
This file serves to represent the backend needed for roudn 1
*/

import { Graph } from './Graph.js'
import { ReadSeed } from './ReadSeed.js'

class Round1 {
    theGraph = new Graph;
    seedReader = new ReadSeed;

    constructor() {}

    readSeed(seed) {
        this.seedReader.readSeed(seed);
        this.theGraph = this.seedReader.getGraph();
    }

    loadGraph(graph) {
        this.theGraph = graph;
    }
}