/*
The aim of this file is to provide a way to store graphs as an object while running the application
*/

export class Graph {
    //nodes = [];
    n;
    A = [
        [
            [0, 0]
        ]
    ]; // list of (j, capacity)'s in row i

    /**
     * 
     * @param {Int} numNodes 
     * @param {[[[Int]]]} adjacencyList 
     */
    constructor(numNodes, adjacencyList) {
        //this.nodes = nodes //maybe not needed, instead store numNodes?
        this.n = numNodes
        this.A = adjacencyList //Adjacency List of elements of the form (j, capacity) in row i
    }

    setParams(n, A) {
        this.n = n;
        this.A = A;
    }

    dummy() {
        console.log("dummy function");
    }

    setCapacitiesZero() {
        for (var i = 0; i < this.n; i++) {
            for (var k = 0; k < this.A[i].length; k++) {
                this.A[i][k][1] = 0;
            }
        }
    }

    dim() {
        return this.n;
    }

    adjList() {
        //Uncaught TypeError: G.adjList is not a function
        //does not show up with getA()... weird.
        /* var temp = new Array(this.n).fill([]);
        for (var i = 0; i < this.n; i++) {
            for (var k = 0; k < this.A[i].length; k++) {
                temp[i].push(this.A[i][k]);
                console.log(temp);
            }
        }
        return temp; */
        return this.A;
    }

    getA() {
        var temp = new Array(this.n).fill([]);
        for (var i = 0; i < this.n; i++) {
            for (var k = 0; k < this.A[i].length; k++) {
                temp[i].push(this.A[i][k]);
                console.log(temp);
            }
        }
        return temp;
        //return this.A;
    }

    adjMatrix() {
        var m = new Array(n).fill(new Array(n).fill(0));
        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < A[i].length; j++) {
                m[i][A[i][j][0]] = 1; //edge from i to j (A[i][j][0])
            }
        }
        return m;
    }

    capMatrix() {
        var m = new Array(n).fill(new Array(n).fill(0));
        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < A[i].length; j++) {
                m[i][A[i][j][0]] = A[i][j][1] //capacity of edge from i to j (A[i][j][0])
            }
        }
        return m;
    }

    adjMatrixWithCap() {
        //for some reason outputting a matrix with wrong entries
        //again due to referencing the same point in memory?
        var m = new Array(this.n).fill(new Array(this.n).fill([0, 0])); //[0, 0] if no edge, [1, cap] if has edge
        console.log("matrix with cap")
        console.log(m);
        //var m = new Array(this.n)[new Array(this.n)[new Array(2)[0]]]; //[0, 0] if no edge, [1, cap] if has edge
        console.log(this.A);
        for (var i = 0; i < this.n; i++) {
            console.log(this.A[i].length)
            for (var j = 0; j < this.A[i].length; j++) {
                console.log(i + " " + this.A[i][j][0] + " " + this.A[i][j][1]);
                m[i][this.A[i][j][0]] = [1, this.A[i][j][1]]; //edge from i to j (A[i][j][0])
            }
        }
        console.log("end operations")
        return m;
    }

    set nodes(n) {
        this.n = n;
    }

    set adjList(adj) {
        this.A = adj;
    }

    logInfo() {
        console.log("Nodes: " + this.n);
        console.log(this.A);
        console.log("Adjacency List: ");
        for (var i = 0; i < this.n; i++) {
            var row = "";
            for (var k = 0; k < this.A[i].length; k++) {
                row += this.A[i] + " ";
            }
            console.log(row);
        }
    }

}