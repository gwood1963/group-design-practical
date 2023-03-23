/*
The aim of this file is to provide a way to store graphs as an object while running the application
*/

import { Graph } from './Graph.js'

class MaxFlowSolver {
    graph;
    n;

    constructor(g, n) {
        this.graph = g;
        this.n = n;
    }

    set setGraph(g) {
        this.graph = g;
    }

    /*
    FORD-FULKERSON(G,s, t, c)
    Set f(e) = 0 for all e ∈ E
    Gf ← residual graph of G wrt f
    While there exists s-t path P in Gf:
        f ← AUGMENT(f , P)
        Update Gf
    */

    //s is assumed to me 1, t is assumed to be n, c is stored in capacities in A (in G)

    fordFulkerson() {
        //G is graph, s=1, t=n, 
    }

    /**
     * Finds a path from s to t (assumed to be 1 and n) in G, 
     * where we explore nodes in increasing order, and returns 
     * the path p: [s, x1, x2, ..., xk, t] or null if no path is found
     * Idea: use DFS to find t, return path if possible
     * @param {Graph} G - the graph
     */
    findPath(G) {
        var stack = [];
        var visited = new Array(n)[false];
        var A = G.adjList();
        var pi = new Array(n)[0]; //pi = predecessors
        var found = false;
        stack.push(0);
        //Invariant any node in the stack it is our first time visiting it
        while (!stack.isEmpty()) {
            node = stack.pop();
            visited[node] = true;
            console.log(`we visited ${node}`)
            if (node === n - 1) { //if we found t
                found = true;
                break;
            }
            for (var k = 0; k < A[node].length; k++) {
                var j = A[node][k][0];
                if (!visited[j]) {
                    stack.push(j);
                    pi[j] = node
                }
            }
        }
        //If we found t, then pi is [0, x1, ..., xk, t] and return pi
        //if not, return null
        return found ? pi : null;
    }


}