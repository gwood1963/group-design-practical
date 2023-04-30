/*
The aim of this file is to provide a way to keep track of the economy of the user,
particularly for round 2
*/

export class Bank {
    totalMoney;
    money; //invariant 0 <= money <= totalMoney
    roadLengthCost = 1; //costs
    roadWidthCost = 1; //for capacities
    roadLengthUnit = 1; //unit length and width
    roadWidthUnit = 1;



    constructor(totalMoney) {
        this.setTotalMoney(totalMoney);
        // this.totalMoney = totalMoney;
        // this.money = totalMoney;
    }

    /**
     * Set parameters
     * @param {Number} rlc - Road Length Cost
     * @param {Number} rwc - Road Width Cost
     * @param {Number} rlu - Road Length Unit
     * @param {Number} rwu - Road Width Unit
     */
    setParams(rlc, rwc, rlu, rwu) {
        this.roadLengthCost = rlc;
        this.roadWidthCost = rwc;
        this.roadLengthUnit = rlu;
        this.roadWidthUnit = rwu;
    }

    getParams() {
        var params = [];
        params.push(this.totalMoney);
        params.push(this.roadLengthCost);
        params.push(this.roadWidthCost);
        params.push(this.roadLengthUnit);
        params.push(this.roadWidthUnit);
        return params;
    }

    setTotalMoney(money) {
        this.totalMoney = money;
        this.money = this.totalMoney;
    }

    moneyLeft() {
        //console.log(this.money);
        return this.money;
    }

    /**
     * 
     * @param {Number} width 
     * @param {Number} length 
     * @returns the (floor) cost of the road based on our parameters
     */
    roadCost(width, length) {
        console.log(width);
        console.log(length);
        const cost = (width * this.roadWidthCost / this.roadWidthUnit) * (length * this.roadLengthCost / this.roadLengthUnit);
        return Math.floor(cost);
    }

    /**
     * 
     * @param {Number} width - capacity of the new road
     * @param {Number} length - length of the new road 
     */
    buildRoad(width, length) {
        const cost = this.roadCost(width, length);
        console.log(cost);
        this.money = this.money - cost;
        //console.log(this.money);
        return cost;
    }

    /**
     * Return cost dollars to the bank
     * @param {Number} cost 
     */
    deleteRoad(cost) {
        this.money += cost;
    }





}