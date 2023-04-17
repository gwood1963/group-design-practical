/*
This file serves to represent the backend needed for round 3
*/

/*
Idea: circultion.
We have n nodes, each with demands from say -5 to 5
build roads, same as roudn 2

try to satisfy as much demand as possible

score calculation: add nodes s and t with 
s going into each neg demand node with cap -demand, 
t going from each pos demand node with cap demand.

calculate max flow of above

return that as score
*/

import { Graph } from './Graph.js';
import { ReadSeed } from './ReadSeed.js';
import { MaxFlowSolver } from './MaxFlowSolver.js';
import { Generate } from './Generate.js';
import { Display } from './Display.js';
import { Bank } from './Bank.js';

export class Round3 {
    theGraph = new Graph;
    theA;
    theANoCap;
    theN;
    theCoords;
    theDemands;
    seedReader = new ReadSeed(3);
    maxFlowEngine = new MaxFlowSolver;
    generate = new Generate;
    display = new Display; //likely not needed in the end
    bank = new Bank;

    roads; //matrix of edges/roads (0 or 1, cost)

    readSeed(seed) {
        this.seedReader.readSeed(seed);
        this.theCoords = this.seedReader.getCoords();
        this.theGraph.duplicate(this.seedReader.getGraph());
        this.updateInfo();
        const n = this.theN;
        var r = [];
        for (var i = 0; i < n; i++) {
            var temp = [];
            for (var j = 0; j < n; j++) {
                temp.push([0, 0]);
            }
            r.push(temp);
        }
        this.roads = r;
        this.setBank(this.seedReader.getBank());
        this.setDemands(this.seedReader.getDemands());
    }

    makeSeed() {
        const n = this.getN();
        const bankInfo = this.bank.getParams();
        const demands = this.getDemands();
        const coords = this.getCoords();
        /* console.log(n);
        console.log(bankInfo);
        console.log(demands);
        console.log(coords); */
        return this.seedReader.makeSeed3(n, bankInfo, demands, coords);
    }

    /**
     * Set parameters
     * @param {Number} rlc - Road Length Cost
     * @param {Number} rwc - Road Width Cost
     * @param {Number} rlu - Road Length Unit
     * @param {Number} rwu - Road Width Unit
     */
    setBankParams(rlc, rwc, rlu, rwu) {
        this.bank.setParams(rlc, rwc, rlu, rwu);
    }

    setBank(b) {
        //console.log(b);
        this.bank = b;
    }

    getBankParams() {
        return this.bank.getParams();
    }

    setDemands(d) {
        if (d.length != this.getN())
            console.log("error in demands length");
        this.theDemands = d;
    }

    getDemands() {
        return this.theDemands;
    }

    genRandom(n, w, h) {
        var B = [];
        for (var i = 0; i < n; i++) {
            B.push([]);
        }
        this.theGraph = new Graph(n, B);
        this.theCoords = this.display.genRandomEmpty(n, w, h);
        this.updateInfo();
        this.bank.setTotalMoney(5 * n);
        var r = [];
        for (var i = 0; i < n; i++) {
            var temp = [];
            for (var j = 0; j < n; j++) {
                temp.push([0, 0]);
            }
            r.push(temp);
        }
        this.roads = r;
    }

    updateInfo() {
        this.theA = this.theGraph.getA();
        this.theANoCap = this.theGraph.getAWithoutCaps();
        this.theN = this.theGraph.dim();
    }

    getGraph() {
        return this.theGraph;
    }

    getA() {
        this.theA = this.theGraph.getA();
        return this.theA;
    }

    getANoCap() {
        this.theANoCap = this.theGraph.getAWithoutCaps();
        return this.theANoCap;
    }

    getN() {
        //console.log(this.theGraph);
        this.theN = this.theGraph.dim();
        return this.theN;
    }

    getCoords(w, h) {
        return this.theCoords;
    }

    /* readSeed(seed) {
        //console.log(seed);
        this.seedReader.readSeed(seed);
        this.theGraph = this.seedReader.getGraph();
        //console.log(this.theGraph);
        this.updateInfo();
        this.theCoords = this.seedReader.getCoords();
        const n = this.theN;
        var r = [];
        for (var i = 0; i < n; i++) {
            var temp = [];
            for (var j = 0; j < n; j++) {
                temp.push([0, 0]);
            }
            r.push(temp);
        }
        this.roads = r;
    } */

    loadGraph(graph) {
        this.theGraph = graph;
        const n = graph.dim();
        var r = [];
        for (var i = 0; i < n; i++) {
            var temp = [];
            for (var j = 0; j < n; j++) {
                temp.push([0, 0]);
            }
            r.push(temp);
        }
        this.roads = r;
    }

