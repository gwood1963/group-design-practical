/*
This file serves to represent the backend needed for round 2
*/

import { Graph } from './Graph.js';
import { ReadSeed } from './ReadSeed.js';
import { MaxFlowSolver } from './MaxFlowSolver.js';
import { Generate } from './Generate.js';
import { Display } from './Display.js';
import { Bank } from './Bank.js';

export class Round2 {
    theGraph = new Graph;
    theA;
    theANoCap;
    theN;
    theCoords;
    seedReader = new ReadSeed(2);
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
    }

    makeSeed() {
        return this.seedReader.makeSeed(this.theGraph);
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
        this.theN = this.theGraph.dim();
        return this.theN;
    }

    getCoords(w, h) {
        return this.theCoords;
    }

    readSeed(seed) {
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
    }

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

    getScoreFromArr(flowsArr, originalGraph) {
        return this.getScore(this.convertFlowsArrayToAdjList(flowsArr), originalGraph);
    }

    getScoreFromArr(flowsArr) {
        return this.getScore(this.convertFlowsArrayToAdjList(flowsArr));
    }

    /**
     * Score calculation, currently is very simple: 
     * first check that all edges that are not s or t havd flow in = flow out
     * If not, let that be stored in variable unbalance
     * check flow value, store that in variable submittedFlow
     * 
     * Score = max((submittedFlow - unbalance)/maxFlow, 0)
     * (can be tweaked later)
     * @param {Number[][][]} flows - flows in the same format as the adj list
     * @param {Graph} originalGraph - the original graph with the capacities
     */
    getScore(flows, originalGraph) {
        var checkBalance = [];
        for (var i = 0; i < flows.length; i++) {
            checkBalance.push(0);
        }
        for (var i = 0; i < flows.length - 1; i++) {
            for (var k = 0; k < flows[i].length; k++) {
                var j = flows[i][k][0];
                checkBalance[i] -= flows[i][k][1];
                checkBalance[j] += flows[i][k][1];
            }
        }
        var unbalance = 0;
        for (var i = 1; i < checkBalance.length - 1; i++) {
            unbalance += Math.abs(checkBalance[i]);
        }
        //At this point unbalance is equal to the absolute sum of the flow in - flow out of each node that is not s or t

        var flowGraph = new Graph;
        flowGraph.setParams(flows.length, flows);

        const submittedFlow = this.maxFlowEngine.maxFlow(flowGraph);
        const maxFlow = this.maxFlowEngine.maxFlow(originalGraph);

        const score = Math.max(0, (submittedFlow - unbalance) / maxFlow);

        return score;
    }

    /**
     * Score calculation, currently is very simple: 
     * first check that all edges that are not s or t havd flow in = flow out
     * If not, let that be stored in variable unbalance
     * check flow value, store that in variable submittedFlow
     * 
     * Score = max((submittedFlow - unbalance)/maxFlow, 0)
     * (can be tweaked later)
     * @param {Number[][][]} flows - flows in the same format as the adj list
     */
    getScore(flows) { //Note: exactly the same as the alst one, just here for overloading purposes
        var checkBalance = [];
        for (var i = 0; i < flows.length; i++) {
            checkBalance.push(0);
        }
        for (var i = 0; i < flows.length - 1; i++) {
            for (var k = 0; k < flows[i].length; k++) {
                var j = flows[i][k][0];
                checkBalance[i] -= flows[i][k][1];
                checkBalance[j] += flows[i][k][1];
            }
        }
        var unbalance = 0;
        for (var i = 1; i < checkBalance.length - 1; i++) {
            unbalance += Math.abs(checkBalance[i]);
        }
        //At this point unbalance is equal to the absolute sum of the flow in - flow out of each node that is not s or t

        var flowGraph = new Graph;
        flowGraph.setParams(flows.length, flows);

        const submittedFlow = this.maxFlowEngine.maxFlow(flowGraph);
        const maxFlow = this.maxFlowEngine.maxFlow(this.theGraph);
        console.log(checkBalance)

        const score = Math.max(0, (submittedFlow - unbalance) / maxFlow);

        return score;
    }

    getMaxFlow() {
        this.maxFlowEngine.setGraph(this.theGraph);
        return this.maxFlowEngine.maxFlow();
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