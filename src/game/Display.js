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
export class Display {
    wallRepelFactor = 1; //how "repelly" do we want the walls, can be changes later
    forceScaling = 1; //maybe not used since it'll depend on size of canvas, it's essentially G, the gravitational constant
    deltaT = 0.5; //Change in "time" between iterations, needed for calculating new pos based on force and prev pos
    maxIters = 20;
    attraction = 0.0002; // / 100;
    repulsion = 18; // / 100;
    //dampening = 1;

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
    getPositions(n, A, w, h) {
        var velocities = [];
        for (var i = 0; i < n; i++) {
            velocities.push([0, 0]);
        }
        console.log(velocities)
        var coords = this.generateInitialCoords(n, w, h);
        this.consoleDisplay(n, A, coords, w, h);
        var newCoords = this.getNextCoords(n, A, coords, velocities, w, h);
        this.consoleDisplay(n, A, newCoords, w, h);
        var loss = this.loss(n, coords, newCoords, w, h);

        var iters = 0;
        while (loss > 0.001 && iters < this.maxIters) {
            coords = newCoords;
            newCoords = this.getNextCoords(n, A, coords, velocities, w, h);
            loss = this.loss(n, coords, newCoords, w, h);
            console.log("iter: " + iters)
            this.consoleDisplay(n, A, coords, w, h);
            iters++;
        }

        return coords; //or newCoords, both work
    }

    /**
     * simple loss function... calculates loss based on the change since last iteration
     * @param {Int} n
     * @param {Number[][]} oldCoords - old coordinates
     * @param {Number[][]} newCoords - new coordinates
     * @param {Int} w 
     * @param {Int} h 
     * 
     * @returns {Number} A loss value equal to a function of the max change in position (relative to w and h) for any node (currently f(x) = x is that function)
     */
    loss(n, oldCoords, newCoords, w, h) {
        var maxChange = 0;
        for (var i = 0; i < n; i++) {
            var changeX = (newCoords[i][0] - oldCoords[i][0]) / w;
            var changeY = (newCoords[i][1] - oldCoords[i][1]) / h;

            var dist = Math.sqrt(changeX * changeX + changeY * changeY);

            maxChange = Math.max(maxChange, dist);
        }

        return maxChange;
    }

    /**
     * All nodes repel each other, connected nodes have some attraction, all nodes repel from the boundaries
     * @param {Int} n 
     * @param {Number[][]} A - Adj list without capacities
     * @param {Number[][]} coords 
     * @param {Number[][]} v - Velocities
     * @param {Int} w 
     * @param {Int} h 
     * 
     * @returns {Number[][]} The next set of coords using a physics model
     */
    getNextCoords(n, A, coords, v, w, h) {
        //evaluate force for all of them, then using deltaT find new coords
        var newCoords = [];

        console.log("velocities")
        console.log(v)

        for (var i = 0; i < n; i++) {
            var force = this.forceOnNode(i, n, A, coords, w, h); //assumed to be equal to acceleration
            var distanceX = v[i][0] * this.deltaT + 0.5 * force[0] * this.deltaT * this.deltaT;
            var distanceY = v[i][1] * this.deltaT + 0.5 * force[1] * this.deltaT * this.deltaT;
            v[i][0] += force[0] * this.deltaT;
            v[i][1] += force[1] * this.deltaT;

            /* v[i][0] *= this.dampening;
            v[i][1] *= this.dampening; */
            //console.log(force)
            newCoords.push([coords[i][0] + distanceX, coords[i][1] + distanceY]);
        }

        console.log("new velocities")
        console.log(v)
        console.log("new coords")
        console.log(newCoords)

        return newCoords;
    }

    /**
     * Generates the initial positions of the n nodes taking into account width and height of the canvas
     * @param {Int} n 
     * @param {Int} w 
     * @param {Int} h 
     * 
     * @returns {Number[][]} Array of coordinates
     */
    generateInitialCoords(n, w, h) {
        //Idea: simple generate them in an ellipse that takes up half the canvas
        var centerX = w / 2;
        var centerY = h / 2;
        var coords = [];
        for (var i = 0; i < n; i++) {
            var x = Math.sin(i * 2 * Math.PI / n + Math.PI); //the plus 180 degrees is to make sure s is on left and t is on right
            var y = Math.cos(i * 2 * Math.PI / n + Math.PI);
            x *= (w / 4); //scaling to canvas so that major and minor axes are half of the total width and heights
            y *= (h / 4);

            coords.push([centerX + x, centerY + y]); //add coordinate to the list
        }

        /* var coords = [];
        for (var i = 0; i < n; i++) {
            var x = w * Math.random();
            var y = h * Math.random();;

            coords.push([x, y]); //add coordinate to the list
        } */

        //Idea: generate randomly

        //console.log(coords)
        return coords;
    }

