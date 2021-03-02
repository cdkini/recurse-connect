'use strict';
exports.__esModule = true;
var BinaryHeapStrategy = /** @class */ (function() {
	function BinaryHeapStrategy(options) {
		this.comparator = options.comparator;
		this.data = options.initialValues ? options.initialValues.slice(0) : [];
		this._heapify();
	}
	BinaryHeapStrategy.prototype._heapify = function() {
		if (this.data.length > 0) {
			for (var i = 0; i < this.data.length; i++) {
				this._bubbleUp(i);
			}
		}
	};
	BinaryHeapStrategy.prototype.queue = function(value) {
		this.data.push(value);
		this._bubbleUp(this.data.length - 1);
	};
	BinaryHeapStrategy.prototype.dequeue = function() {
		var ret = this.data[0];
		var last = this.data.pop();
		if (this.data.length > 0 && last !== undefined) {
			this.data[0] = last;
			this._bubbleDown(0);
		}
		return ret;
	};
	BinaryHeapStrategy.prototype.peek = function() {
		return this.data[0];
	};
	BinaryHeapStrategy.prototype.clear = function() {
		this.data.length = 0;
	};
	BinaryHeapStrategy.prototype._bubbleUp = function(pos) {
		while (pos > 0) {
			var parent_1 = (pos - 1) >>> 1;
			if (this.comparator(this.data[pos], this.data[parent_1]) < 0) {
				var x = this.data[parent_1];
				this.data[parent_1] = this.data[pos];
				this.data[pos] = x;
				pos = parent_1;
			} else {
				break;
			}
		}
	};
	BinaryHeapStrategy.prototype._bubbleDown = function(pos) {
		var last = this.data.length - 1;
		while (true) {
			var left = (pos << 1) + 1;
			var right = left + 1;
			var minIndex = pos;
			if (
				left <= last &&
				this.comparator(this.data[left], this.data[minIndex]) < 0
			) {
				minIndex = left;
			}
			if (
				right <= last &&
				this.comparator(this.data[right], this.data[minIndex]) < 0
			) {
				minIndex = right;
			}
			if (minIndex !== pos) {
				var x = this.data[minIndex];
				this.data[minIndex] = this.data[pos];
				this.data[pos] = x;
				pos = minIndex;
			} else {
				break;
			}
		}
		return void 0;
	};
	return BinaryHeapStrategy;
})();
exports['default'] = BinaryHeapStrategy;
