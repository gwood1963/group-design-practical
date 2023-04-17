/*
The aim of this file is to provide functions that 
aid with displaying the graphs

TODO: calculate area, how to do given just some random points?
Idea: use Graham Scan https://en.wikipedia.org/wiki/Graham_scan to find the convex hull
currently working on a modified graham scan combining both counterclockwise and clockwise


Idea: 
 - minimize crossing Number
 - Have the area/aspect ratio appropriate (use a function that takes params width and length)
 - minimize total length of edges
 - consider angular resolution maaybe.... preferably not have very sharp or flat angles
 - maybe use a force based system (each node repels from other nodes and the boundaries, but attract to connected nodes)

*/

/*

New Idea: 

1. Generate 100 or so random positions for the nodes
2. Which one has the least crossing number? (computed "dynamically", like as in max of array)
3. scale up/down to take up the appropriate amount of space

for calculating number of edge crossings, see: 
Bentley–Ottmann algorithm
Idea: vertical line test

or brute force of course will work (easier to implement)

*/

export class Display {
    wallRepelFactor = 1; //currently unused //how "repelly" do we want the walls, can be changes later
    forceScaling = 1; //currently unused //maybe not used since it'll depend on size of canvas, it's essentially G, the gravitational constant
    deltaT = 0.5; //currently unused //Change in "time" between iterations, needed for calculating new pos based on force and prev pos
    maxIters = 20;
    attraction = 0.0002; //currently unused
    repulsion = 18; //currently unused

    /**
     * positions for n nodes, no edges
     */
    genRandomEmpty(n, w, h) {
        var coords = this.generateInitialCoordsRandom(w, h);
        coords = this.adjustArea(n, coords, w, h);
        coords = coords.sort(([x, b], [y, d]) => x - y);

        for (var i = 0; i < 5; i++) {
            var c = this.generateInitialCoordsRandom(w, h);
            c = this.adjustArea(n, c, w, h);
            c = c.sort(([x, b], [y, d]) => x - y);
            if (this.nodeSpacing(n, c) > this.nodeSpacing(n, coords))
                coords = c;
        }
        console.log(coords);
        return coords;
    }

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
        console.log(velocities);
        var coords = this.generateInitialCoords(n, w, h);
        this.consoleDisplay(n, A, coords, w, h);
        var newCoords = this.getNextCoords(n, A, coords, velocities, w, h);

        var iters = 0;
        while ( /* loss > 0.001 && */ iters < this.maxIters) {
            coords = newCoords;
            newCoords = this.getNextCoords(n, A, coords, velocities, w, h);
            iters++;
        }

