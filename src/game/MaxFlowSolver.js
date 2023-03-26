/*
The aim of this file is to provide a way to store graphs as an object while running the application
*/

import { Graph } from './Graph.js'

export class MaxFlowSolver {
    graph = new Graph;
    flowGraph = new Graph;
    residual = new Graph;
    n = 0;


    constructor(g, n) {}

    /**
     * 
     * @param {Graph} g 
     */
    setGraph(g) {
        //g.logInfo(); //debug
        //var a = g.adjList();
        var a = g.A;
        console.log(a); //debug
        this.graph = new Graph(g.dim(), a);
        this.graph.logInfo();
        this.flowGraph = new Graph(g.dim(), a);
        this.flowGraph.logInfo(); //debug
        this.flowGraph.setCapacitiesZero();
        this.n = g.dim();
    }

    /*
    FORD-FULKERSON(G,s, t, c)
    Set f(e) = 0 for all e ∈ E
    Gf ← residual graph of G wrt f
    While there exists s-t path P in Gf:
        f ← AUGMENT(f , P)
        Update Gf

    AUGMENT(f , P): construct flow f′ on G
    For each e ∈ E:
    ◦ if e ∈ P set f′(e) = f(e) + bP
    ◦ if rev(e) ∈ P set f′(e) = f(e) − bP
    ◦ otherwise, set f′(e) = f(e)

    */

    //s is assumed to me 1, t is assumed to be n, c is stored in capacities in A (in G)

    /**
     * Returns the final flow graph with max flow
     */
    fordFulkerson() {
        //G is graph, s=1, t=n
        //use calculateResidual to calculate residual graph
        //use findPath to find a possible path
        //use calculateBottleneck to calculate the bottleneck
        /**
        FORD-FULKERSON(G,s, t, c)
        Set f(e) = 0 for all e ∈ E
        Gf ← residual graph of G wrt f
        While there exists s-t path P in Gf:
            f ← AUGMENT(f , P)
            Update Gf
         */

        //not sure if temp is needed (memory stuffs), I'll use it for now and remove later if it's unnecessary. 
        var temp;
        temp = this.graph

        //console.log(temp.A);

        this.flowGraph.setParams(temp.dim(), temp.A);
        this.flowGraph.setCapacitiesZero();

        //console.log("flow graph: ");
        //console.log(this.flowGraph);


        temp = this.calculateResidual(this.flowGraph);
        //var res = new Graph(temp.dim(), temp.A);
        this.residual.setParams(temp.dim(), temp.A);

        //console.log("residual graph: ");
        //console.log(this.residual);

        var P = this.findPath(this.residual);
        while (P != null) {
            temp = this.augment(this.flowGraph, P);
            this.flowGraph = new Graph(temp.dim(), temp.A);
            P = this.findPath(this.residual);
        }
        return this.flowGraph;
    }

    /**
     * 
     * @param {Graph} G - graph of flows
     */
    flow(G) {
        var flows = network.getA();
        var flow = 0;
        for (var k = 0; k < flows[0].length; k++) {
            flow += flows[0][k][1];
        }
        return flow;
    }

    /**
     * @param { Graph } G - graph
     * @returns max flow of the graph stored in the object
     */
    maxFlow(G) {
        //G.logInfo(); //debug
        this.setGraph(G);
        var network = this.fordFulkerson();
        return this.flow(network);
    }

    /**
     * 
     * @param {Graph} G - flow graph
     * @param {[Int]} P - path
     */
    augment(G, P) {
        /**
        AUGMENT(f , P): construct flow f′ on G
        For each e ∈ E:
        ◦ if e ∈ P set f′(e) = f(e) + bP
        ◦ if rev(e) ∈ P set f′(e) = f(e) − bP
        ◦ otherwise, set f′(e) = f(e)
         */

        var cap = this.graph.adjMatrixWithCap();
        var flow = G.adjMatrixWithCap();
        //console.log("Flow for augmentation")
        //console.log(flow)
        var b = this.calculateBottleneck(G, P);

        //new adj matrix
        var adj = new Array(n).fill(new Array(n).fill(0));

        for (var k = 0; k < P.length - 1; k++) {
            var i = P[k];
            var j = P[k + 1];
            if (cap[i][j][0] === 1) { //if e ∈ P set f′(e) = f(e) + bP
                adj[i][j] = flow[i][j][1] + b;
            } else if (cap[j][i][0] === 1) { //if rev(e) ∈ P set f′(e) = f(e) − bP
                adj[i][j] = flow[i][j][1] - b;
            } else {
                adj[i][j] = flow[i][j];
            }
        }

        var A = this.adjMatrixToList(adj);
        return new Graph(this.n, A);
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
        var visited = new Array(this.n).fill(false);
        var A = G.getA();
        //var B = G.A;
        //for some reason B is an instance of Graph
        /* console.log("This is A: ")
        console.log(A);
        console.log("End A") */
        var pi = new Array(this.n).fill(0); //pi = predecessors
        var found = false;
        stack.push(0);
        //Invariant any node in the stack it is our first time visiting it
        while (stack.length > 0) {
            var node = stack.pop();
            visited[node] = true;
            console.log(`we visited ${node}`)
            if (node === this.n - 1) { //if we found t
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

        //If we found t, then path is [0, x1, ..., xk, t] and return path
        //if not, return null
        var path = [];
        var k = this.n - 1;
        path.push(k);
        while (k != 0) {
            k = path[k];
            path.push(k);
        }
        path = path.reverse();

        return found ? path : null;
    }

    /**
     * Calculate residual graph of G wrt graph
     * @param {Graph} G 
     */
    calculateResidual(G) {
        //if f(e) < c(e) then new edge weight is c-f
        //otherwise if f(e) = c(e) make that edge backwards
        //the parameter G stores the flows f, while graph stores c
        //returns the residual graph G_f

        var flow = G.adjMatrixWithCap();
        var cap = this.graph.adjMatrixWithCap();
        var aug = new Array(this.n).fill(new Array(this.n).fill(0));

        /* console.log("residual flow and caps")
        console.log(G)
        console.log(this.graph) */

        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < this.n; j++) {
                /* console.log("flow and cap values")
                console.log(flow[i][j])
                console.log(cap[i][j]) */
                if (cap[i][j][0] === 0) {
                    continue;
                }
                if (flow[i][j][1] < cap[i][j][1]) {
                    aug[i][j] = cap[i][j][1] - flow[i][j][1];
                } else if (flow[i][j][1] === cap[i][j][1]) {
                    aug[j][i] = cap[i][j][1];
                } else {
                    console.log("an error has occured, the flow is larger than the capacity at (" + i + ", " + j + ")");
                }
            }
        }

        //convert new adjacency matrix to adj list
        var A = this.adjMatrixToList(aug);
        console.log(A);
        return new Graph(this.n, A);
    }

    /**
     * 
     * @param {Array} M 
     * @returns 
     */
    adjMatrixToList(M) {
        var n = M.length;
        var adj = new Array(n).fill([]);
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (M[i][j] > 0) {
                    adj[i].push([j, M[i][j]]);
                }
            }
        }

        //var res = new Graph(n, adj);
        return adj;
    }

    /**
     * Calculates the bottleneck in graph G along path P
     * Every edge along the path exists
     * @param {Graph} G - Graph
     * @param {[Int]} p - Path
     */
    calculateBottleneck(G, p) {
        var cap = G.adjMatrixWithCap();
        var b = 1 >> 30;
        for (var k = 0; k < p.length - 1; k++) {
            var i = p[k];
            var j = p[k + 1];
            b = Math.min(b, cap[i][j][1]);
        }
        return b;
    }


}