/*
The aim of this file is to provide functions that 
aid with displaying the graphs

Idea: 
 - minimize crossing Number
 - Have the area/aspect ratio appropriate (use a function that takes params width and length)
 - minimize total length of edges
 - consider angular resolution maaybe.... preferably not have very sharp or flat angles
 - maybe use a force based system (each node repels from other nodes and the boundaries, but attract to connected nodes)

*/

var wallRepelFactor = 1; //how "repelly" do we want the walls, can be changes later
var forceScaling = 100; //maybe not used since it'll depend on size of canvas, it's essentially G, the gravitational constant

/**
 * Find optimal positions for the nodes to be displayed to minimize edge
 * crossing, total edge length, etc. while also taking up a fair amount 
 * of space in the canvas it will be displayed on
 * @param {Int} n - number of nodes
 * @param {Number[][]} A - Adjacency List without capacities
 * @param {Int} w - Width of canvas
 * @param {Int} h - Height of canvas
 * 
 * @returns {Number[][]} - Array of (x, y)'s: result[k][x][y] means node k is at (x, y)
 */
function getPositions(n, A, w, h) {

}

/**
 * 
 * @param {Int} n 
 * @param {Number[][]} A - Adj list without capacities
 * @param {Number[][]} coords 
 * @param {Int} w 
 * @param {Int} h 
 * 
 * @returns {Number} A loss value that takes into account factors such as edge crossing and total edge lengths
 */
function loss(n, A, coords, w, h) {

}

/**
 * All nodes repel each other, connected nodes have some attraction, all nodes repel from the boundaries
 * @param {Int} n 
 * @param {Number[][]} A - Adj list without capacities
 * @param {Number[][]} coords 
 * @param {Int} w 
 * @param {Int} h 
 * 
 * @returns {Number[][]} The next set of coords using a physics model
 */
function getNextCoords(n, A, coords, w, h) {

}

/**
 * Generates the initial positions of the n nodes taking into account width and height of the canvas
 * @param {Int} n 
 * @param {Int} w 
 * @param {Int} h 
 * 
 * @returns {Number[][]} Array of coordinates
 */
function generateInitialCoords(n, w, h) {
    //Idea: simple generate them in a circle

}

/**
 * All nodes repel each other, connected nodes have some attraction, all nodes repel from the boundaries
 * @param {Int} k - the subject node
 * @param {Int} n
 * @param {Number[][]} A - Adj list without capacities
 * @param {Number[][]} coords 
 * @param {Int} w 
 * @param {Int} h 
 * 
 * @returns {Number[][]} The force on node k in x and y components
 */
function forceOnNode(k, n, A, coords, w, h) {
    //Idea: for node k, A[k] is an array of nodes adjacent to k.
    //Take the coords for all of those, and use that to calculate the force 
    //calculate mean force harmonically
    //treat the walls as equivalent to a node seperately

    var adj = A[k]; //the array of nodes adjacent to k
    var kPos = [new Number(coords[k][0]), new Number(coords[k][1])]; //pos of node k
    var adjPos = [];
    for (var i = 0; i < adj.length; i++) {
        var r = adj[i]; //node in question
        adjPos.push([new Number(coords[r][0]), new Number(coords[r][1])]); //new Number to prevent memory stuffs
    } //At this point adjPos is an array of [x, y] for nodes adjacent to k

    for (var i = 0; i < adjPos.length; i++) {
        adjPos[i] = [adjPos[i][0] - kPos[0], adjPos[i][1] - kPos[1]]
    } //At this point adjPos contains the relative positions of adjacent nodes to k

    var meanAdjPos = [0, 0];
    for (var i = 0; i < adjPos.length; i++) {
        meanAdjPos[0] += 1 / adjPos[i][0];
        meanAdjPos[1] += 1 / adjPos[i][1];
    }
    meanAdjPos[0] = forceScaling * meanAdjPos[0];
    meanAdjPos[1] = forceScaling * meanAdjPos[1];
    //Now meanAdjPos stores the mean position of the adjacent nodes to k

    ////////////////////////////////////////////////////////////////////////////////////

    var allPos = [];
    for (var r = 0; r < coords.length; r++) { //r is the node in question
        allPos.push([new Number(coords[r][0]), new Number(coords[r][1])]); //new Number to prevent memory stuffs
    } //At this point allPos is essentially coords

    for (var i = 0; i < allPos.length; i++) {
        allPos[i] = [allPos[i][0] - kPos[0], allPos[i][1] - kPos[1]]
    } //At this point allPos contains the relative positions of all nodes to k

    var meanAllPos = [0, 0];
    for (var i = 0; i < allPos.length; i++) {
        meanAllPos[0] += 1 / allPos[i][0];
        meanAllPos[1] += 1 / allPos[i][1];
    }
    meanAllPos[0] = forceScaling * meanAllPos[0];
    meanAllPos[1] = forceScaling * meanAllPos[1];
    //Now meanAdjPos stores the mean position of the adjacent nodes to k

    ////////////////////////////////////////////////////////////////////////////////////

    //We want k to move away from the meanAllPos but towards the meanAdjPos
    var posChange = [meanAdjPos[0] - meanAllPos[0], meanAdjPos[1] - meanAllPos[1]];

    //But we also want k to stay away from the walls
    posChange[0] = posChange[0] + ((1 / kPos[0]) - (1 / (w - kPos[0]))) * wallRepelFactor; //add repelling from bottom, subtract repelling from top
    posChange[1] = posChange[1] + ((1 / kPos[1]) - (1 / (h - kPos[1]))) * wallRepelFactor;

    var temp = []; //for memory and reference stuffs
    temp.push(new Number(posChange[0]));
    temp.push(new Number(posChange[1]));

    return temp;

}