'use strict';
exports.__esModule = true;
// Source: https://github.com/RonPenton/ts-priority-queue/blob/master/src/PriorityQueue.ts
var BinaryHeapStrategy_1 = require('./BinaryHeapStrategy');
var PriorityQueue = /** @class */ (function() {
	function PriorityQueue(options) {
		this._length = 0;
		this._length = options.initialValues ? options.initialValues.length : 0;
		this.strategy = new BinaryHeapStrategy_1['default'](options);
	}
	Object.defineProperty(PriorityQueue.prototype, 'length', {
		get: function() {
			return this._length;
		},
		enumerable: false,
		configurable: true,
	});
	PriorityQueue.prototype.queue = function(value) {
		this._length++;
		this.strategy.queue(value);
	};
	PriorityQueue.prototype.dequeue = function() {
		if (!this._length) throw new Error('Empty queue');
		this._length--;
		return this.strategy.dequeue();
	};
	PriorityQueue.prototype.peek = function() {
		if (!this._length) throw new Error('Empty queue');
		return this.strategy.peek();
	};
	PriorityQueue.prototype.clear = function() {
		this._length = 0;
		this.strategy.clear();
	};
	return PriorityQueue;
})();
exports['default'] = PriorityQueue;
