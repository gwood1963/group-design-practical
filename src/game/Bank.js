/*
The aim of this file is to provide a way to keep track of the economy of the user,
particularly for round 2
*/

export class Bank {
    totalMoney;
    money; //invariant 0 <= money <= totalMoney
    roadLengthCost; //costs
    roadWidthCost; //for capacities
    roadLengthUnit; //unit length and width
    roadWidthUnit;



    constructor(totalMoney) {
        this.totalMoney = totalMoney;
        this.money = totalMoney;
    }

    setTotalMoney(money) {
        this.totalMoney = money;
        this.money = totalMoney;
    }

    moneyLeft() {
        return this.money;
    }

    roadCost(width, length) {
        const cost = width * this.roadWidthCost / this.roadWidthUnit + length * this.roadLengthCost / this.roadLengthUnit;
        return cost;
    }

    /**
     * 
     * @param {Number} width - capacity of the new road
     * @param {Number} length - length of the new road 
     */
    buildRoad(width, length) {
        const cost = this.roadCost(width, length);
        this.money -= cost;
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