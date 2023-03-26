/*
The purpose of this file is to generate a new random puzzle, given some initial parameters (such as number of nodes)
And constraints (such as connectedness) and to export as a graph (Graph.js)
*/

/**
 * TODO: 
 * make sure we have all comppnents connected
 * make sure we dont have both an edge frmo i to j and from j to i
 */

import { Graph } from './Graph.js'

export class Generate {
    graph;
    constructor() {
        this.graph = new Graph;
    }

    /**
     * @require numNodes > 2 (s, t, and other nodes)
     * @require numFromS, numIntoT <= n-2
     * @param {Int} numNodes 
     * @param {Int} numEdges - nodes excluding those from s or into t
     * @param {Int} numFromS 
     * @param {Int} numIntoT 
     * @param {Int} minCap 
     * @param {Int} maxCap 
     */
    generate(numNodes, numEdges, numFromS, numIntoT, minCap, maxCap) {
        var adj = new Array(n).fill([]); //row i stores [j, cap]
        adj[0] = this.uniqueIntsArr(numNodes - 2, numFromS); //edges out of s: random nodes indices 2 to n-2, aka noes 1 to n-1
        adj[n - 1] = this.uniqueIntsArr(numNodes - 2, numIntoT); //edges into t: random nodes indices 2 to n-2, aka noes 1 to n-1

        //Here we generate the edges between nodes that are not s or t
        var n = numNodes
        var edges = this.uniqueIntsArrRange(n, n * n - n - 1)

        //We need to convert values in edges to adj, by using k => (k/n, k%n)
        for (var k = 0; k < edges.length; k++) {
            var i = Math.floor(edges[k] / n);
            var j = edges[k] % n;
            adj[i].push([j, this.nextCap(minCap, maxCap)]);
        }
        this.graph.nodes(n);
        this.graph.adjList(adj);
        this.graph.logInfo();
    }

    nextCap(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * Generates count numbers from between 1 and bound inclusive
     * @param {Int} bound 
     * @param {Int} count 
     * @returns 
     */
    uniqueIntsArr(bound, count) {
        var arr = [];
        while (arr.length < count) {
            var r = Math.floor(Math.random() * bound) + 1; //generate random number less than bound 
            if (arr.indexOf(r) === -1) arr.push(r); //if new number, add to array
        }
        return arr.sort((a, b) => a - b) //sort output
    }

    /**
     * Generates count numbers between min and max inclusive
     * @param {Int} min 
     * @param {Int} max 
     * @param {Int} count 
     * @returns 
     */
    uniqueIntsArrRange(min, max, count) {
        var arr = [];
        while (arr.length < count) {
            var r = min + Math.floor(Math.random() * (max - min + 1)); //generate random number less than bound 
            if (arr.indexOf(r) === -1) arr.push(r); //if new number, add to array
        }
        return arr.sort((a, b) => a - b) //sort output
    }

}