/*jshint node:true strict:false */

var alive = null,
    dead = {
        _alive: false,

        isAlive: function () {
            return this._alive;
        },

        next: function (neighbors) {
            if (neighbors.length !== 8) {
                throw new Error('expected to have 8 adjacent neighbors');
            }

            var aliveCount = 0;

            neighbors.forEach(function (cell) {
                if (cell.isAlive()) {
                    aliveCount++;
                }
            });

            if (aliveCount === 3 ) { return alive; }
            if (this._alive && aliveCount === 2 ) { return alive; }
            return dead;
        }
    };

alive = Object.create(dead);
alive._alive = true;

exports.dead = dead;
exports.alive = alive;
