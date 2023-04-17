/*
The purpose of this file is to read in a seed and output a graph

Currently not in use
*/

import { Graph } from './Graph.js'
import { Bank } from './Bank.js'

export class ReadSeed {
    graph;
    n = 0;
    round;
    coords;
    bank;

    /**
     * 
     * @param {Number} round - 1, 2, or 3 (Round number)
     */
    constructor(round) {
        this.round = round;
    }

    readSeed(s) {
        if (this.round == 1) {
            var seed = s; // + '%' //assuming seed is of format n%i,j,c%...%i,j,c% with ending '%'
            //var len = seed.length;
            var n;
            var edges = [];
            var capacities = [];
            var recordedN = false; //sees if we are done recording n or not
            //edges[i] <-> capacities[i]

            var i = 0;
            var j = 0;

            while (j < seed.length) {
                if (recordedN) {
                    if (seed[j] != '%') {} else { //j is at the next % sign
                        //seed.substring(i+1, j) is of form i,j,cap. Note: right now seed[i] is '%'
                        var info = seed.substring(i + 1, j);
                        var firstComma = seed.indexOf(','); //first occurrence of ','
                        var secondComma = seed.indexOf(',', firstComma); //second occurrence of ','
                        var a = parseInt(info.substring(0, firstComma));
                        var b = parseInt(info.substring(firstComma - 1, secondComma));
                        var c = parseInt(info.substring(secondComma + 1));
                        /* console.log(a);
                        console.log(b);
                        console.log(c); */

                        edges.push([a, b]);
                        capacities.push(c);
                        i = j;
                    }
                } else { //!recorded N
                    if (seed[j] != '%') {} else { //j is at the first % sign
                        n = parseInt(seed.substring(0, j));
                        this.n = n;
                        i = j;
                        recordedN = true;
                    }
                }
                j++;
            }

            var A = this.adjListFromArr(n, edges, capacities);

            this.graph = new Graph(n, A);
        } else if (this.round == 2) {
            var seed = s; //n%x0,y0%x1,y1%...%xn-1,yn-1%TotalMoney%
            var recordedN = false;
            var coords = [];
            var n;
            var bankParams = [];
            var i = 0;
            var j = 0;

            while (j < seed.length) {
                if (recordedN) {
                    if (bankParams.length >= 5) {
                        //console.log("done");
                        if (seed[j] != '%') {} else { //j is at the next % sign
                            //seed.substring(i+1, j) is of form i,j,cap. Note: right now seed[i] is '%'
                            var info = seed.substring(i + 1, j);
                            //console.log(info);
                            var firstComma = info.indexOf(','); //first occurrence of ','
                            //console.log(firstComma);
                            var a = parseInt(info.substring(0, firstComma));
                            var b = parseInt(info.substring(firstComma + 1));
                            //console.log(info.substring(firstComma + 1));
                            /* console.log(a);
                            console.log(b);
                            console.log(c); */

                            coords.push([a, b]);
                            i = j;
                        }
                    } else {
                        if (seed[j] != '%') {} else { //j is at the next % sign
                            //seed.substring(i+1, j) is of form i,j,cap. Note: right now seed[i] is '%'
                            var n = parseFloat(seed.substring(i + 1, j));
                            //console.log(seed.substring(i, j));
                            /* console.log(a);
                            console.log(b);
                            console.log(c); */

                            bankParams.push(n);
                            i = j;
                        }
                    }
                } else {
                    if (seed[j] != '%') {} else {
                        n = parseInt(seed.substring(0, j));
                        //console.log(n);
                        this.n = n;
                        i = j;
                        recordedN = true;
                    }
                }
                j++;
            }
            this.coords = coords;
            var B = [];
            for (var i = 0; i < this.n; i++) {
                B.push([]);
            }
            //console.log("generating graph");
            this.graph = new Graph(this.n, B);
            /* console.log(this.graph);
            console.log(this.coords); */
            //console.log(bankParams);
            this.bank = new Bank(bankParams[0]);
            //console.log(this.bank);
            this.bank.setParams(bankParams[1], bankParams[2], bankParams[3], bankParams[4]);
        }
    }

    getGraph() {
        return this.graph;
    }

    getBank() {
        //console.log(this.bank);
        return this.bank;
    }

    getCoords() {
        return this.coords;
    }

    adjListFromArr(n, edges, capacities) {
        //Assuming edges does not have any repeats and capacities correspond to edges
        var e = edges.length;
        //assert(n === capacities.length);

        var adj = [];
        for (i = 0; i < n; i++) {
            adj.push([]);
        }

        for (var k = 0; k < e; k++) {
            var i = edges[k][0];
            var j = edges[k][1];
            var c = capacities[k];

            adj[i].push([j, c]); //edge from i to j
            //adj[j].push([i, c]); //edge from j to i, only needed if the graph is undirected
        }

        for (var k = 0; k < n; k++) {
            adj[k].sort(([a, b], [c, d]) => a - c); //sort array, keep consistent ordering of nodes
        }

        return adj;
    }

    /**
     * 
     * @param {Graph} G - Graph to make a seed out of
     */
    makeSeed(G) {
        if (this.round == 1) {
            var seed = "";
            const n = G.dim();
            const A = G.getA();

            seed = seed + n + "%";

            for (var i = 0; i < A.length; i++) {
                for (var k = 0; k < A[i].length; k++) {
                    const j = A[i][k][0];
                    const cap = A[i][k][1];
                    seed = seed + i + ',' + j + ',' + cap + '%';
                }
            }
            return seed;
        }
        return null;
    }

    /**
     * Makes seed for round 2
     * @param {Number} n 
     * @param {Number[]} b - bank info
     * @param {Number[][]} c - coords
     */
    makeSeed2(n, b, c) {
        if (this.round != 2) return null;
        var seed = "";
        seed = seed + n + "%" + b[0] + "%" + b[1] + "%" + b[2] + "%" + b[3] + "%" + b[4] + "%";
        for (var i = 0; i < c.length; i++) {
            seed = seed + c[i][0] + ',' + c[i][1] + '%';
        }
        return seed;
    }

}