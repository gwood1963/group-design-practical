/*
The aim of this file is to provide a way to store graphs as an object while running the application
*/

export class Graph {
    //nodes = [];
    n;
    A = [
        []
    ]; // list of (j, capacity)'s in row i
    constructor(numNodes, adjacencyList) {
        //this.nodes = nodes //maybe not needed, instead store numNodes?
        this.n = numNodes
        this.A = adjacencyList //Adjacency List of elements of the form (j, capacity) in row i
    }

    set nodes(n) {
        this.n = n;
    }

    set adjList(adj) {
        this.A = adj;
    }

    logInfo() {
        console.log("Nodes: " + nodes);
        console.log("Adjacency Matrix: " + A)
    }

}