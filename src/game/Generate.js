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

    export () {
        var temp = new Graph;
        temp.duplicate(this.graph);
        return temp;
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
        var n = numNodes;
        var adj = []; //row i stores [j, cap]
        for (var i = 0; i < n; i++) {
            adj.push([]);
        }
        var outS = this.uniqueIntsArr(numNodes - 2, numFromS); //edges out of s: random nodes indices 1 to n-1
        var inT = this.uniqueIntsArr(numNodes - 2, numIntoT); //edges into t: random nodes indices 1 to n-1

        /* console.log("outS and inT: ")
        console.log(outS)
        console.log(inT) */

        for (var k = 0; k < outS.length; k++) {
            var j = outS[k];
            adj[0].push([j, this.nextCap(minCap, maxCap)]);
        }

        //Here we generate the edges between nodes that are not s or t
        var n = numNodes
        var edges = this.uniqueIntsArrRange(0, n * n - 4 * n + 3, numEdges)

        //We need to convert values in edges to adj, by using k => (k/n, k%n)
        for (var k = 0; k < edges.length; k++) {
            var i = Math.floor(edges[k] / (n - 2)) + 1;
            var j = edges[k] % (n - 2) + 1;
            adj[i].push([j, this.nextCap(minCap, maxCap)]);
        }

        for (var k = 0; k < inT.length; k++) {
            var i = inT[k];
            adj[i].push([n - 1, this.nextCap(minCap, maxCap)]);
        }

        this.graph.setParams(n, adj);
        //this.graph.adjList(adj);
        //this.graph.logInfo();
        if (!this.isDirected(adj) || !this.isConnected(adj)) {
            this.generate(numNodes, numEdges, numFromS, numIntoT, minCap, maxCap);
        }
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

    /**
     * checks uniqueness of edges, e.g. i -> j means there doesnt exist j -> i
     * @param {Number[][][]} A 
     */
    isDirected(A) {
        //convert A to matrix
        //use simple n^2 checking algorithm
        var n = A.length;
        var m = [];
        for (var i = 0; i < n; i++) {
            var temp = [];
            for (var j = 0; j < n; j++) {
                temp.push(0);
            }
            m.push(temp);
        }

        //console.log("matrix")
        //console.log(m);
        //var m = new Array(this.n)[new Array(this.n)[new Array(2)[0]]]; //[0, 0] if no edge, [1, cap] if has edge
        //console.log(A);
        for (var i = 0; i < n; i++) {
            //console.log(A[i].length)
            for (var j = 0; j < A[i].length; j++) {
                //console.log(i + " " + this.A[i][j][0] + " " + this.A[i][j][1]);
                m[i][A[i][j][0]] = 1; //edge from i to j (A[i][j][0])
            }
        }
        //console.log("end operations")
        //return m;
        //m is A in matrix form, and without calacities
        console.log("m: ")
        console.log(m)

        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (m[i][j] + m[j][i] > 1) { //if exists edge in both i -> j and j -> i
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Checks conectedness, simple dfs or bfs to make a tree suffices
     * @param {Number[][][]} A - Adjacency List
     */
    isConnected(A) {
        //Use dfs
        //use simple |E| checking algorithm
        var n = A.length;
        var stack = [];
        var visited = [];
        var numUnvisited = n;
        for (var a = 0; a < n; a++) {
            visited.push(false);
        }

        stack.push(0);

        while (stack.length > 0 && numUnvisited > 0) {
            /* console.log("stack: ")
            console.log(stack);
            console.log(numUnvisited) */
            var node = stack.pop();
            if (visited[node]) {
                continue;
            }
            visited[node] = true;
            numUnvisited--;
            /* if (numUnvisited == 0) {
                break;
            } */

            for (var k = A[node].length - 1; k >= 0; k--) {
                var j = A[node][k][0];
                if (!visited[j]) {
                    stack.push(j);
                }
            }
        }

        return numUnvisited == 0;

    }

}