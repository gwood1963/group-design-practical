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

    adjList() {
        return this.A;
    }

    adjMatrix() {
        var m = new Array(n)[new Array(n)[0]];
        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < A[i].length; j++) {
                m[i][A[i][j][0]] = 1; //edge from i to j (A[i][j][0])
            }
        }
        return m;
    }

    capMatrix() {
        var m = new Array(n)[new Array(n)[0]];
        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < A[i].length; j++) {
                m[i][A[i][j][0]] = A[i][j][1] //capacity of edge from i to j (A[i][j][0])
            }
        }
        return m;
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