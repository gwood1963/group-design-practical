/*
The purpose of this file is to read in a seed and output a graph
*/

import { Graph } from './Graph.js'

export class ReadSeed {
    graph;
    n = 0;

    constructor() {}

    readSeed(s) {
        var seed = s + '%' //assuming seed is of format n%i,j,c%...%i,j,c with no ending '%'
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
                    var secondComma = seed.indexOf(',', firstComma + 1); //second occurrence of ','
                    var a = parseInt(info.substring(0, firstComma));
                    var b = parseInt(info.substring(firstComma + 1, secondComma));
                    var c = parseInt(info.substring(secondComma + 1));

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

        var A = adjListFromArr(n, edges, capacities);

        this.graph = new Graph(n, A);
    }

    getGraph() {
        return this.graph;
    }

    static adjListFromArr(n, edges, capacities) {
        //Assuming edges does not have any repeats and capacities correspond to edges
        var e = edges.length;
        assert(n === capacities.length);

        var adj = new Array(n)[[]];

        for (var k = 0; k < e; k++) {
            var i = edges[k][0];
            var j = edges[k][1];
            var c = capacities[k];

            adj[i].push([j, c]); //edge from i to j
            //adj[j].push([i, c]); //edge from j to i, only needed if the graph is undirected
        }

        for (var k = 0; k < n; k++) {
            adj[k].sort(([a, b], [c, d]) => c - a); //sort array, keep consistent ordering of nodes
        }

        return adj;
    }


}