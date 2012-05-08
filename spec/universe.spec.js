var universe = require('../app/universe'),
    cell = require('../app/cell');

describe('Conway universe', function () {
    var create = function (columns, rows) {
        return new universe.Universe(columns, rows);
    };

    it('is created with the number of columns and rows', function () {
        var uni = create(10, 15);

        expect(uni.columns()).toEqual(10);
        expect(uni.rows()).toEqual(15);
    });

    it('has a cells array that contains the rows', function () {
        var uni = create(10, 10);

        expect(uni.cells.length).toEqual(10);
        expect(uni.cells[0].length).toEqual(10);
    });

    it('can retrieve a cell by column and row', function () {
        var uni = create(10,10);

        expect(uni.cell(3,2)).toBe(uni.cells[2][3]);
    });

    it('defaults cells to dead', function () {
        var uni = create(10, 10);
        expect(uni.cell(0, 0)).toBe(cell.dead);
    });

    it('allows iterating over each cell', function () {
        var uni = create(3, 3),
            callCount = 0;

        uni.eachCell(function (column, row, cell) {
            callCount++;
        });

        expect(callCount).toEqual(uni.columns() * uni.rows());
    });

    it('can create the next generation', function () {
        var uni = create(10, 10),
            current = uni.cells;

        expect(function() { 
            uni.next(); 
        }).not.toThrow();

        expect(current).not.toBe(uni.cells);
    });

    it("can determine a cell's adjacent neighbors", function () {
        var uni = create(5, 5),
            adjacents = [];

        uni.cells[0][0] = cell.alive;
        adjacents = uni.neighbors(1, 1);

        expect(adjacents.length).toEqual(8);
        expect(adjacents).toContain(cell.alive);
    });

    describe("when determining a cell's neighbors", function () {
        var uni = null;

        beforeEach(function () {
            uni = create(10, 10);

            //yes this replaces all cells with numbers
            //the neighbors algo doesn't depend on anything
            //on a cell, just the location in the world
            var count = 0;
            for(var r = 0; r < 10; r += 1) {
                for(var c = 0; c < 10; c += 1) {
                    uni.cells[r][c] = count;
                    count++;
                }
            }
        });

        describe("if the cell is at the bottom left corner", function () {
            var adjacents = null;

            beforeEach(function () {
                adjacents = uni.neighbors(0, 9);
            });

            it('has 8 neighbors', function () {
                //should always have 8 neighbors
                expect(adjacents.length).toEqual(8);
            });

            it('has neighbors immediately to the right, top, and top right',
            function () {
                //top middle
                expect(adjacents).toContain(uni.cell(0, 8));
                //top right
                expect(adjacents).toContain(uni.cell(1, 8));
                //right
                expect(adjacents).toContain(uni.cell(1, 9));
            });

            it('has a neighbor immediately to the right', function () {
                expect(adjacents).toContain(uni.cell(1, 9));
            });

            it("has a left and top left neighbor on the last column " + 
               "due to wrapping horizontally", 
            function () {
                //left
                expect(adjacents).toContain(uni.cell(9, 9));
                //top left
                expect(adjacents).toContain(uni.cell(9, 8));
            });

            it("has it's bottom left neighbor at the opposite corner " +
               "due to horizontally and vertically wrapping",
            function () {
                expect(adjacents).toContain(uni.cell(9, 0));
            }); 

            it("has it's bottom middle and bottom right neighbors " +
               "on the top row due to vertically wrapping",
            function () {
                //bottom middle
                expect(adjacents).toContain(uni.cell(0, 0));
                //bottom right
                expect(adjacents).toContain(uni.cell(1, 0));
            });
        });

        describe("if the cell is on the top row middle column", function () {
            var adjacents = null;

            beforeEach(function () {
                adjacents = uni.neighbors(5, 0);
            });

            it('has 8 neighbors', function () {
                //should always have 8 neighbors
                expect(adjacents.length).toEqual(8);
            });
            
            it('has neighbors immediately to the left and right', function () {
                //left
                expect(adjacents).toContain(uni.cell(4, 0));
                //right
                expect(adjacents).toContain(uni.cell(6, 0));
            });

            it('has neighbors directly below it', function () {
                //bottom 3
                expect(adjacents).toContain(uni.cell(4, 1));
                expect(adjacents).toContain(uni.cell(5, 1));
                expect(adjacents).toContain(uni.cell(6, 1));
            });

            it('has neighbors at the last row due to wrapping vertically',
            function () {
                //top 3 wraps vertically to bottom of world
                expect(adjacents).toContain(uni.cell(4, 9));
                expect(adjacents).toContain(uni.cell(5, 9));
                expect(adjacents).toContain(uni.cell(6, 9));
            });
        });

        describe("if the cell is on the bottom row middle column", function () {
            var adjacents = null;

            beforeEach(function () {
                adjacents = uni.neighbors(5, 9);
            });

            it('has 8 neighbors', function () {
                //should always have 8 neighbors
                expect(adjacents.length).toEqual(8);
            });
            
            it('has neighbors immediately to the left and right', function () {
                //left
                expect(adjacents).toContain(uni.cell(4, 9));
                //right
                expect(adjacents).toContain(uni.cell(6, 9));
            });

            it('has neighbors directly above it', function () {
                //top 3
                expect(adjacents).toContain(uni.cell(4, 8));
                expect(adjacents).toContain(uni.cell(5, 8));
                expect(adjacents).toContain(uni.cell(6, 8));
            });

            it('has neighbors at the first row due to wrapping vertically',
            function () {
                //top 3 wraps vertically to bottom of world
                expect(adjacents).toContain(uni.cell(4, 0));
                expect(adjacents).toContain(uni.cell(5, 0));
                expect(adjacents).toContain(uni.cell(6, 0));
            });
        });

        describe('if the cell is at the first column middle row', function () {
            var adjacents = null;

            beforeEach(function () {
                adjacents = uni.neighbors(0, 5);
            });

            it('has 8 neighbors', function () {
                //should always have 8 neighbors
                expect(adjacents.length).toEqual(8);
            });

            it('has neighbors at the last column due to wrapping horizontally',
            function () {
                //top left 
                expect(adjacents).toContain(uni.cell(9, 4));
                //left 
                expect(adjacents).toContain(uni.cell(9, 5));
                // bottom left
                expect(adjacents).toContain(uni.cell(9, 6));
            });

            it('has neighbors directly above and below', function () {
                //above
                expect(adjacents).toContain(uni.cell(0, 4));
                //below
                expect(adjacents).toContain(uni.cell(0, 6));
            });

            it("has neighbors to it's right", function () {
                //top right 
                expect(adjacents).toContain(uni.cell(1, 4));
                //right
                expect(adjacents).toContain(uni.cell(1, 5));
                //bottom right 
                expect(adjacents).toContain(uni.cell(1, 6));
            });
        });

        describe('if the cell is at the last column middle row', function (){
            var adjacents = null;

            beforeEach(function () {
                adjacents = uni.neighbors(9, 5);
            });

            it('has 8 neighbors', function () {
                //should always have 8 neighbors
                expect(adjacents.length).toEqual(8);
            });

            it("has it's right neighbors on the first column" +
               "due to horizontally wrapping",
            function () {
                //top right 
                expect(adjacents).toContain(uni.cell(0, 4));
                //right
                expect(adjacents).toContain(uni.cell(0, 5));
                //bottom right 
                expect(adjacents).toContain(uni.cell(0, 6));
            });

            it('has neighbors directly to the left', function () {
                //top left 
                expect(adjacents).toContain(uni.cell(8, 4));
                //left
                expect(adjacents).toContain(uni.cell(8, 5));
                //bottom left 
                expect(adjacents).toContain(uni.cell(8, 6));
            });

            it('has neighbors directly above and below', function () {
                //top middle
                expect(adjacents).toContain(uni.cell(9, 4));
                //bottom middle 
                expect(adjacents).toContain(uni.cell(9, 6));
            });
        });

        describe('if the cell is in the middle', function () {
            var adjacents = null;

            beforeEach(function () {
                adjacents = uni.neighbors(5, 5);
            });

            it('has 8 neighbors', function () {
                //should always have 8 neighbors
                expect(adjacents.length).toEqual(8);
            });

            it('has neighbors directly around it', function () {
                //top 3
                expect(adjacents).toContain(uni.cell(4, 4));
                expect(adjacents).toContain(uni.cell(5, 4));
                expect(adjacents).toContain(uni.cell(6, 4));
                //left
                expect(adjacents).toContain(uni.cell(4, 5));
                //right
                expect(adjacents).toContain(uni.cell(6, 5));
                //bottom 3
                expect(adjacents).toContain(uni.cell(4, 6));
                expect(adjacents).toContain(uni.cell(5, 6));
                expect(adjacents).toContain(uni.cell(6, 6));

            });
        });
    });
});
