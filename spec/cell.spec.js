/*jshint strict:false node:true */
/*globals describe, it, expect, beforeEach */
var cell = require('../app/cell');

var deadNeighbors = function() {
    return [
        cell.dead,
        cell.dead,
        cell.dead,
        cell.dead,
        cell.dead,
        cell.dead,
        cell.dead,
        cell.dead
    ];
};

describe('a single cell', function () {
    var newCell = cell.dead;

    it("keeps track of it's own life", function () {
        expect(newCell.isAlive).toBeDefined();
        expect(typeof newCell.next === 'function').toBeTruthy();
    });

    it("has a read only property", function () {
        var orig = newCell.isAlive();
        newCell.isAlive(!orig);

        expect(newCell.isAlive()).toEqual(orig);
    });

    it('has a function to create the next generation', function () {
        expect(newCell.next).toBeDefined();
        expect(typeof newCell.next === 'function').toBeTruthy();
    });

    it('can only generate the next generation when 8 neighbors are given',
    function () {
        expect(function () {
            newCell.next([]);
        }).toThrow();

        expect(function () {
            newCell.next(deadNeighbors());
        }).not.toThrow();
    });

    describe('when cell is alive', function () {
        var alive = cell.alive,
            neighbors = [];

        beforeEach(function () {
            neighbors = deadNeighbors();
        });

        it('is alive', function () {
            expect(alive.isAlive()).toBeTruthy();
        });

        it('will have a dead next generation when < 2 neighbors are alive',
        function () {
            var next = alive.next(neighbors);

            //0 alive neighbors
            expect(next.isAlive()).toBeFalsy();

            //1 alive neighbor
            neighbors[0] = cell.alive;
            expect(next.isAlive()).toBeFalsy();
        });

        it('will have a living next generation when 2 neighbors are alive',
        function () {
            neighbors.splice(0, 2, 
                             cell.alive, 
                             cell.alive);

            var next = alive.next(neighbors);

            expect(next.isAlive()).toBeTruthy();
        });

        it('will have a living next generation when 3 neighbors are alive',
        function () {
            neighbors.splice(0, 3, 
                             cell.alive, 
                             cell.alive, 
                             cell.alive);

            var next = alive.next(neighbors);

            expect(next.isAlive()).toBeTruthy();
        });

        it('will have a dead next generation when > 3 neighbors are alive',
        function () {
            var i = 3,
                max = neighbors.length,
                next = null;

            neighbors.splice(0, 3, 
                             cell.alive, 
                             cell.alive, 
                             cell.alive);

            for(; i < max; i++) {
                neighbors[i] = cell.alive;
                next = alive.next(neighbors);
                expect(next.isAlive()).toBeFalsy();
            }
        });
    });

    describe('when cell is dead', function () {
        var dead = cell.dead,
            neighbors = [];

        beforeEach(function () {
            neighbors = deadNeighbors();
        });

        it('is dead', function () { 
            expect(dead.isAlive()).toBeFalsy();
        });

        it('will have a living next generation when 3 neighbors are alive',
        function () {
            neighbors.splice(0, 3, 
                             cell.alive, 
                             cell.alive, 
                             cell.alive);

            var next = dead.next(neighbors);

            expect(next.isAlive()).toBeTruthy();
        });
    });
});
