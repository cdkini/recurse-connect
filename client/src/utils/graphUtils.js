'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function(resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function(thisArg, body) {
		var _ = {
				label: 0,
				sent: function() {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function() {
					return this;
				}),
			g
		);
		function verb(n) {
			return function(v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.');
			while (_)
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y['return']
									: op[0]
									? y['throw'] || ((t = y['return']) && t.call(y), 0)
									: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
var __spreadArrays =
	(this && this.__spreadArrays) ||
	function() {
		for (var s = 0, i = 0, il = arguments.length; i < il; i++)
			s += arguments[i].length;
		for (var r = Array(s), k = 0, i = 0; i < il; i++)
			for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
				r[k] = a[j];
		return r;
	};
exports.__esModule = true;
exports.Pathfinder = exports.Visualizer = void 0;
var PriorityQueue_1 = require('../utils/PriorityQueue');
/** Used to change node/edge colors during graph traversal. */
var Color;
(function(Color) {
	Color['Success'] = 'green';
	Color['Failure'] = 'red';
	Color['Update'] = 'orange';
	Color['Info'] = 'blue';
	Color['BatchNode'] = 'black';
	Color['RecurserNode'] = 'grey';
})(Color || (Color = {}));
/**
 * Responsible for visualization of a given graph traversal.
 * @attr {any} fgRef - Reference to ForceGraph2D object used in visualization
 * @attr {Dispatch<SetStateAction<RecurserGraph>} setGraphData - useState setter for graph data
 * @attr {Dispatch<SetStateAction><'error' | 'warning' | 'info' | 'success' | undefined>} setAlertSeverity - useState func for alert color
 * @attr {Dispatch<SetStateAction><'error' | 'warning' | 'info' | 'success' | undefined>} setAlertSeverity - useState func for alert message
 */
var Visualizer = /** @class */ (function() {
	function Visualizer(fgRef, setGraphData, setAlertSeverity, setAlertMessage) {
		this.fgRef = fgRef;
		this.setGraphData = setGraphData;
		this.setAlertSeverity = setAlertSeverity;
		this.setAlertMessage = setAlertMessage;
	}
	/** Center graph on input node's coordinates. */
	Visualizer.prototype.center = function(x, y, ms) {
		this.fgRef.current.centerAt(x, y, ms);
	};
	/** Modify alert state through useState hooks.  */
	Visualizer.prototype.updateAlert = function(status, message) {
		this.setAlertSeverity(status);
		this.setAlertMessage(message);
	};
	/** Used to pause between visualization states. */
	Visualizer.prototype.sleep = function(ms) {
		return new Promise(function(resolve) {
			return setTimeout(resolve, ms);
		});
	};
	/** Resets graph colors to grayscale between visualizations. */
	Visualizer.prototype.prepareGraph = function(userNode, graphData) {
		for (var _i = 0, _a = graphData.links; _i < _a.length; _i++) {
			var edge = _a[_i];
			delete edge.color;
		}
		for (var _b = 0, _c = graphData.nodes; _b < _c.length; _b++) {
			var node = _c[_b];
			if (node.id === userNode.id) {
				node.color = Color.Success;
			} else if (node.profilePath) {
				node.color = Color.RecurserNode;
			} else {
				node.color = Color.BatchNode;
			}
		}
		this.setGraphData(graphData);
	};
	/** Determines the appropriate string representation of a RecurserNode. */
	Visualizer.prototype.stringifyNode = function(node) {
		if (node.profilePath) {
			return node.name + ' (' + node.batchShortName + ')';
		}
		return node.name;
	};
	/** Highlights the final path in green. */
	Visualizer.prototype.displayResultingPath = function(path) {
		for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
			var edge = path_1[_i];
			edge.source.color = Color.Success;
			edge.color = Color.Success;
			edge.target.color = Color.Success;
		}
	};
	return Visualizer;
})();
exports.Visualizer = Visualizer;
/** Driver class responsible for determination of paths to be used in visualization.
 *  @attr {RecurserNode} userNode - The graph node corresponding to the user
 *  @attr {RecurserGraph} graphData - The input data used to generate the force graph
 *  @attr {Map<RecurserId, RecurserNode>} recurserNodeMap - Performant lookup from id to node object
 *  @attr {Map<RecurserId, RecurserEdge>} recurserEdgeMap - Performant lookup from id to related edges
 *  @attr {Alerter} alerter - Responsible for updating alert bar with graph states
 */
var Pathfinder = /** @class */ (function() {
	function Pathfinder(userNode, graphData, visualizer) {
		this.userNode = userNode;
		this.graphData = graphData;
		this.recurserNodeMap = this.getRecurserNodeMap(this.graphData.nodes);
		this.recurserEdgeMap = this.getRecurserEdgeMap(this.graphData.links);
		this.visualizer = visualizer;
	}
	/** Helper method to generate recurserNodeMap attribute */
	Pathfinder.prototype.getRecurserNodeMap = function(nodes) {
		return nodes.reduce(function(map, obj) {
			map.set(obj.id, obj);
			return map;
		}, new Map());
	};
	/** Helper method to generate recurserEdgeMap attribute */
	Pathfinder.prototype.getRecurserEdgeMap = function(edges) {
		return edges.reduce(function(map, obj) {
			map.has(obj.source.id)
				? map.get(obj.source.id).push(obj)
				: map.set(obj.source.id, [obj]);
			map.has(obj.target.id)
				? map.get(obj.target.id).push(obj)
				: map.set(obj.target.id, [obj]);
			return map;
		}, new Map());
	};
	/**
	 * Performs an unweighted depth-first search on graph data, visualizing state at each step.
	 * @param {AlgoArgs} args - Source, target, and animation delay
	 */
	Pathfinder.prototype.dfs = function(args) {
		return __awaiter(this, void 0, void 0, function() {
			var start,
				stack,
				visited,
				targetPath,
				item,
				id,
				currNode,
				currPath,
				currEdge,
				end,
				paths,
				i;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						this.visualizer.prepareGraph(this.userNode, this.graphData);
						this.visualizer.updateAlert(
							'info',
							'Starting DFS on an unweighted graph containing ' +
								this.graphData.nodes.length +
								' vertices and ' +
								this.graphData.links.length +
								' edges!',
						);
						start = new Date().getTime();
						this.visualizer.center(this.userNode.x, this.userNode.y, 100);
						return [4 /*yield*/, this.visualizer.sleep(2000)];
					case 1:
						_a.sent();
						stack = [
							[args.sourceId, [this.recurserEdgeMap.get(args.sourceId)[0]]],
						];
						visited = new Set();
						targetPath = [];
						_a.label = 2;
					case 2:
						if (!(stack.length > 0)) return [3 /*break*/, 8];
						item = stack.pop();
						id = item[0];
						currNode = this.recurserNodeMap.get(id);
						currPath = item[1];
						currEdge = currPath[currPath.length - 1];
						if (visited.has(id)) {
							return [3 /*break*/, 2];
						}
						if (!currNode.profilePath) {
							this.visualizer.center(currNode.x, currNode.y, 1000);
						}
						if (currNode.id === args.targetId) {
							end = new Date().getTime();
							this.visualizer.updateAlert(
								'success',
								'Found ' +
									this.visualizer.stringifyNode(currNode) +
									' in ' +
									(end - start) / 1000 +
									"'s after visiting " +
									visited.size +
									'/' +
									this.graphData.nodes.length +
									' nodes. Note that this is not necessarily the shortest path; DFS only guarantees a valid path!',
							);
							targetPath = currPath;
							return [3 /*break*/, 8];
						}
						if (currNode.id === this.userNode.id) {
							currNode.color = Color.Success;
						} else if (!currNode.profilePath) {
							currNode.color = Color.BatchNode;
						} else {
							currEdge.color = Color.Failure;
							currNode.color = Color.Failure;
							this.visualizer.updateAlert(
								'error',
								'Marking ' +
									this.visualizer.stringifyNode(currNode) +
									' as visited',
							);
						}
						return [4 /*yield*/, this.visualizer.sleep(args.animationDelay)];
					case 3:
						_a.sent();
						delete currEdge.color;
						visited.add(currNode.id);
						paths = this.recurserEdgeMap.get(id);
						this.sortByNodeType(paths);
						i = 0;
						_a.label = 4;
					case 4:
						if (!(i < paths.length)) return [3 /*break*/, 7];
						if (!visited.has(paths[i].target.id)) {
							stack.push([
								paths[i].target.id,
								__spreadArrays(currPath).concat(paths[i]),
							]);
							this.visualizer.updateAlert(
								'warning',
								'Marking ' +
									this.visualizer.stringifyNode(paths[i].target) +
									' for later',
							);
							if (paths[i].target.profilePath) {
								paths[i].target.color = Color.Update;
							}
							paths[i].color = Color.Update;
						}
						if (!visited.has(paths[i].source.id)) {
							stack.push([
								paths[i].source.id,
								__spreadArrays(currPath).concat(paths[i]),
							]);
							this.visualizer.updateAlert(
								'warning',
								'Marking ' +
									this.visualizer.stringifyNode(paths[i].source) +
									' for later',
							);
							if (paths[i].source.profilePath) {
								paths[i].source.color = Color.Update;
							}
							paths[i].color = Color.Update;
						}
						return [4 /*yield*/, this.visualizer.sleep(args.animationDelay)];
					case 5:
						_a.sent();
						delete paths[i].color;
						_a.label = 6;
					case 6:
						i++;
						return [3 /*break*/, 4];
					case 7:
						return [3 /*break*/, 2];
					case 8:
						this.visualizer.displayResultingPath(targetPath);
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 * Performs an unweighted breadth-first search on graph data, visualizing state at each step.
	 * @param {AlgoArgs} args - Source, target, and animation delay
	 */
	Pathfinder.prototype.bfs = function(args) {
		return __awaiter(this, void 0, void 0, function() {
			var start,
				queue,
				visited,
				targetPath,
				item,
				id,
				currNode,
				currPath,
				currEdge,
				end,
				paths,
				i;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						this.visualizer.prepareGraph(this.userNode, this.graphData);
						this.visualizer.updateAlert(
							'info',
							'Starting BFS on an unweighted graph containing ' +
								this.graphData.nodes.length +
								' vertices and ' +
								this.graphData.links.length +
								' edges!',
						);
						start = new Date().getTime();
						this.visualizer.center(this.userNode.x, this.userNode.y, 100);
						return [4 /*yield*/, this.visualizer.sleep(2000)];
					case 1:
						_a.sent();
						queue = [
							[args.sourceId, [this.recurserEdgeMap.get(args.sourceId)[0]]],
						];
						visited = new Set();
						targetPath = [];
						_a.label = 2;
					case 2:
						if (!(queue.length > 0)) return [3 /*break*/, 8];
						item = queue.shift();
						id = item[0];
						currNode = this.recurserNodeMap.get(id);
						currPath = item[1];
						currEdge = currPath[currPath.length - 1];
						if (visited.has(id)) {
							return [3 /*break*/, 2];
						}
						if (!currNode.profilePath) {
							this.visualizer.center(currNode.x, currNode.y, 1000);
						}
						if (currNode.id === args.targetId) {
							end = new Date().getTime();
							this.visualizer.updateAlert(
								'success',
								'Found ' +
									this.visualizer.stringifyNode(currNode) +
									' in ' +
									(end - start) / 1000 +
									"'s after visiting " +
									visited.size +
									'/' +
									this.graphData.nodes.length +
									' nodes. This is the shortest path in an unweighted graph!',
							);
							targetPath = currPath;
							return [3 /*break*/, 8];
						}
						if (currNode.id === this.userNode.id) {
							currNode.color = Color.Success;
						} else if (!currNode.profilePath) {
							currNode.color = Color.BatchNode;
						} else {
							currEdge.color = Color.Failure;
							currNode.color = Color.Failure;
							this.visualizer.updateAlert(
								'error',
								'Marking ' +
									this.visualizer.stringifyNode(currNode) +
									' as visited',
							);
						}
						return [4 /*yield*/, this.visualizer.sleep(args.animationDelay)];
					case 3:
						_a.sent();
						delete currEdge.color;
						visited.add(currNode.id);
						paths = this.recurserEdgeMap.get(id);
						this.sortByNodeType(paths);
						i = 0;
						_a.label = 4;
					case 4:
						if (!(i < paths.length)) return [3 /*break*/, 7];
						if (!visited.has(paths[i].target.id)) {
							queue.push([
								paths[i].target.id,
								__spreadArrays(currPath).concat(paths[i]),
							]);
							this.visualizer.updateAlert(
								'warning',
								'Marking ' +
									this.visualizer.stringifyNode(paths[i].target) +
									' for later',
							);
							if (paths[i].target.profilePath) {
								paths[i].target.color = Color.Update;
							}
							paths[i].color = Color.Update;
						}
						if (!visited.has(paths[i].source.id)) {
							queue.push([
								paths[i].source.id,
								__spreadArrays(currPath).concat(paths[i]),
							]);
							this.visualizer.updateAlert(
								'warning',
								'Marking ' +
									this.visualizer.stringifyNode(paths[i].source) +
									' for later',
							);
							if (paths[i].source.profilePath) {
								paths[i].source.color = Color.Update;
							}
							paths[i].color = Color.Update;
						}
						return [4 /*yield*/, this.visualizer.sleep(args.animationDelay)];
					case 5:
						_a.sent();
						delete paths[i].color;
						_a.label = 6;
					case 6:
						i++;
						return [3 /*break*/, 4];
					case 7:
						return [3 /*break*/, 2];
					case 8:
						this.visualizer.displayResultingPath(targetPath);
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 * Performs Djikstra's algorithm on a weighted graph.
	 * Precomputes shortest paths to each node in the graph before visualizing the input.
	 * @param {AlgoArgs} args - Source, target, and animation delay
	 * @see visualizeShortestPath
	 */
	Pathfinder.prototype.djikstras = function(args) {
		return __awaiter(this, void 0, void 0, function() {
			var maxWeight,
				distances,
				previous,
				priorityQueue,
				_a,
				id,
				currDistance,
				paths,
				_i,
				paths_1,
				path,
				distance,
				curr,
				shortestPath,
				prev;
			return __generator(this, function(_b) {
				maxWeight = Math.max.apply(
					Math,
					this.graphData.links.map(function(link) {
						return link.weight;
					}),
				);
				this.graphData.links.forEach(function(link) {
					return link.source.profilePath == 'number'
						? (link.weight /= maxWeight)
						: (link.weight = 1);
				});
				distances = this.graphData.nodes.reduce(function(map, obj) {
					map.set(obj.id, Number.MAX_SAFE_INTEGER);
					return map;
				}, new Map());
				distances.set(args.sourceId, 0);
				previous = new Map();
				priorityQueue = new PriorityQueue_1['default']({
					comparator: function(a, b) {
						return b[1] - a[1];
					},
				});
				priorityQueue.queue([args.sourceId, 0]);
				while (priorityQueue.length > 0) {
					(_a = priorityQueue.dequeue()), (id = _a[0]), (currDistance = _a[1]);
					if (currDistance > distances.get(id)) {
						continue;
					}
					paths = this.recurserEdgeMap.get(id);
					for (_i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
						path = paths_1[_i];
						distance = currDistance + path.weight;
						if (distance < distances.get(path.target.id)) {
							distances.set(path.target.id, distance);
							previous.set(path.target.id, id);
							priorityQueue.queue([path.target.id, distance]);
						}
						if (distance < distances.get(path.source.id)) {
							distances.set(path.source.id, distance);
							previous.set(path.source.id, id);
							priorityQueue.queue([path.source.id, distance]);
						}
					}
				}
				curr = args.targetId;
				shortestPath = [curr];
				while (curr !== args.sourceId) {
					prev = previous.get(curr);
					shortestPath.unshift(prev);
					curr = prev;
				}
				this.visualizeShortestPath(shortestPath, args.animationDelay);
				return [2 /*return*/];
			});
		});
	};
	/**
	 * Performs A* search algorithm on a weighted graph.
	 * Precomputes shortest paths to each node in the graph before visualizing the input.
	 * @param {AlgoArgs} args - Source, target, and animation delay
	 * @see visualizeShortestPath
	 */
	Pathfinder.prototype.astar = function(args) {
		return __awaiter(this, void 0, void 0, function() {
			var maxWeight,
				distances,
				maxHeuristic,
				heuristics,
				previous,
				priorityQueue,
				item,
				currNode,
				currDistance,
				paths,
				_i,
				paths_2,
				path,
				distance,
				curr,
				shortestPath,
				prev;
			var _this = this;
			return __generator(this, function(_a) {
				maxWeight = Math.max.apply(
					Math,
					this.graphData.links.map(function(link) {
						return link.weight;
					}),
				);
				this.graphData.links.forEach(function(link) {
					return typeof link.source.id == 'number'
						? (link.weight /= maxWeight)
						: (link.weight = 1);
				});
				distances = this.graphData.nodes.reduce(function(map, obj) {
					map.set(obj.id, Number.MAX_SAFE_INTEGER);
					return map;
				}, new Map());
				distances.set(args.sourceId, 0);
				maxHeuristic = Number.MIN_SAFE_INTEGER;
				heuristics = this.graphData.nodes.reduce(function(map, obj) {
					var heuristic = _this.euclideanDistance(
						obj,
						_this.recurserNodeMap.get(args.targetId),
					);
					maxHeuristic = Math.max(maxHeuristic, heuristic);
					map.set(obj.id, heuristic);
					return map;
				}, new Map());
				heuristics.set(args.targetId, 0);
				Array.from(heuristics.entries()).forEach(function(entry) {
					return heuristics.set(entry[0], entry[1] / maxHeuristic);
				});
				previous = new Map();
				priorityQueue = new PriorityQueue_1['default']({
					comparator: function(a, b) {
						return b[1] + b[2] - (a[1] + a[2]);
					},
				});
				priorityQueue.queue([args.sourceId, 0, heuristics.get(args.sourceId)]);
				while (priorityQueue.length > 0) {
					item = priorityQueue.dequeue();
					currNode = item[0];
					currDistance = item[1];
					if (currDistance > distances.get(currNode)) {
						continue;
					}
					paths = this.recurserEdgeMap.get(currNode);
					for (_i = 0, paths_2 = paths; _i < paths_2.length; _i++) {
						path = paths_2[_i];
						distance = currDistance + path.weight;
						if (distance < distances.get(path.target.id)) {
							distances.set(path.target.id, distance);
							previous.set(path.target.id, currNode);
							priorityQueue.queue([
								path.target.id,
								distance,
								heuristics.get(path.target.id),
							]);
						}
						if (distance < distances.get(path.source.id)) {
							distances.set(path.source.id, distance);
							previous.set(path.source.id, currNode);
							priorityQueue.queue([
								path.source.id,
								distance,
								heuristics.get(path.source.id),
							]);
						}
					}
				}
				curr = args.targetId;
				shortestPath = [curr];
				while (curr !== args.sourceId) {
					prev = previous.get(curr);
					shortestPath.unshift(prev);
					curr = prev;
				}
				this.visualizeShortestPath(shortestPath, args.animationDelay);
				return [2 /*return*/];
			});
		});
	};
	/**
	 * Ensures that Recursers are evaluated before batches.
	 * Dramatically influences the path taken by unweighted algos (DFS/BFS).
	 * Utilizes a bit of randomization to pick between nodes of the same type.
	 */
	Pathfinder.prototype.sortByNodeType = function(array) {
		var containsBatchNode = function(edge) {
			return edge.source.profilePath || edge.target.profilePath;
		};
		array.sort(function(a, b) {
			if (containsBatchNode(a) && !containsBatchNode(b)) {
				return -1;
			} else if (!containsBatchNode(a) && containsBatchNode(b)) {
				return 1;
			}
			return Math.random() < 0.5 ? -1 : 1;
		});
	};
	/** Takes precomputed shortest path algorithm and visualizes it. */
	Pathfinder.prototype.visualizeShortestPath = function(shortestPath, delay) {
		return __awaiter(this, void 0, void 0, function() {
			var start,
				i,
				id,
				currNode,
				paths,
				nextEdge,
				invalidEdges,
				invalidNodes,
				_i,
				paths_3,
				edge,
				sourceNode,
				targetNode_1,
				_a,
				invalidEdges_1,
				edge,
				_b,
				invalidNodes_1,
				node,
				end,
				targetNode;
			return __generator(this, function(_c) {
				switch (_c.label) {
					case 0:
						this.visualizer.prepareGraph(this.userNode, this.graphData);
						this.visualizer.updateAlert(
							'info',
							"Starting Djikstra's on a weighted graph containing " +
								this.graphData.nodes.length +
								' vertices and ' +
								this.graphData.links.length +
								' edges!',
						);
						start = new Date().getTime();
						this.visualizer.center(this.userNode.x, this.userNode.y, 100);
						return [4 /*yield*/, this.visualizer.sleep(2000)];
					case 1:
						_c.sent();
						i = 0;
						_c.label = 2;
					case 2:
						if (!(i < shortestPath.length)) return [3 /*break*/, 10];
						id = shortestPath[i];
						currNode = this.recurserNodeMap.get(id);
						this.visualizer.updateAlert(
							'success',
							'Next node in shortest path is ' + currNode.name,
						);
						if (!currNode.profilePath) {
							this.visualizer.center(currNode.x, currNode.y, 1000);
						}
						currNode.color = Color.Success;
						return [4 /*yield*/, this.visualizer.sleep(delay)];
					case 3:
						_c.sent();
						paths = this.recurserEdgeMap.get(id);
						nextEdge = null;
						invalidEdges = [];
						invalidNodes = [];
						(_i = 0), (paths_3 = paths);
						_c.label = 4;
					case 4:
						if (!(_i < paths_3.length)) return [3 /*break*/, 7];
						edge = paths_3[_i];
						if (edge.color === Color.Success) {
							return [3 /*break*/, 6];
						}
						edge.color = Color.Update;
						sourceNode = this.recurserNodeMap.get(edge.source.id);
						targetNode_1 = this.recurserNodeMap.get(edge.target.id);
						if (sourceNode.profilePath && sourceNode !== currNode) {
							sourceNode.color = Color.Update;
							this.visualizer.updateAlert(
								'warning',
								'Marked ' + sourceNode.name + ' for later',
							);
							invalidNodes.push(sourceNode);
						} else if (targetNode_1.profilePath && targetNode_1 !== currNode) {
							targetNode_1.color = Color.Update;
							this.visualizer.updateAlert(
								'warning',
								'Marked ' + targetNode_1.name + ' for later',
							);
							invalidNodes.push(targetNode_1);
						}
						return [4 /*yield*/, this.visualizer.sleep(delay)];
					case 5:
						_c.sent();
						delete edge.color;
						if (
							i < shortestPath.length - 1 &&
							(edge.source.id === shortestPath[i + 1] ||
								edge.target.id === shortestPath[i + 1])
						) {
							nextEdge = edge;
						} else {
							invalidEdges.push(edge);
						}
						_c.label = 6;
					case 6:
						_i++;
						return [3 /*break*/, 4];
					case 7:
						for (
							_a = 0, invalidEdges_1 = invalidEdges;
							_a < invalidEdges_1.length;
							_a++
						) {
							edge = invalidEdges_1[_a];
							edge.color = Color.Failure;
						}
						for (
							_b = 0, invalidNodes_1 = invalidNodes;
							_b < invalidNodes_1.length;
							_b++
						) {
							node = invalidNodes_1[_b];
							node.color = Color.Failure;
						}
						return [4 /*yield*/, this.visualizer.sleep(delay)];
					case 8:
						_c.sent();
						if (nextEdge) {
							nextEdge.color = Color.Success;
						}
						_c.label = 9;
					case 9:
						i++;
						return [3 /*break*/, 2];
					case 10:
						end = new Date().getTime();
						targetNode = this.recurserNodeMap.get(
							shortestPath[shortestPath.length - 1],
						);
						this.visualizer.updateAlert(
							'success',
							'Found ' +
								this.visualizer.stringifyNode(targetNode) +
								' in ' +
								(end - start) / 1000 +
								"'s after visiting " +
								shortestPath.length +
								'/' +
								this.graphData.nodes.length +
								' nodes. Note that this is not necessarily the shortest path; DFS only guarantees a valid path!',
						);
						return [2 /*return*/];
				}
			});
		});
	};
	/** Utilized in the determination of the A* heuristic. */
	Pathfinder.prototype.euclideanDistance = function(curr, goal) {
		var x = Math.pow(curr.x - goal.x, 2);
		var y = Math.pow(curr.y - goal.y, 2);
		return Math.sqrt(x + y);
	};
	return Pathfinder;
})();
exports.Pathfinder = Pathfinder;