        return coords; //or newCoords, both work
    }

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
    getPositionsRandom(n, A, w, h) {
        //var coords = this.generateInitialCoordsRandom(n, w, h);
        var bestCoords = []; // = coords;
        var bestCrossCount = 10000000;
        const topOrder = this.topOrder(A); //from first to last in this array is the same as from left to right
        const isTop = topOrder != null;
        for (var iters = 0; iters < 1000; iters++) {
            var coords = this.generateInitialCoordsRandom(n, w, h);

            //console.log(coords);
            //now the coordinates should be in topological order with respect to the nodes


            coords = this.adjustArea(n, coords, w, h);

            /////////////////////////////////

            if (isTop) {

                coords = coords.sort(([a, b], [c, d]) => a - c); //sort by x coordinates
                //console.log(coords);
                var topCoords = [];
                for (var i = 0; i < n; i++) {
                    topCoords.push([]);
                }
                for (var i = 0; i < n; i++) {
                    var curr = topOrder[i]; //the ith node in topological order
                    topCoords[curr] = coords[i];
                }
                var coords = [];
                for (var i = 0; i < n; i++) {
                    coords.push(topCoords[i]);
                }

            }

            /////////////////////////////////

            var crossCount = this.crossCount(coords, A);
            if (crossCount < bestCrossCount) {
                //bestCoords = coords; //need to opdate references
                bestCoords = [];
                for (var i = 0; i < n; i++) {
                    bestCoords.push([new Number(coords[i][0]), new Number(coords[i][1])]);
                }
                //console.log("updated coordinates");
                //console.log(bestCoords);
                bestCrossCount = crossCount;
                //console.log(bestCrossCount)
            }
            if (crossCount == bestCrossCount) {
                //console.log("equal cross count")
                //compare node spacing here
                if (this.nodeSpacing(n, coords) > this.nodeSpacing(n, bestCoords)) {
                    //if (this.hullArea(coords) > this.hullArea(bestCoords) && this.nodeSpacing(n, coords) > this.nodeSpacing(n, bestCoords)) {
                    //if (this.nodeSpacing(n, coords) > this.nodeSpacing(n, bestCoords) &&
                    //this.relativePositionLoss(n, A, coords) < this.relativePositionLoss(n, A, bestCoords)) {
                    //if (this.loss(n, A, coords) > this.loss(n, A, bestCoords)) {
                    bestCoords = [];
                    for (var i = 0; i < n; i++) {
                        bestCoords.push([
                            new Number(coords[i][0]),
                            new Number(coords[i][1]),
                        ]);
                    }
                    /* console.log("updated coordinates");
                    //console.log(c);
                    console.log(bestCoords);
                    bestCrossCount = crossCount;
                    console.log(bestCrossCount) */
                }
            }
        }
        /* console.log("best crossing: ")
        console.log(bestCrossCount)

        console.log("graham scan: ");
        var convexHull = this.grahamScan(bestCoords);
        console.log(convexHull);
        console.log("Hull area: ");
        var area = this.hullArea(bestCoords);
        console.log(area); */

        /* console.log("modified graham scan: ");
        var modifiedConvexHull = this.modifiedGrahamScan(bestCoords, A);
        console.log(modifiedConvexHull);
        console.log("Modified hull area: ");
        var area = this.modifiedHullArea(bestCoords, A);
        console.log(area); */

        //bestCoords = this.adjustArea(n, bestCoords, w, h);
        return bestCoords;
    }

    /**
     * @pre the graph has no cycles
     * @param {Number[][]} A 
     */
    topOrder(A) {
        //essentially same as in generate.js
        //Idea: use BFS (Kahn's Algorithm for Topological Sorting)
        /*
        Lemma: If a directed graph has no cycles, then there must be at least one vertex
        with no in-edges. 

        Proof: pigeonhole principle or otherwise, pretty easy to show. 

        algorithm idea: remove the nodes with no in-edges, and their associated edges. 
        if we can repeat until empty, then there are no cycles and we have an ordering
        otherwise there exist a cycle in the graph
        */

        const n = A.length;
        var nodes = [];
        var inDegs = [];
        var topOrder = [];
        var nodesLeft = n;
        var iters = 0;
        for (var i = 0; i < n; i++) {
            nodes.push(1);
        }

        while (nodesLeft > 0 && iters < n + 1) {
            var zeroCount = 0;
            inDegs = this.inDegrees(A, nodes);
            for (var i = 0; i < n; i++) {
                if (inDegs[i] == 0 && nodes[i] == 1) {
                    nodes[i] = 0;
                    topOrder.push(i);
                    zeroCount++;
                }
            }
            nodesLeft = 0;
            for (var i = 0; i < n; i++) {
                nodesLeft += nodes[i];
            }
            if (nodesLeft == 0) {
                console.log("Topological Order: ");
                console.log(topOrder);
                return topOrder;
            }
            if (zeroCount == 0) {
                console.log("error in topOrder");
            }
            iters++;
        }

        /* console.log("error in topOrder");
        var dummy = [];
        for (var i = 0; i < n; i++) {
            dummy.push(i);
        }
        return dummy; */
        return null;
    }

    /**
     * Computer indegrees of nodes in A for the nodes indicated in nodes
     * @param {Number[][]} A 
     * @param {Number[]} nodes - degree n, 1 if included, 0 otherwise
     */
    inDegrees(A, nodes) {
        var degs = [];
        var n = A.length;
        for (var i = 0; i < n; i++) {
            degs.push(0);
        }

        for (var i = 0; i < n; i++) {
            if (nodes[i] == 1) {
                for (var k = 0; k < A[i].length; k++) {
                    const j = A[i][k];
                    degs[j]++;
                }
            }
        }

        return degs;
    }

    /**
     * Returns an array of the coords of the convex hull
     * @param {Number[][]} coords 
     */
    grahamScan(coords) {
        /* 
let points be the list of points
let stack = empty_stack()

find the lowest y-coordinate and leftmost point, called P0
sort points by polar angle with P0, if several points have the same polar angle then only keep the farthest

for point in points:
    # pop the last point from the stack if we turn clockwise to reach this point
    while count stack > 1 and ccw(next_to_top(stack), top(stack), point) <= 0:
        pop stack
    push point to stack
end 
*/
        const n = coords.length;
        var indexOfLowest = 0;
        for (var i = 0; i < n; i++) {
            if (coords[i][1] < coords[indexOfLowest][1]) {
                indexOfLowest = i;
            } else if (coords[i][1] == coords[indexOfLowest][1]) {
                indexOfLowest = coords[i][0] < coords[indexOfLowest][0] ? i : indexOfLowest;
            }
        }
        //indexOfLowest is the lowest y-coordinate and leftmost point, called P0

        var sortedPoints = []; //(k, angle(k)) not including P0
        const pX = coords[indexOfLowest][0];
        const pY = coords[indexOfLowest][1];
        for (var i = 0; i < n; i++) {
            if (i == indexOfLowest) continue;
            const x = coords[i][0] - pX;
            const y = coords[i][1] - pY;
            const bastardizedAngle = x / Math.sqrt(x * x + y * y);
            sortedPoints.push([i, bastardizedAngle]);
        }
        sortedPoints.sort(([a, b], [c, d]) => b - d);
        //sortedPoints is an array of points not P0 sorted by polar angle
        var stack = [];
        stack.push(indexOfLowest);
        for (var i = 0; i < sortedPoints.length; i++) {
            const p = sortedPoints[i][0];
            //if we turn clockwise, pop from stack
            while (stack.length > 1 && this.counterClockWise(coords, stack[stack.length - 2], stack[stack.length - 1], p) >= 0) {
                stack.pop();
            }
            stack.push(p);
        }
        return stack;
    }


    /**
     * returns number of edge crossings
     * @param {Number[][]} coords 
     * @param {Number[][]} A 
     */
    crossCount(coords, A) {
        var crossCount = 0;
        const n = coords.length;
        for (var i = 0; i < n; i++) {
            for (var k = 0; k < A[i].length; k++) {
                var j = A[i][k];
                for (var a = i + 1; a < n; a++) {
                    for (var r = 0; r < A[a].length; r++) {
                        var b = A[a][r];
                        if (this.isCrossing(coords[i], coords[j], coords[a], coords[b]))
                            crossCount++;
                    }
                }
            }
        }
        return crossCount;
    }

    /**
     * Adds coords for intersection points, and modifies edges to accomodate these extra nodes
     * @param {Number[][]} coords 
     * @param {Number[][]} A - no capacities
     */
    coordsWithIntersections(coords, A) {
        const n = coords.length;
        var newN = n;
        var newCoords = [];
        for (var i = 0; i < n; i++) {
            newCoords.push(coords[i]);
        }
        var newA = [];
        for (var i = 0; i < A.length; i++) {
            var temp = [];
            for (var k = 0; k < A[i].length; k++) {
                temp.push(new Number(A[i][k]));
            }
            newA.push(temp);
        }
        /* var edgeEnumeration = [];
        for (var i = 0; i < A.length; i++) {
            for (var k = 0; k < A[i].length; k++) {
                edgeEnumeration.push(i, A[i][k]);
            }
        } */

        //O(n^3): while there are edge crossings, modify one intersection
        //Invariant: n = dim(newCoords) = dim(newA)

        while (this.crossCount(newCoords, newA) > 0) {
            //find one intersection, and make a new node and update edges

            var found = false;
            for (var i = 0; i < newN && !found; i++) {
                for (var k = 0; k < newA[i].length && !found; k++) {
                    var j = newA[i][k];
                    for (var a = i + 1; a < newN && !found; a++) {
                        for (var r = 0; r < newA[a].length && !found; r++) {
                            var b = newA[a][r];
                            if (this.isCrossing(newCoords[i], newCoords[j], newCoords[a], newCoords[b])) {
                                newCoords.push(this.intersection(newCoords[i], newCoords[j], newCoords[a], newCoords[b])); //add new coords
                                newA.push(i, j, a, b); //add new edges
                                newA[i].splice(k, 1); //remove old edges
                                newA[a].splice(r, 1);
                                newN++;
                                found = true;
                                break;

                            }
                        }
                    }
                }
            }
        }
        return [newCoords, newA];
    }

    /**
     * Returns an array of the coords of the convex hull
     * @param {Number[][]} oldCoords 
     */
    modifiedGrahamScan(oldCoords, oldA) {
        /* 
let points be the list of points
let stack = empty_stack()

find the lowest y-coordinate and leftmost point, called P0
sort points by polar angle with P0, if several points have the same polar angle then only keep the farthest

for point in points:
    # pop the last point from the stack if we turn clockwise to reach this point
    while count stack > 1 and ccw(next_to_top(stack), top(stack), point) <= 0:
        pop stack
    push point to stack
    //going counter clockwise from p0
    //we push the most clockwise point from the current point that has an edge
    //KEY POINTS: we have to create new points at the intersections of edges to accurately get this area
end 
*/
        const coordsWithIntersections = this.coordsWithIntersections(oldCoords, oldA);
        console.log("modifed coords: ");
        console.log(coordsWithIntersections);
        const coords = coordsWithIntersections[0];
        const A = coordsWithIntersections[1];
        /////////////////////////////////////////////////////////////////
        const n = coords.length;
        var indexOfLowest = 0;
        //console.log(coords);
        for (var i = 0; i < n; i++) {
            /* console.log(indexOfLowest);
            console.log(i);
            console.log(coords[i]);
            console.log(coords[indexOfLowest]); */
            if (coords[i][1] < coords[indexOfLowest][1]) {
                indexOfLowest = i;
            } else if (coords[i][1] == coords[indexOfLowest][1]) {
                indexOfLowest = coords[i][0] < coords[indexOfLowest][0] ? i : indexOfLowest;
            }
        }
        //indexOfLowest is the lowest y-coordinate and leftmost point, called P0

        /* var sortedPoints = []; //(k, angle(k)) not including P0
        const pX = coords[indexOfLowest][0];
        const pY = coords[indexOfLowest][1];
        for (var i = 0; i < n; i++) {
            if (i == indexOfLowest) continue;
            const x = coords[i][0] - pX;
            const y = coords[i][1] - pY;
            const bastardizedAngle = x / Math.sqrt(x * x + y * y);
            sortedPoints.push([i, bastardizedAngle]);
        }
        sortedPoints.sort(([a, b], [c, d]) => b - d); */
        //sortedPoints is an array of points not P0 sorted by polar angle


        /* var stack = [];
        for (var i = 0; i < sortedPoints.length; i++) {
            stack.push(sortedPoints[i][0]);
        } */
        //to go through these indices...

        indexOfLowest = 0;
        var boundary = [];
        var curr = indexOfLowest;
        var prev = curr;
        var next;
        var iters = 0;
        while (next != indexOfLowest && iters < 100) {
            console.log("in while");
            console.log(boundary);
            /* console.log(indexOfLowest);
            console.log(prev);
            console.log(next); */
            next = this.pointClockwiseFrom(coords, A, curr, prev);
            boundary.push(next);
            prev = curr;
            curr = next;
            iters++; //safety measure
        }
        console.log("out while");
        //We know for sure that stack will run out as the entire shape is connected 

        return [boundary, coords];
    }

    contains(arr, val) {
        var cont = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val)
                cont = true;
        }
        return cont;
    }

    /* /**
     * 
     * @param {Number[][]} coords 
     * @param {Number[][]} A
     * @param {Number} p 
     * @param {Number[]} s 
     
    pointMostClockwiseFrom(coords, A, p, s) {
        //https://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
        //p is the current point
        //s is the stack of points to go through (after p)

        const pX = coords[p][0];
        const pY = coords[p][1];

        //coords global variable in this case
        var existPointInZeroToPi = false;
        var currPoint = s[0];
        var currBastadizedAngle = (coords[currPoint][0] - pX) / Math.sqrt((coords[currPoint][0] - pX) * (coords[currPoint][0] - pX) + (coords[currPoint][1] - pY) * (coords[currPoint][1] - pY));

        if (coords[currPoint][1] > 0) existPointInZeroToPi = true;

        for (var i = 1; i < s.length; i++) {
            const n = A[p];
            const m = A[s[i]];
            /* if (s[i] != A.length) {
                if (n.indexOf(s[i]) < 0 && m.indexOf(p) < 0)
                    continue;
            } else if (n.indexOf(s[i]) < 0)
                continue;
            if (n.indexOf(s[i]) < 0 && m.indexOf(p) < 0)
                continue;
            //if (!this.contains(n, s[i]) && !this.contains(m, p)) continue;
            const x = coords[s[i]][0] - pX;
            const y = coords[s[i]][1] - pY;
            const bastardizedAngle = x / Math.sqrt(x * x + y * y);

            if (y < 0 && existPointInZeroToPi) continue;

            if (y < 0) {
                if (bastardizedAngle < currBastadizedAngle) {
                    currPoint = s[i];
                    currBastadizedAngle = bastardizedAngle;
                }
                continue;
            }
            //y > 0
            if (bastardizedAngle > currBastadizedAngle) {
                existPointInZeroToPi = true;
                currPoint = s[i];
                currBastadizedAngle = bastardizedAngle;
            }
        }

        return currPoint;
    } */

    /**
     * 
     * @param {Number[][]} coords 
     * @param {Number[][]} A
     * @param {Number} p - current point
     * @param {Number} q - previous point
     */
    pointClockwiseFrom(coords, A, p, q) {
        //https://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
        //p is the current point
        //s is the stack of points to go through (after p)

        var prevAngle = 0;
        if (q != p) {
            const qX = coords[q][0] - coords[p][0];
            const qY = coords[q][1] - coords[p][1];

            //previous angle (from p to q, p is pivot)
            prevAngle = qY >= 0 ? Math.acos(qX / Math.sqrt(qX * qX + qY * qY)) : 2 * Math.PI - Math.acos(qX / Math.sqrt(qX * qX + qY * qY));
        }

        const pX = coords[p][0];
        const pY = coords[p][1];

        const stack = A[p]; //list of points to go through
        console.log("curr and stack: ");
        console.log(p);
        console.log(stack);

        //coords global variable in this case

        var angles = []; //store angles in format (angle, node id)

        for (var i = 1; i < stack.length; i++) {
            const x = coords[stack[i]][0] - pX;
            const y = coords[stack[i]][1] - pY;
            const angle = y >= 0 ? Math.acos(x / Math.sqrt(x * x + y * y)) : 2 * Math.PI - Math.acos(x / Math.sqrt(x * x + y * y));


            const adjustedAngle = angle < prevAngle ? angle + 2 * Math.PI - prevAngle : angle - prevAngle;
            angles.push([adjustedAngle, stack[i]]);
        }

        angles.sort(([a, b], [c, d]) => a - c);
        //angles are sorted in ascending order

        return angles.length > 0 ? angles[0][1] : null; //lowest angle is most clockwise
    }


    /**
     * returns > 0 if c makes a counter clockwise turn from a, b, c
     * @param {Number[][]} coords 
     * @param {Number} a 
     * @param {Number} b 
     * @param {Number} c 
     */
    counterClockWise(coords, a, b, c) {
        const ax = coords[a][0];
        const ay = coords[a][1];
        const bx = coords[b][0];
        const by = coords[b][1];
        const cx = coords[c][0];
        const cy = coords[c][1];
        return (bx - ax) * (cy - ay) - (cx - ax) * (by - ay);
    }

    /**
     * 
     * @param {Number[][]} coords 
     * @returns Area given coords
     */
    modifiedHullArea(coords, A) {
        //const hull = this.grahamScan(coords);
        var mgs = this.modifiedGrahamScan(coords, A);
        var hull = mgs[0];
        var newCoords = mgs[1];

        const n = hull.length;
        var area = 0;

        hull.push(hull[0]);
        hull.push(hull[1]);

        for (var i = 1; i <= n; i++) {
            const p = hull[i];
            const q = hull[i + 1];
            const r = hull[i - 1];

            area += newCoords[p][0] * (newCoords[q][1] - newCoords[r][1]);
        }
        area = Math.abs(area / 2);

        return area;
    }

    /**
     * 
     * @param {Number[][]} coords 
     * @returns Area given coords
     */
    hullArea(coords) {
        //const hull = this.grahamScan(coords);
        var hull = this.grahamScan(coords);
        const n = hull.length;
        var area = 0;

        hull.push(hull[0]);
        hull.push(hull[1]);

        for (var i = 1; i <= n; i++) {
            const p = hull[i];
            const q = hull[i + 1];
            const r = hull[i - 1];

            area += coords[p][0] * (coords[q][1] - coords[r][1]);
        }
        area = Math.abs(area / 2);

        return area;
    }

    /**
     *
     * @param {Number[][]} coords
     * @param {Number} w
     * @param {Number} h
     */
    adjustArea(n, coords, w, h) {
        var minX = coords[0][0];
        var maxX = coords[0][0];
        var minY = coords[0][1];
        var maxY = coords[0][1];
        for (var i = 1; i < n; i++) {
            minX = Math.min(minX, coords[i][0]);
            maxX = Math.max(maxX, coords[i][0]);
            minY = Math.min(minY, coords[i][1]);
            maxY = Math.max(maxY, coords[i][1]);
        }
        //each x goes from x -> (x - minX) * (0.75 * w / (maxX - minX)) + (0.125 * w)
        var newCoords = [];
        for (var i = 0; i < n; i++) {
            var x = (coords[i][0] - minX) * ((0.75 * w) / (maxX - minX)) + 0.125 * w;
            var y = (coords[i][1] - minY) * ((0.75 * h) / (maxY - minY)) + 0.125 * h;
            newCoords.push([x, y]);
        }
        return newCoords;
    }

    nodeSpacing(n, coords) {
        var closest = 10000000;
        for (var i = 0; i < n; i++) {
            for (var j = i + 1; j < n; j++) {
                var dist = Math.sqrt(
                    Math.pow(coords[i][0] - coords[j][0], 2) +
                    Math.pow(coords[i][1] - coords[j][1], 2)
                );
                closest = Math.min(closest, dist);
            }
        }
        return closest;
    }

    /**
     *
     * @returns whether the edge through points 1, 2 cross the edge through points 3, 4
     */
    isCrossing(p1, p2, p3, p4) {
        //Idea: get slope of line from 1 to 2
        //if 3 is above line and 4 is below line or vice versa, then cross
        //otherwise no cross
        //how to tell if 3 is above line?
        //is y3-y1 > m(x3-x1)? If yes then 3 is above the line.

        const x1 = p1[0];
        const x2 = p2[0];
        const x3 = p3[0];
        const x4 = p4[0];
        const y1 = p1[1];
        const y2 = p2[1];
        const y3 = p3[1];
        const y4 = p4[1];

        const m = (y2 - y1) / (x2 - x1);
        const m2 = (y4 - y3) / (x4 - x3);
        if (
            ((y3 - y1 > m * (x3 - x1) &&
                    y4 - y1 < m * (x4 - x1)) ||
                (y3 - y1 < m * (x3 - x1) &&
                    y4 - y1 > m * (x4 - x1))) &&
            ((y1 - y3 > m2 * (x1 - x3) &&
                    y2 - y3 < m2 * (x2 - x3)) ||
                (y1 - y3 < m2 * (x1 - x3) &&
                    y2 - y3 > m2 * (x2 - x3)))
        )
            return true;
        return false;
    }

    /**
     *
     * @pre the correspoinding edges cross
     * @returns the intersection point 
     */
    intersection(p1, p2, p3, p4) {
        //Idea: get slope of line from 1 to 2
        //if 3 is above line and 4 is below line or vice versa, then cross
        //otherwise no cross
        //how to tell if 3 is above line?
        //is y3-y1 > m(x3-x1)? If yes then 3 is above the line.

        const x1 = p1[0];
        const x2 = p2[0];
        const x3 = p3[0];
        const x4 = p4[0];
        const y1 = p1[1];
        const y2 = p2[1];
        const y3 = p3[1];
        const y4 = p4[1];

        const m = (y2 - y1) / (x2 - x1);
        const m2 = (y4 - y3) / (x4 - x3);

        const x = (m * x1 - m2 * x3 + y3 - y1) / (m - m2);
        const y = m * x - m * x1 + y1;
        return [x, y];
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
    /* loss(n, oldCoords, newCoords, w, h) {
          var maxChange = 0;
          for (var i = 0; i < n; i++) {
              var changeX = (newCoords[i][0] - oldCoords[i][0]) / w;
              var changeY = (newCoords[i][1] - oldCoords[i][1]) / h;

              var dist = Math.sqrt(changeX * changeX + changeY * changeY);

              maxChange = Math.max(maxChange, dist);
          }

          return maxChange;
      } */

    /* loss(n, A, coords) {
          return this.relativePositionLoss(n, A, coords) + this.nodeSpacing(n, coords);
      } */

    /**
     * essentially sums up the difference in x of edges going backwards (to the left)
     */
    relativePositionLoss(n, A, coords) {
        //essentially sums up the difference in x of edges going backwards (to the left)
        var loss = 0;
        for (var i = 0; i < n; i++) {
            for (var k = 0; k < A[i].length; k++) {
                var j = A[i][k];
                var iX = coords[i][0];
                var jX = coords[j][0];

                if (iX > jX) {
                    loss += iX - jX;
                }
            }
        }
        return loss;
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


        for (var i = 0; i < n; i++) {
            var force = this.forceOnNode(i, n, A, coords, w, h); //assumed to be equal to acceleration
            var distanceX =
                v[i][0] * this.deltaT + 0.5 * force[0] * this.deltaT * this.deltaT;
            var distanceY =
                v[i][1] * this.deltaT + 0.5 * force[1] * this.deltaT * this.deltaT;
            v[i][0] += force[0] * this.deltaT;
            v[i][1] += force[1] * this.deltaT;

            newCoords.push([coords[i][0] + distanceX, coords[i][1] + distanceY]);
        }

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
            var x = Math.sin((i * 2 * Math.PI) / n + Math.PI); //the plus 180 degrees is to make sure s is on left and t is on right
            var y = Math.cos((i * 2 * Math.PI) / n + Math.PI);
            x *= w / 4; //scaling to canvas so that major and minor axes are half of the total width and heights
            y *= h / 4;

            coords.push([centerX + x, centerY + y]); //add coordinate to the list
        }
        return coords;
    }

    /**
     * Generates randomly the initial positions of the n nodes taking into account width and height of the canvas
     * @param {Int} n
     * @param {Int} w
     * @param {Int} h
     *
     * @returns {Number[][]} Array of coordinates
     */
    generateInitialCoordsRandom(n, w, h) {
        //Idea: generate randomly
        var lowerX = w / 6;
        var lowerY = h / 8;


        var coords = [];
        coords.push([w / 8, lowerY + (h * Math.random() * 3) / 4]);
        for (var i = 1; i < n - 1; i++) {
            var x = lowerX + (w * Math.random() * 2) / 3;
            var y = lowerY + (h * Math.random() * 3) / 4;

            coords.push([x, y]); //add coordinate to the list
        }
        coords.push([(7 * w) / 8, lowerY + (h * Math.random() * 3) / 4]);
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
            adjPos[i] = [adjPos[i][0] - kPos[0], adjPos[i][1] - kPos[1]];
        } //At this point adjPos contains the relative positions of adjacent nodes to k

        var adjForce = [0, 0]; //array of x and y components of force on k
        for (var i = 0; i < adjPos.length; i++) {
            var x = adjPos[i][0];
            var y = adjPos[i][1];
            var dist = this.dist(x, y);
            var magnitude = diagonal * this.attraction * dist; // / (dist * dist)
            var forceX = (magnitude * x) / dist;
            var forceY = (magnitude * y) / dist;
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
        for (var r = 0; r < coords.length; r++) {
            //r is the node in question
            allPos.push([new Number(coords[r][0]), new Number(coords[r][1])]); //new Number to prevent memory stuffs
        } //At this point allPos is essentially coords

        for (var i = 0; i < allPos.length; i++) {
            allPos[i] = [allPos[i][0] - kPos[0], allPos[i][1] - kPos[1]];
        } //At this point allPos contains the relative positions of all nodes to k

        var allForce = [0, 0]; //array of x and y components of force on k
        for (var i = 0; i < allPos.length; i++) {
            if (i == k) continue;
            var x = allPos[i][0];
            var y = allPos[i][1];
            var dist = this.dist(x, y);
            var magnitude = (diagonal * this.repulsion) / (dist * dist);
            var forceX = (magnitude * x) / dist;
            var forceY = (magnitude * y) / dist;
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
        posChange[0] =
            posChange[0] + (w / kPos[0] - w / (w - kPos[0])) * this.wallRepelFactor; //add repelling from bottom, subtract repelling from top
        posChange[1] =
            posChange[1] + (h / kPos[1] - h / (h - kPos[1])) * this.wallRepelFactor;

        var temp = []; //for memory and reference stuffs
        temp.push(new Number(posChange[0]));
        temp.push(new Number(posChange[1]));

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

        var adjustedCoords = [];
        for (var i = 0; i < n; i++) {
            adjustedCoords.push([
                Math.floor((resolution * coords[i][0]) / w),
                Math.floor((resolution * coords[i][1]) / h),
            ]);
        }

        var displayRows = [];
        for (var i = 0; i < resolution; i++) {
            var temp = [];
            for (var j = 0; j < resolution; j++) {
                temp.push("   ");
            }
            displayRows.push(temp);
        }

        for (var i = 0; i < A.length; i++) {
            //draw each edge
            for (var k = 0; k < A[i].length; k++) {
                var j = A[i][k];

                var iX = coords[i][0];
                var iY = coords[i][1];
                var jX = coords[j][0];
                var jY = coords[j][1];
                for (var a = 1; a < interpolationCount; a++) {
                    var interpolationX =
                        (iX * a + jX * (interpolationCount - a)) / interpolationCount;
                    var interpolationY =
                        (iY * a + jY * (interpolationCount - a)) / interpolationCount;

                    displayRows[Math.floor((resolution * interpolationX) / w)][
                        Math.floor((resolution * interpolationY) / h)
                    ] = " . ";
                }
            }
        }

        for (var i = 0; i < n; i++) {
            var a = adjustedCoords[i][0];
            var b = adjustedCoords[i][1];

            displayRows[a][b] = " " + i + " ";
        }
        for (var i = 0; i < resolution; i++) {
            var str = "";
            str = str + "row " + i;
            if (i < 10) str += " ";
            for (var j = 0; j < resolution; j++) {
                str = str + displayRows[i][j];
            }
            str += "|";
            console.log(str);
        }
    }
}