    /**
     * We assume here that the enumeration of edges is in dictionary order
     * @param {Number[]} flowArr - Array of flows
     */
    convertFlowsArrayToAdjList(flowArr) {
        //Check cardinality
        var edgeCount = 0;
        for (var i = 0; i < this.theANoCap.length; i++) {
            edgeCount += this.theANoCap[i].length;
        }
        if (edgeCount != flowArr.length) console.log("the parameter does not have |E| entries");

        var flows = [];
        var index = 0;
        for (var i = 0; i < this.theN; i++) {
            var temp = [];
            for (var k = 0; k < this.theA[i].length; k++) {
                var j = this.theA[i][k][0];
                temp.push([j, flowArr[index]]);
                index++;
            }
            flows.push(temp);
        }
        if (edgeCount != index) console.log("error occured in conversion");

        return flows;

    }

    /**
     * Score calculation, currently is very simple: 
     * 
     * Score = submitted flow / best submitted flow
     * (can be tweaked later)
     * 
     * Note: with each submission, we have to update everyone's score for 
     * that particular puzzle
     * @param {Number} currrentRecord - what the best submitted flow is
     */
    getScore(currrentRecord) {
        const n = this.getN();
        const A = this.getA();
        var B = [];
        var tempS = [];
        for (var i = 0; i < this.theDemands.length; i++) {
            if (this.theDemands[i] < 0) { //add edge from s
                tempS.push([i + 1, this.theDemands[i] * (-1)]);
            }
        }
        B.push(tempS);

        for (var i = 0; i < A.length; i++) {
            B.push(A[i]);
        }

        var tempT = [];
        for (var i = 0; i < this.theDemands.length; i++) {
            if (this.theDemands[i] > 0) { //add edge from s
                tempT.push([i + 1, this.theDemands[i]]);
            }
        }
        B.push(tempT);

        const scoreGraph = new Graph(n + 2, B);
        const flow = this.maxFlowEngine.maxFlow(scoreGraph);
        if (Math.max(flow, currrentRecord) == 0)
            return 0; //don't divide by 0
        return flow / Math.max(flow, currrentRecord);
    }

    /**
     * Raw score calculation, currently is very simple: 
     * 
     * Score = submitted flow
     * (can be tweaked later)
     * 
     */
    getRawScore() {
        const n = this.getN();
        const A = this.getA();
        var B = [];
        var tempS = [];
        for (var i = 0; i < this.theDemands.length; i++) {
            if (this.theDemands[i] < 0) { //add edge from s
                tempS.push([i + 1, this.theDemands[i] * (-1)]);
            }
        }
        B.push(tempS);

        for (var i = 0; i < A.length; i++) {
            var temp = [];
            for (var k = 0; k < A[i].length; k++) {
                const j = A[i][k][0];
                const c = A[i][k][1];
                temp.push([j + 1, c]);
            }
            B.push(temp);
        }

        //var tempT = [];
        for (var i = 0; i < this.theDemands.length; i++) {
            if (this.theDemands[i] > 0) { //add edge from s
                B[i + 1].push([n + 1, this.theDemands[i]]);
            }
        }
        B.push([]);

        for (var i = 0; i < B.length; i++) {
            B[i].sort(([a, b], [c, d]) => a - c);
        }


        const scoreGraph = new Graph(n + 2, B);
        console.log(scoreGraph);
        const flow = this.maxFlowEngine.maxFlow(scoreGraph);
        return flow;
    }

    getMaxFlow() {
        //this.maxFlowEngine.setGraph(this.theGraph);
        return this.maxFlowEngine.maxFlow(this.theGraph);
    }

    ////////////////////////////////////////////////////////////////

    /**
     * 
     * @returns true if road is build and recorded, false if there is an error
     */
    addRoad(i, j, w, l) {
        if (this.roads[i][j][0] == 1 || this.roads[j][i][0] == 1) {
            console.log("already contains road from " + i + " to " + j);
            return false;
        }
        if (this.bank.roadCost(w, l) > this.bank.moneyLeft()) {
            console.log("insufficient funds");
            return false;
        }
        const cost = this.bank.buildRoad(w, l);
        const cap = w;
        this.roads[i][j][0] = 1;
        this.roads[i][j][1] = cost;
        this.theGraph.addEdge(i, j, cap);
        return true;
    }

    /**
     * Deletes a road and returns the money to the bank
     * @returns true if successful, false if road didn't exist
     */
    deleteRoad(i, j) {
        if (this.roads[i][j][0] == 0) {
            console.log("no road exists to delete at " + i + " to " + j);
            return false;
        }
        this.roads[i][j][0] = 0;
        this.bank.deleteRoad(this.roads[i][j][1]);
        this.theGraph.deleteEdge(i, j);
        return true;
    }

    /**
     * 
     * @returns money remaining
     */
    moneyRemaining() {
        return this.bank.moneyLeft();
    }
}