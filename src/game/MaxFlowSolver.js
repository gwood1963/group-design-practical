/*
The aim of this file is to provide a way to calculate the max flow of a graph
*/

import { Graph } from './Graph.js'

export class MaxFlowSolver {
    graph = new Graph;
    flowGraph = new Graph;
    residual = new Graph;
    n = 0;
    iter = 0;
    maxiters = 100;


    constructor(g, n) {}

    /**
     * 
     * @param {Graph} g 
     */
    setGraph(g) {
        this.graph.duplicate(g);
        this.flowGraph.duplicate(g);
        this.flowGraph.setCapacitiesZero();
        this.n = new Number(g.dim());
    }

    /**
     * Returns the final flow graph with max flow
     */
    fordFulkerson() {
        //G is graph, s=1, t=n
        //use calculateResidual to calculate residual graph
        //use findPath to find a possible path
        //use calculateBottleneck to calculate the bottleneck
        /*
        FORD-FULKERSON(G,s, t, c)
        Set f(e) = 0 for all e ∈ E
        Gf ← residual graph of G wrt f
        While there exists s-t path P in Gf:
            f ← AUGMENT(f , P)
            Update Gf
         */
        this.flowGraph.duplicate(this.graph);
        this.flowGraph.setCapacitiesZero();
        this.residual.duplicate(this.calculateResidual(this.flowGraph));
        var P = this.findPath(this.residual);
        while (P != null && this.iter < this.maxiters) {
            var temp = this.augment(this.flowGraph, this.residual, P);
            this.flowGraph.duplicate(temp);
            this.residual.duplicate(this.calculateResidual(this.flowGraph));
            P = this.findPath(this.residual);
            this.iter++;
        }

        return this.flowGraph;
    }

    /**
     * 
     * @param {Graph} G - graph of flows
     */
    flow(G) {
        var flows = G.getA();
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
        this.setGraph(G);
        var network = this.fordFulkerson();
        return this.flow(network);
    }

    /**
     * 
     * @param {Graph} G - flow graph
     * @param {Graph} Res - residual graph
     * @param {Number[]} P - path
     */
    augment(G, Res, P) {
        /**
        AUGMENT(f , P): construct flow f′ on G
        For each e ∈ E:
        ◦ if e ∈ P set f′(e) = f(e) + bP
        ◦ if rev(e) ∈ P set f′(e) = f(e) − bP
        ◦ otherwise, set f′(e) = f(e)
         */
        var cap = this.graph.adjMatrixWithCap();
        var flow = G.adjMatrixWithCap();
        var b = this.calculateBottleneck(Res, P);

        //new adj matrix
        var adj = [];
        for (var i = 0; i < this.n; i++) {
            var temp = [];
            for (var j = 0; j < this.n; j++) {
                temp.push(flow[i][j][1]);
            }
            adj.push(temp);
        }

        for (var k = 0; k < new Number(P.length - 1); k++) {
            var i = P[k];
            var j = P[k + 1];
            if (cap[i][j][0] == 1) { //if e ∈ P set f′(e) = f(e) + bP
                adj[i][j] = flow[i][j][1] + b;
            } else if (cap[j][i][0] == 1) { //if rev(e) ∈ P set f′(e) = f(e) − bP
                adj[j][i] = flow[j][i][1] - b;
            } else {
                adj[i][j] = flow[i][j];
            }
        }

        var A = this.adjMatrixToList(adj);
        var result = new Graph(this.n, A);
        return result;
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
        var visited = [];
        for (var a = 0; a < this.n; a++) {
            visited.push(false);
        }
        var A = G.getA();
        var t = this.n - 1;
        //pi = predecessors
        var pi = [];
        for (var a = 0; a < this.n; a++) {
            pi.push(0);
        }
        var found = false;
        stack.push(0);
        //Invariant any node in the stack it is our first time visiting it
        while (stack.length > 0 && !found) {

            var node = stack.pop();
            if (visited[node]) {
                continue;
            }
            visited[node] = true;
            if (node == t) { //if we found t
                found = true;
                break;
            }
            for (var k = A[node].length - 1; k >= 0; k--) {
                var j = A[node][k][0];
                if (!visited[j]) {
                    stack.push(j);
                    pi[j] = node;
                }
            }
        }

        //If we found t, then path is [0, x1, ..., xk, t] and return path
        //if not, return null
        var path = [];
        var k = new Number(this.n - 1);
        path.push(k);
        while (!(k == 0)) {
            k = pi[k];
            path.push(k);
        }
        path = path.reverse();

        var ret = found ? path : null;

        return ret;
    }

    /**
     * Calculate residual graph of G wrt graph
     * @param {Graph} G - flow graph
     */
    calculateResidual(G) {
        //if f(e) < c(e) then new edge weight is c-f
        //otherwise if f(e) = c(e) make that edge backwards
        //the parameter G stores the flows f, while graph stores c
        //returns the residual graph G_f

        var flow = G.adjMatrixWithCap();
        var cap = this.graph.adjMatrixWithCap();
        var aug = [];
        for (var i = 0; i < this.n; i++) {
            var temp = [];
            for (var j = 0; j < this.n; j++) {
                temp.push(0);
            }
            aug.push(temp);
        }

        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < this.n; j++) {
                if (cap[i][j][0] == 0) {
                    continue;
                }
                if (flow[i][j][1] < cap[i][j][1]) {
                    aug[i][j] = cap[i][j][1] - flow[i][j][1];
                } else if (flow[i][j][1] > cap[i][j][1]) {
                    console.log("an error has occured, the flow is larger than the capacity at (" + i + ", " + j + ")");
                    console.log("flow val: " + flow[i][j][1])
                    console.log("cap val: " + cap[i][j][1])
                } else {
                    aug[j][i] = cap[i][j][1];
                }
            }
        }

        //convert new adjacency matrix to adj list
        var A = this.adjMatrixToList(aug);
        return new Graph(this.n, A);
    }

    /**
     * 
     * @param {Array} M 
     * @returns 
     */
    adjMatrixToList(M) {
        var n = M.length;
        var adj = [];
        for (var a = 0; a < this.n; a++) {
            adj.push([]);
        }
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (M[i][j] > 0) {
                    adj[i].push([j, M[i][j]]);
                }
            }
        }
        return adj;
    }

    /**
     * Calculates the bottleneck in graph G along path P
     * Every edge along the path exists
     * @param {Graph} G - Flow Graph
     * @param {Number[]} p - Path
     */
    calculateBottleneck(G, p) {
        var flow = G.adjMatrixWithCap();
        var b = 1 << 30;
        for (var k = 0; k < p.length - 1; k++) {
            var i = p[k];
            var j = p[k + 1];
            b = Math.min(b, flow[i][j][1]);
        }
        return b;
    }


}