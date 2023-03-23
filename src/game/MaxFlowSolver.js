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
        //Note: G is directed, and has edge weights (which don't matter much in this case)

    }

    /*

    DFS(V, E)
    Input: Graph G = (V, E), directed or undirected
    Output: Timestamps d[v] and f[v], and predecessor π[v] for each v ∈ V
    1 for u ∈ V
    2   colour[u] = white π[u] = NIL
    3 time = 0
    4 for u ∈ V
    5   if colour[u] = white
    6       DFS-Visit(u)

    DFS-Visit(u)
    1 time = time + 1 // vertex u has been discovered
    2 d[u] = time // record discovery time
    3 colour[u] = grey // mark vertex u visited
    4 for v ∈ Adj[u] // explore from v and come back once finished
    5   if colour[v] = white
    6       π[v] = u
    7       DFS-Visit(v)
    8 time = time + 1 // vertex u has been finished
    9 f[u] = time // record finishing time
    10 colour[u] = black // mark vertex u finished

    for path from s to t, take predecessors of t until we reach s

    */


}