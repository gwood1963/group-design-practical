/*
This file serves to represent the backend needed for roudn 1
*/

import { Graph } from './Graph.js'

class Round1 {
    theGraph = new Graph;

    constructor() {}

    loadGraph(graph) {
        this.theGraph = graph;
    }
}