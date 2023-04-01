/*
The aim of this file is to provide functions that 
aid with displaying the graphs
*/

/**
 * Find optimal positions for the nodes to be displayed to minimize edge
 * crossing, total edge length, etc. while also taking up a fair amount 
 * of space in the canvas it will be displayed on
 * @param {Int} n - number of nodes
 * @param {Number[][]} A - Adjacency List without capacities
 * @param {Int} w - Width of canvas
 * @param {Int} h - Height of canvas
 * 
 * @returns {Number[][][]} - Array of (x, y)'s: result[k][x][y] means node k is at (x, y)
 */
function getPositions(n, A, w, h) {

}

/**
 * 
 * @param {Int} n 
 * @param {Number[][]} A - Adj list without capacities
 * @param {Number[][][]} coords 
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
 * @param {Number[][][]} coords 
 * @param {Int} w 
 * @param {Int} h 
 * 
 * @returns {Number[][][]} The next set of coords using a physics model
 */
function getNextCoords(n, A, coords, w, h) {

}

/**
 * Generates the initial positions of the n nodes taking into account width and height of the canvas
 * @param {Int} n 
 * @param {Int} w 
 * @param {Int} h 
 * 
 * @returns {Number[][][]} Array of coordinates
 */
function generateInitialCoords(n, w, h) {
    //Idea: simple generate them in a circle

}