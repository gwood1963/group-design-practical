/*
The aim of this file is to provide a way to store graphs as an object while running the application
*/

//Due to errors in references, may have to create new graphs for everything; essentially make graphs final/immutable. 

export class Graph {
    //nodes = [];
    n;
    A = [
        [
            [0, 0]
        ]
    ]; // list of (j, capacity)'s in row i

    /**
     * If you want to instantiate a graph with no edges, simply use only one parameter numNodes
     * @param {Int} numNodes 
     * @param {Number[][][]} adjacencyList 
     */
    constructor(numNodes, adjacencyList) {
        this.n = new Number(numNodes);
        if (adjacencyList == undefined) {
            this.deleteAllRoads();
            return;
        }
        var B = adjacencyList; //Adjacency List of elements of the form (j, capacity) in row i
        this.A = [];
        for (var i = 0; i < this.n; i++) {
            this.A.push([]);
            for (var j = 0; j < B[i].length; j++) {
                this.A[i].push([new Number(B[i][j][0]), new Number(B[i][j][1])]);
            }
        }
    }

    /**
     * Empties A
     */
    deleteAllRoads() {
        var B = [];
        for (var i = 0; i < this.n; i++) {
            B.push([]);
        }
        this.A = B;
    }

    duplicate(G) {
        this.n = new Number(G.dim());
        this.A = [];
        var B = G.getA();
        for (var i = 0; i < this.n; i++) {
            this.A.push([]);
            for (var j = 0; j < B[i].length; j++) {
                this.A[i].push([new Number(B[i][j][0]), new Number(B[i][j][1])]);
            }
        }
    }

    setParams(n, A) {
        this.n = new Number(n);
        this.A = [];
        for (var i = 0; i < this.n; i++) {
            this.A.push([]);
            for (var j = 0; j < A[i].length; j++) {
                this.A[i].push([new Number(A[i][j][0]), new Number(A[i][j][1])]);
            }
        }
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

    /* adjList() {
        //Uncaught TypeError: G.adjList is not a function
        //does not show up with getA()... weird.
        /* var temp = new Array(this.n).fill([]);
        for (var i = 0; i < this.n; i++) {
            for (var k = 0; k < this.A[i].length; k++) {
                temp[i].push(this.A[i][k]);
                console.log(temp);
            }
        }
        return temp; 
        return this.A;
    } */

    getA() {
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

    /**
     * 
     * @returns The adjacency matrix without capacities in form Number[][]
     */
    getAWithoutCaps() {
        var res = [];
        for (var i = 0; i < this.n; i++) {
            var temp = [];
            for (var k = 0; k < this.A[i].length; k++) {
                temp.push(new Number(this.A[i][k][0]));
            }
            res.push(temp);
        }

        return res;
    }

    adjMatrix() {
        /* var m = new Array(n).fill(new Array(n).fill(0));
        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < A[i].length; j++) {
                m[i][A[i][j][0]] = 1; //edge from i to j (A[i][j][0])
            }
        }
        return m; */
        var m = [];
        for (var i = 0; i < this.n; i++) {
            var temp = [];
            for (var j = 0; j < this.n; j++) {
                temp.push(0);
            }
            m.push(temp);
        }

        console.log("matrix")
        console.log(m);
        //var m = new Array(this.n)[new Array(this.n)[new Array(2)[0]]]; //[0, 0] if no edge, [1, cap] if has edge
        console.log(this.A);
        for (var i = 0; i < this.n; i++) {
            console.log(this.A[i].length)
            for (var j = 0; j < this.A[i].length; j++) {
                //console.log(i + " " + this.A[i][j][0] + " " + this.A[i][j][1]);
                m[i][this.A[i][j][0]] = 1; //edge from i to j (A[i][j][0])
            }
        }
        console.log("end operations")
        return m;
    }

    capMatrix() {
        /* var m = new Array(n).fill(new Array(n).fill(0));
        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < A[i].length; j++) {
                m[i][A[i][j][0]] = A[i][j][1] //capacity of edge from i to j (A[i][j][0])
            }
        }
        return m; */
        var m = [];
        for (var i = 0; i < this.n; i++) {
            var temp = [];
            for (var j = 0; j < this.n; j++) {
                temp.push(0);
            }
            m.push(temp);
        }

        //console.log("cap matrix")
        //console.log(m);
        //var m = new Array(this.n)[new Array(this.n)[new Array(2)[0]]]; //[0, 0] if no edge, [1, cap] if has edge
        //console.log(this.A);
        for (var i = 0; i < this.n; i++) {
            console.log(this.A[i].length)
            for (var j = 0; j < this.A[i].length; j++) {
                //console.log(i + " " + this.A[i][j][0] + " " + this.A[i][j][1]);
                m[i][this.A[i][j][0]] = this.A[i][j][1]; //edge from i to j (A[i][j][0])
            }
        }
        //console.log("end operations")
        return m;
    }

    adjMatrixWithCap() {
        //for some reason outputting a matrix with wrong entries
        //again due to referencing the same point in memory?
        //var m = new Array(this.n).fill(new Array(this.n).fill([0, 0])); //[0, 0] if no edge, [1, cap] if has edge

        //neccessary to do this as the other method fills each row with identical references
        var m = [];
        for (var i = 0; i < this.n; i++) {
            var temp = [];
            for (var j = 0; j < this.n; j++) {
                temp.push([0, 0]);
            }
            m.push(temp);
        }

        //console.log("matrix with cap")
        //console.log(m);
        //var m = new Array(this.n)[new Array(this.n)[new Array(2)[0]]]; //[0, 0] if no edge, [1, cap] if has edge
        //console.log(this.A);
        for (var i = 0; i < this.n; i++) {
            //console.log(this.A[i].length)
            for (var j = 0; j < this.A[i].length; j++) {
                //console.log(i + " " + this.A[i][j][0] + " " + this.A[i][j][1]);
                m[i][this.A[i][j][0]] = [1, this.A[i][j][1]]; //edge from i to j (A[i][j][0])
            }
        }
        //console.log("end operations")
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