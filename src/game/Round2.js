/*
This file serves to represent the backend needed for round 2
*/

import { Graph } from './Graph.js';
import { ReadSeed } from './ReadSeed.js';
import { MaxFlowSolver } from './MaxFlowSolver.js';
import { Generate } from './Generate.js';
import { Display } from './Display.js';
import { Bank } from './Bank.js';

export class Round1 {
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
        this.theGraph.duplicate(this.seedReader.getGraph());
        this.theA = this.theGraph.getA();
        this.theANoCap = this.theGraph.getAWithoutCaps();
        this.theN = this.theGraph.dim();
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
     * @require numNodes > 2 (s, t, and other nodes)
     * @require numFromS, numIntoT <= n-2
     * @param {Int} numNodes 
     * @param {Int} numEdges - nodes excluding those from s or into t
     * @param {Int} numFromS 
     * @param {Int} numIntoT 
     * @param {Int} minCap 
     * @param {Int} maxCap 
     */
    genRandom(numNodes, numEdges, numFromS, numIntoT, minCap, maxCap) {
        this.generate.generate(numNodes, numEdges, numFromS, numIntoT, minCap, maxCap);
        var randomG = this.generate.export();
        this.theGraph = randomG;
        var randomA = randomG.getA();
        this.theA = randomA;
        var randomANoCap = randomG.getAWithoutCaps();
        this.theANoCap = randomANoCap;
        var n = randomA.length;
        this.theN = n;
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

    getGraph() {
        return this.theGraph;
    }

    getA() {
        return this.theA;
    }

    getANoCap() {
        return this.theANoCap;
    }

    getN() {
        return this.theN;
    }

    getCoords(w, h) {
        var coords = this.display.getPositionsRandom(this.theN, this.theANoCap, w, h);
        this.theCoords = coords;
        return this.theCoords;
    }

    readSeed(seed) {
        this.seedReader.readSeed(seed);
        this.loadGraph(this.seedReader.getGraph());
        this.theA = this.theGraph.getA();
        this.theANoCap = this.theGraph.getAWithoutCaps();
        this.theN = this.theGraph.dim();
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
        if (roads[i][j][0] == 1 || roads[j][i][0] == 1) {
            console.log("already contains road from " + i + " to " + j);
            return false;
        }
        if (this.bank.roadCost(w, l) > this.bank.moneyLeft()) {
            console.log("insufficient funds");
            return false;
        }
        const cost = this.bank.buildRoad(w, l);
        roads[i][j][0] = 1;
        roads[i][j][1] = cost;
        return true;
    }

    /**
     * Deletes a road and returns the money to the bank
     * @returns true if successful, false if road didn't exist
     */
    deleteRoad(i, j) {
        if (roads[i][j][0] == 0) {
            console.log("no road exists to delete at " + i + " to " + j);
            return false;
        }
        roads[i][j][0] = 0;
        this.bank.deleteRoad(roads[i][j][1]);
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