    dist(deltaX, deltaY) {
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
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
    forceOnNode(k, n, A, coords, w, h) {
        //Idea: for node k, A[k] is an array of nodes adjacent to k.
        //Take the coords for all of those, and use that to calculate the force 
        //calculate mean force harmonically
        //treat the walls as equivalent to a node seperately
        //edges are like springs

        //console.log(coords)

        var diagonal = Math.sqrt(w * w + h * h);

        var adj = A[k]; //the array of nodes adjacent to k
        var kPos = [new Number(coords[k][0]), new Number(coords[k][1])]; //pos of node k
        var adjPos = [];
        for (var i = 0; i < adj.length; i++) {
            var r = adj[i]; //node in question
            /* console.log(r)
            console.log(coords[r]) */
            adjPos.push([new Number(coords[r][0]), new Number(coords[r][1])]); //new Number to prevent memory stuffs
        } //At this point adjPos is an array of [x, y] for nodes adjacent to k

        for (var i = 0; i < adjPos.length; i++) {
            adjPos[i] = [adjPos[i][0] - kPos[0], adjPos[i][1] - kPos[1]]
        } //At this point adjPos contains the relative positions of adjacent nodes to k

        var adjForce = [0, 0]; //array of x and y components of force on k
        for (var i = 0; i < adjPos.length; i++) {
            var x = adjPos[i][0]
            var y = adjPos[i][1]
            var dist = this.dist(x, y);
            var magnitude = diagonal * this.attraction * dist // / (dist * dist)
            var forceX = magnitude * x / dist;
            var forceY = magnitude * y / dist;
            adjForce[0] += forceX;
            adjForce[1] += forceY;
        }




        /* var meanAdjPos = [0, 0];
        for (var i = 0; i < adjPos.length; i++) {
            meanAdjPos[0] += this.attraction / adjPos[i][0];
            meanAdjPos[1] += this.attraction / adjPos[i][1];
            /* meanAdjPos[0] += this.attraction * adjPos[i][0];
            meanAdjPos[1] += this.attraction * adjPos[i][1]; 
        }
        meanAdjPos[0] = this.forceScaling * meanAdjPos[0];
        meanAdjPos[1] = this.forceScaling * meanAdjPos[1]; */
        //Now meanAdjPos stores the mean position of the adjacent nodes to k

        ////////////////////////////////////////////////////////////////////////////////////

        var allPos = [];
        for (var r = 0; r < coords.length; r++) { //r is the node in question
            allPos.push([new Number(coords[r][0]), new Number(coords[r][1])]); //new Number to prevent memory stuffs
        } //At this point allPos is essentially coords

        for (var i = 0; i < allPos.length; i++) {
            allPos[i] = [allPos[i][0] - kPos[0], allPos[i][1] - kPos[1]]
        } //At this point allPos contains the relative positions of all nodes to k

        var allForce = [0, 0]; //array of x and y components of force on k
        for (var i = 0; i < allPos.length; i++) {
            if (i == k) continue;
            var x = allPos[i][0]
            var y = allPos[i][1]
            var dist = this.dist(x, y);
            var magnitude = diagonal * this.repulsion / (dist * dist)
            var forceX = magnitude * x / dist;
            var forceY = magnitude * y / dist;
            allForce[0] += forceX;
            allForce[1] += forceY;
        }

        /* var meanAllPos = [0, 0];
        for (var i = 0; i < allPos.length; i++) {
            if (i == k) continue;
            meanAllPos[0] += this.repulsion / allPos[i][0];
            meanAllPos[1] += this.repulsion / allPos[i][1];
            /* meanAllPos[0] += this.repulsion * allPos[i][0];
            meanAllPos[1] += this.repulsion * allPos[i][1]; 
        }
        meanAllPos[0] = this.forceScaling * meanAllPos[0];
        meanAllPos[1] = this.forceScaling * meanAllPos[1]; */
        //Now meanAdjPos stores the mean position of the adjacent nodes to k

        ////////////////////////////////////////////////////////////////////////////////////

        //We want k to move away from the meanAllPos but towards the meanAdjPos
        //var posChange = [meanAdjPos[0] - meanAllPos[0], meanAdjPos[1] - meanAllPos[1]];
        var posChange = [adjForce[0] - allForce[0], adjForce[1] - allForce[1]];

        //But we also want k to stay away from the walls
        posChange[0] = posChange[0] + ((w / kPos[0]) - (w / (w - kPos[0]))) * this.wallRepelFactor; //add repelling from bottom, subtract repelling from top
        posChange[1] = posChange[1] + ((h / kPos[1]) - (h / (h - kPos[1]))) * this.wallRepelFactor;

        var temp = []; //for memory and reference stuffs
        temp.push(new Number(posChange[0]));
        temp.push(new Number(posChange[1]));

        console.log(k + ": adjpos, allpos, adjForce, allForce, poschange")
        console.log(adjPos)
        console.log(allPos)
        console.log(adjForce)
        console.log(allForce)
        console.log(posChange)

        return temp;

    }

    /**
     * Display in console on a 20x20 canvas of ascii characters
     * @param {Int} n 
     * @param {Number[][]} A 
     * @param {Number[][]} coords 
     * @param {Int} w 
     * @param {Int} h 
     */
    consoleDisplay(n, A, coords, w, h) {
        var interpolationCount = 20;
        var resolution = 30;

        //console.log("coords to draw: ")
        //console.log(coords);

        var adjustedCoords = [];
        for (var i = 0; i < n; i++) {
            adjustedCoords.push([Math.floor(resolution * coords[i][0] / w), Math.floor(resolution * coords[i][1] / h)]);
            //adjustedCoords.push([Math.floor(3 * resolution * coords[i][0] / w), Math.floor(resolution * coords[i][1] / h)]);
        }

        var displayRows = [];
        for (var i = 0; i < resolution; i++) {
            var temp = []
            for (var j = 0; j < resolution; j++) {
                temp.push('   ');
                //temp.push();
            }
            displayRows.push(temp);
        }

        for (var i = 0; i < A.length; i++) {
            //draw each edge... use + signs
            for (var k = 0; k < A[i].length; k++) {
                var j = A[i][k];
                //interpolation 
                var iX = coords[i][0];
                var iY = coords[i][1];
                var jX = coords[j][0];
                var jY = coords[j][1];
                for (var a = 1; a < interpolationCount; a++) {
                    var interpolationX = (iX * a + jX * (interpolationCount - a)) / interpolationCount;
                    var interpolationY = (iY * a + jY * (interpolationCount - a)) / interpolationCount;
                    //console.log([Math.floor(resolution * interpolationX / w), Math.floor(resolution * interpolationY / h)])
                    //var adjX = Math.floor(resolution * interpolationX / w)
                    //var adjX = Math.floor(3 * resolution * interpolationX / w)
                    //var adjY = Math.floor(resolution * interpolationX / h)
                    /* if (adjX % 3 == 0) {
                        adjX = Math.floor(adjX / 3);
                        //displayRows[Math.floor(resolution * interpolationX / w)][Math.floor(resolution * interpolationY / h)] = '  .';
                        displayRows[Math.floor(resolution * interpolationX / w)][Math.floor(resolution * interpolationY / h)] = '.  ';
                    } else if (adjX % 3 == 1) {
                        adjX = Math.floor(adjX / 3);
                        displayRows[Math.floor(resolution * interpolationX / w)][Math.floor(resolution * interpolationY / h)] = ' . ';
                    } else if (adjX % 3 == 2) {
                        adjX = Math.floor(adjX / 3);
                        //displayRows[Math.floor(resolution * interpolationX / w)][Math.floor(resolution * interpolationY / h)] = '.  ';
                        displayRows[Math.floor(resolution * interpolationX / w)][Math.floor(resolution * interpolationY / h)] = '  .';
                    } */

                    displayRows[Math.floor(resolution * interpolationX / w)][Math.floor(resolution * interpolationY / h)] = ' . ';
                }
            }
        }
        //console.log(displayRows)

        for (var i = 0; i < n; i++) {
            var a = adjustedCoords[i][0];
            var b = adjustedCoords[i][1];
            /* if (a % 3 == 0) {
                a = Math.floor(a / 3);
                displayRows[a][b] = '  ' + i;
                //displayRows[a][b] = i + '  ';
            } else if (a % 3 == 1) {
                a = Math.floor(a / 3);
                displayRows[a][b] = ' ' + i + ' ';
            } else if (a % 3 == 2) {
                a = Math.floor(a / 3);
                displayRows[a][b] = i + '  ';
                //displayRows[a][b] = '  ' + i;
            } */

            displayRows[a][b] = ' ' + i + ' ';


        }
        //console.log("displayRows: ")
        //console.log(displayRows)
        for (var i = 0; i < resolution; i++) {
            var str = "";
            str = str + "row " + i;
            if (i < 10) str += ' ';
            for (var j = 0; j < resolution; j++) {
                str = str + displayRows[i][j];
            }
            str += '|'
            console.log(str);
        }
    }
}