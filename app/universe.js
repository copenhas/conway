/*jshint node:true strict:false */

var cell = require('./cell');

exports.Universe = function (cols, rows) {
    this._cols = cols;
    this._rows = rows;
    this.cells = [];

    var r = 0,
        c = 0,
        current = null;

    for(r = 0; r < rows; r++){
        current = this.cells[r] = [];

        for(c = 0; c < cols; c++) {
            current[c] = cell.dead;
        }
    }
};

exports.Universe.prototype = {
    columns: function () {
        return this._cols;
    },

    rows: function () {
        return this._rows;
    },

    cell: function (col, row) {
        return this.cells[row][col];
    },

    next: function () {
        var nextGeneration = [],
            self = this;

        for(var r = 0; r < this._rows; r++) {
            nextGeneration[r] = [];
        }

        this.eachCell(function (column, row, cell) {
            var adjacents = self.neighbors(column, row);
            nextGeneration[row][column] = cell.next(adjacents);
        });

        this.cells = nextGeneration;
    },

    neighbors: function (col, row) {
        var adjacents = [],
            rows = [],
            cols = [],
            self = this;

        cols.push(col);

        if (col === 0) {
            cols.push(this._cols - 1);
            cols.push(col + 1);
        }
        else if (col === (this._cols - 1)) {
            cols.push(col - 1);
            cols.push(0);
        }
        else if (col > 0) {
            cols.push(col - 1);
            cols.push(col + 1);
        }

        rows.push(row);

        if (row === 0) {
            rows.push(this._rows - 1);
            rows.push(row + 1);
        }
        else if (row === (this._rows - 1)) {
            rows.push(row - 1);
            rows.push(0);
        }
        else if (row > 0) {
            rows.push(row - 1);
            rows.push(row + 1);
        }

        (function () {
            var r = 0,
                currentRow = 0,
                c = 0,
                currentCol = 0;

            for(r = 0; r < 3; r += 1) {
                currentRow = rows[r];

                for(c = 0; c < 3; c += 1) {
                    currentCol = cols[c];
                    
                    if(currentRow !== row || currentCol !== col) {
                        adjacents.push(self.cells[currentRow][currentCol]);
                    }
                }
            }
        }());

        return adjacents;
    },

    eachCell: function (callback) {
        for (var r = 0; r < this._rows; r++) {
            for (var c = 0; c < this._cols; c++) {
                callback(c, r, this.cells[r][c]);
            }
        }
    }
};
