import { Dispatch, SetStateAction } from 'react';
import {
	RecurserNode,
	RecurserEdge,
	RecurserGraph,
	RecurserId,
} from '../types/RecurserGraph';
import PriorityQueue from '../utils/PriorityQueue';

/** Used to change node/edge colors during graph traversal. */
enum Color {
	Success = 'green',
	Failure = 'red',
	Update = 'orange',
	Info = 'blue',
	BatchNode = 'black',
	RecurserNode = 'grey',
}

/**
 * Responsible for visualization of a given graph traversal.
 * @attr {any} fgRef - Reference to ForceGraph2D object used in visualization
 * @attr {Dispatch<SetStateAction<RecurserGraph>} setGraphData - useState setter for graph data
 * @attr {Dispatch<SetStateAction><'error' | 'warning' | 'info' | 'success' | undefined>} setAlertSeverity - useState func for alert color
 * @attr {Dispatch<SetStateAction><'error' | 'warning' | 'info' | 'success' | undefined>} setAlertSeverity - useState func for alert message
 */
export class Visualizer {
	fgRef: any;
	setGraphData: Dispatch<SetStateAction<RecurserGraph>>;
	setAlertSeverity: Dispatch<
		SetStateAction<'error' | 'warning' | 'info' | 'success' | undefined>
	>;
	setAlertMessage: Dispatch<SetStateAction<string>>;

	constructor(
		fgRef: any,
		setGraphData: Dispatch<SetStateAction<RecurserGraph>>,
		setAlertSeverity: Dispatch<
			SetStateAction<'error' | 'warning' | 'info' | 'success' | undefined>
		>,
		setAlertMessage: Dispatch<SetStateAction<string>>,
	) {
		this.fgRef = fgRef;
		this.setGraphData = setGraphData;
		this.setAlertSeverity = setAlertSeverity;
		this.setAlertMessage = setAlertMessage;
	}

	/** Center graph on input node's coordinates. */
	public center(x: number | undefined, y: number | undefined, ms: number) {
		this.fgRef.current.centerAt(x, y, ms);
	}

	/** Modify alert state through useState hooks.  */
	public updateAlert(
		status: 'error' | 'warning' | 'info' | 'success',
		message: string,
	) {
		this.setAlertSeverity(status);
		this.setAlertMessage(message);
	}

	/** Used to pause between visualization states. */
	public sleep(ms: number | Array<number>): Promise<any> | void {
		if (typeof ms === 'number') {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	}

	/** Resets graph colors to grayscale between visualizations. */
	public prepareGraph(userNode: RecurserNode, graphData: RecurserGraph) {
		for (let edge of graphData.links) {
			delete edge.color;
		}
		for (let node of graphData.nodes) {
			if (node.id === userNode.id) {
				node.color = Color.Success;
			} else if (node.profilePath) {
				node.color = Color.RecurserNode;
			} else {
				node.color = Color.BatchNode;
			}
		}
		this.setGraphData(graphData);
	}

	/** Determines the appropriate string representation of a RecurserNode. */
	public stringifyNode(node: RecurserNode): string | undefined {
		if (node.profilePath) {
			return `${node.name} (${node.batchShortName})`;
		}
		return node.name;
	}

	/** Highlights the final path in green. */
	public displayResultingPath(path: Array<RecurserEdge>) {
		for (let edge of path) {
			edge.source.color = Color.Success;
			edge.color = Color.Success;
			edge.target.color = Color.Success;
		}
	}
}

/** Wrapper around arguments used in each pathfinding algorithm. */
export interface AlgoArgs {
	sourceId: RecurserId;
	targetId: RecurserId;
	animationDelay: number | Array<number>;
}

/** Driver class responsible for determination of paths to be used in visualization.
 *  @attr {RecurserNode} userNode - The graph node corresponding to the user
 *  @attr {RecurserGraph} graphData - The input data used to generate the force graph
 *  @attr {Map<RecurserId, RecurserNode>} recurserNodeMap - Performant lookup from id to node object
 *  @attr {Map<RecurserId, RecurserEdge>} recurserEdgeMap - Performant lookup from id to related edges
 *  @attr {Alerter} alerter - Responsible for updating alert bar with graph states
 */
export class Pathfinder {
	userNode: RecurserNode;
	graphData: RecurserGraph;
	recurserNodeMap: Map<RecurserId, RecurserNode>;
	recurserEdgeMap: Map<RecurserId, Array<RecurserEdge>>;
	visualizer: Visualizer;

	constructor(
		userNode: RecurserNode,
		graphData: RecurserGraph,
		visualizer: Visualizer,
	) {
		this.userNode = userNode;
		this.graphData = graphData;
		this.recurserNodeMap = this.getRecurserNodeMap(this.graphData.nodes);
		this.recurserEdgeMap = this.getRecurserEdgeMap(this.graphData.links);
		this.visualizer = visualizer;
	}

	/** Helper method to generate recurserNodeMap attribute */
	private getRecurserNodeMap(
		nodes: Array<RecurserNode>,
	): Map<RecurserId, RecurserNode> {
		return nodes.reduce(function(map, obj) {
			map.set(obj.id, obj);
			return map;
		}, new Map<RecurserId, RecurserNode>());
	}

	/** Helper method to generate recurserEdgeMap attribute */
	private getRecurserEdgeMap(
		edges: Array<RecurserEdge>,
	): Map<RecurserId, Array<RecurserEdge>> {
		return edges.reduce(function(map, obj) {
			map.has(obj.source.id)
				? map.get(obj.source.id)!.push(obj)
				: map.set(obj.source.id, [obj]);
			map.has(obj.target.id)
				? map.get(obj.target.id)!.push(obj)
				: map.set(obj.target.id, [obj]);
			return map;
		}, new Map<RecurserId, Array<RecurserEdge>>());
	}

	public async runSelectedAlgo(algo: string, args: AlgoArgs) {
		switch (algo) {
			case 'dfs':
				this.dfs(args);
				break;
			case 'bfs':
				this.bfs(args);
				break;
			case 'djikstras':
				this.djikstras(args);
				break;
			case 'astar':
				this.astar(args);
				break;
		}
	}

	/**
	 * Performs an unweighted depth-first search on graph data, visualizing state at each step.
	 * @param {AlgoArgs} args - Source, target, and animation delay
	 */
	public async dfs(args: AlgoArgs) {
		this.visualizer.prepareGraph(this.userNode, this.graphData);

		this.visualizer.updateAlert(
			'info',
			`Starting DFS on an unweighted graph containing ${this.graphData.nodes.length} vertices and ${this.graphData.links.length} edges!`,
		);
		let start = new Date().getTime();

		this.visualizer.center(this.userNode.x, this.userNode.y, 100);
		args.animationDelay ? await this.visualizer.sleep(2000) : null;

		let stack: Array<[RecurserId, Array<RecurserEdge>]> = [
			[args.sourceId, [this.recurserEdgeMap.get(args.sourceId)![0]]],
		];
		let visited = new Set<RecurserId>();

		let targetPath: Array<RecurserEdge> = [];
		while (stack.length > 0) {
			let item = stack.pop();
			let id = item![0];
			let currNode = this.recurserNodeMap.get(id)!;
			let currPath = item![1];
			let currEdge = currPath[currPath.length - 1];

			if (visited.has(id)) {
				continue;
			}

			if (!currNode.profilePath) {
				this.visualizer.center(currNode.x, currNode.y, 1000);
			}

			if (currNode.id === args.targetId) {
				let end = new Date().getTime();
				this.visualizer.updateAlert(
					'success',
					`Found ${this.visualizer.stringifyNode(currNode)} in ${(end - start) /
						1000}'s after visiting ${visited.size}/${
						this.graphData.nodes.length
					} nodes. Note that this is not necessarily the shortest path; DFS only guarantees a valid path!`,
				);

				targetPath = currPath;
				break;
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
					`Marking ${this.visualizer.stringifyNode(currNode)} as visited`,
				);
			}
			args.animationDelay
				? await this.visualizer.sleep(args.animationDelay)
				: null;
			delete currEdge.color;

			visited.add(currNode.id);
			let paths = this.recurserEdgeMap.get(id)!;
			this.sortByNodeType(paths);

			for (let i = 0; i < paths.length; i++) {
				if (!visited.has(paths[i]!.target.id)) {
					stack.push([paths[i].target.id, [...currPath].concat(paths[i])]);
					this.visualizer.updateAlert(
						'warning',
						`Marking ${this.visualizer.stringifyNode(
							paths[i].target,
						)} for later`,
					);
					if (paths[i].target.profilePath) {
						paths[i].target.color = Color.Update;
					}
					paths[i].color = Color.Update;
				}
				if (!visited.has(paths[i]!.source.id)) {
					stack.push([paths[i].source.id, [...currPath].concat(paths[i])]);
					this.visualizer.updateAlert(
						'warning',
						`Marking ${this.visualizer.stringifyNode(
							paths[i].source,
						)} for later`,
					);
					if (paths[i].source.profilePath) {
						paths[i].source.color = Color.Update;
					}
					paths[i].color = Color.Update;
				}
				args.animationDelay
					? await this.visualizer.sleep(args.animationDelay)
					: null;
				delete paths[i].color;
			}
		}

		this.visualizer.displayResultingPath(targetPath);
	}

	/**
	 * Performs an unweighted breadth-first search on graph data, visualizing state at each step.
	 * @param {AlgoArgs} args - Source, target, and animation delay
	 */
	public async bfs(args: AlgoArgs) {
		this.visualizer.prepareGraph(this.userNode, this.graphData);

		this.visualizer.updateAlert(
			'info',
			`Starting BFS on an unweighted graph containing ${this.graphData.nodes.length} vertices and ${this.graphData.links.length} edges!`,
		);
		let start = new Date().getTime();

		this.visualizer.center(this.userNode.x, this.userNode.y, 100);
		args.animationDelay ? await this.visualizer.sleep(2000) : null;

		let queue: Array<[RecurserId, Array<RecurserEdge>]> = [
			[args.sourceId, [this.recurserEdgeMap.get(args.sourceId)![0]]],
		];
		let visited = new Set<RecurserId>();

		let targetPath: Array<RecurserEdge> = [];
		while (queue.length > 0) {
			let item = queue.shift();
			let id = item![0];
			let currNode = this.recurserNodeMap.get(id)!;
			let currPath = item![1];
			let currEdge = currPath[currPath.length - 1];

			if (visited.has(id)) {
				continue;
			}

			if (!currNode.profilePath) {
				this.visualizer.center(currNode.x, currNode.y, 1000);
			}

			if (currNode.id === args.targetId) {
				let end = new Date().getTime();
				this.visualizer.updateAlert(
					'success',
					`Found ${this.visualizer.stringifyNode(currNode)} in ${(end - start) /
						1000}'s after visiting ${visited.size}/${
						this.graphData.nodes.length
					} nodes. This is the shortest path in an unweighted graph!`,
				);

				targetPath = currPath;
				break;
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
					`Marking ${this.visualizer.stringifyNode(currNode)} as visited`,
				);
			}
			args.animationDelay
				? await this.visualizer.sleep(args.animationDelay)
				: null;
			delete currEdge.color;

			visited.add(currNode.id);
			let paths = this.recurserEdgeMap.get(id)!;
			this.sortByNodeType(paths);

			for (let i = 0; i < paths.length; i++) {
				if (!visited.has(paths[i]!.target.id)) {
					queue.push([paths[i].target.id, [...currPath].concat(paths[i])]);
					this.visualizer.updateAlert(
						'warning',
						`Marking ${this.visualizer.stringifyNode(
							paths[i].target,
						)} for later`,
					);
					if (paths[i].target.profilePath) {
						paths[i].target.color = Color.Update;
					}
					paths[i].color = Color.Update;
				}
				if (!visited.has(paths[i]!.source.id)) {
					queue.push([paths[i].source.id, [...currPath].concat(paths[i])]);
					this.visualizer.updateAlert(
						'warning',
						`Marking ${this.visualizer.stringifyNode(
							paths[i].source,
						)} for later`,
					);
					if (paths[i].source.profilePath) {
						paths[i].source.color = Color.Update;
					}
					paths[i].color = Color.Update;
				}
				args.animationDelay
					? await this.visualizer.sleep(args.animationDelay)
					: null;
				delete paths[i].color;
			}
		}

		this.visualizer.displayResultingPath(targetPath);
	}

	/**
	 * Performs Djikstra's algorithm on a weighted graph.
	 * Precomputes shortest paths to each node in the graph before visualizing the input.
	 * @param {AlgoArgs} args - Source, target, and animation delay
	 * @see visualizeShortestPath
	 */
	public async djikstras(args: AlgoArgs) {
		let maxWeight = Math.max.apply(
			Math,
			this.graphData.links.map(link => link.weight),
		);
		this.graphData.links.forEach(link =>
			link.source.profilePath == 'number'
				? (link.weight /= maxWeight)
				: (link.weight = 1),
		);

		let distances: Map<RecurserId, number> = this.graphData.nodes.reduce(
			(map, obj) => {
				map.set(obj.id, Number.MAX_SAFE_INTEGER);
				return map;
			},
			new Map<RecurserId, number>(),
		);
		distances.set(args.sourceId, 0);

		let previous: Map<RecurserId, RecurserId> = new Map<
			RecurserId,
			RecurserId
		>();

		let priorityQueue = new PriorityQueue<[RecurserId, number]>({
			comparator: function(a, b) {
				return b[1] - a[1];
			},
		});
		priorityQueue.queue([args.sourceId, 0]);

		while (priorityQueue.length() > 0) {
			let [id, currDistance] = priorityQueue.dequeue();

			if (currDistance > distances.get(id)!) {
				continue;
			}

			let paths = this.recurserEdgeMap.get(id)!;
			for (let path of paths) {
				let distance = currDistance + path.weight;

				if (distance < distances.get(path.target.id)!) {
					distances.set(path.target.id, distance);
					previous.set(path.target.id, id);
					priorityQueue.queue([path.target.id, distance]);
				}
				if (distance < distances.get(path.source.id)!) {
					distances.set(path.source.id, distance);
					previous.set(path.source.id, id);
					priorityQueue.queue([path.source.id, distance]);
				}
			}
		}

		let curr = args.targetId;
		let shortestPath = [curr];
		while (curr !== args.sourceId) {
			let prev = previous.get(curr);
			shortestPath.unshift(prev);
			curr = prev;
		}

		if (typeof args.animationDelay === 'number') {
			this.visualizeShortestPath(shortestPath, args.animationDelay);
		}
	}

	/**
	 * Performs A* search algorithm on a weighted graph.
	 * Precomputes shortest paths to each node in the graph before visualizing the input.
	 * @param {AlgoArgs} args - Source, target, and animation delay
	 * @see visualizeShortestPath
	 */
	public async astar(args: AlgoArgs) {
		let maxWeight = Math.max.apply(
			Math,
			this.graphData.links.map(link => link.weight),
		);
		this.graphData.links.forEach(link =>
			typeof link.source.id == 'number'
				? (link.weight /= maxWeight)
				: (link.weight = 1),
		);

		let distances: Map<RecurserId, number> = this.graphData.nodes.reduce(
			(map, obj) => {
				map.set(obj.id, Number.MAX_SAFE_INTEGER);
				return map;
			},
			new Map<RecurserId, number>(),
		);
		distances.set(args.sourceId, 0);

		let maxHeuristic = Number.MIN_SAFE_INTEGER;
		let heuristics: Map<RecurserId, number> = this.graphData.nodes.reduce(
			(map, obj) => {
				let heuristic = this.euclideanDistance(
					obj,
					this.recurserNodeMap.get(args.targetId),
				);
				maxHeuristic = Math.max(maxHeuristic, heuristic);
				map.set(obj.id, heuristic);
				return map;
			},
			new Map<RecurserId, number>(),
		);
		heuristics.set(args.targetId, 0);
		Array.from(heuristics.entries()).forEach(entry =>
			heuristics.set(entry[0], entry[1] / maxHeuristic),
		);

		let previous: Map<RecurserId, RecurserId> = new Map<
			RecurserId,
			RecurserId
		>();

		let priorityQueue = new PriorityQueue<[RecurserId, number, number]>({
			comparator: function(a, b) {
				return b[1] + b[2] - (a[1] + a[2]);
			},
		});
		priorityQueue.queue([args.sourceId, 0, heuristics.get(args.sourceId)!]);

		while (priorityQueue.length() > 0) {
			let item = priorityQueue.dequeue();
			let currNode = item[0];
			let currDistance = item[1];

			if (currDistance > distances.get(currNode)!) {
				continue;
			}

			let paths = this.recurserEdgeMap.get(currNode)!;
			for (let path of paths) {
				let distance = currDistance + path.weight;

				if (distance < distances.get(path.target.id)!) {
					distances.set(path.target.id, distance);
					previous.set(path.target.id, currNode);
					priorityQueue.queue([
						path.target.id,
						distance,
						heuristics.get(path.target.id)!,
					]);
				}
				if (distance < distances.get(path.source.id)!) {
					distances.set(path.source.id, distance);
					previous.set(path.source.id, currNode);
					priorityQueue.queue([
						path.source.id,
						distance,
						heuristics.get(path.source.id)!,
					]);
				}
			}
		}

		let curr = args.targetId;
		let shortestPath = [curr];
		while (curr !== args.sourceId) {
			let prev = previous.get(curr);
			shortestPath.unshift(prev);
			curr = prev;
		}

		if (typeof args.animationDelay === 'number') {
			this.visualizeShortestPath(shortestPath, args.animationDelay);
		}
	}

	/**
	 * Ensures that Recursers are evaluated before batches.
	 * Dramatically influences the path taken by unweighted algos (DFS/BFS).
	 * Utilizes a bit of randomization to pick between nodes of the same type.
	 */
	private sortByNodeType(array: Array<RecurserEdge>) {
		let containsBatchNode = (edge: RecurserEdge) => {
			return edge.source.profilePath || edge.target.profilePath;
		};
		array.sort((a, b) => {
			if (containsBatchNode(a) && !containsBatchNode(b)) {
				return -1;
			} else if (!containsBatchNode(a) && containsBatchNode(b)) {
				return 1;
			}
			return Math.random() < 0.5 ? -1 : 1;
		});
	}

	/** Takes precomputed shortest path algorithm and visualizes it. */
	private async visualizeShortestPath(
		shortestPath: Array<RecurserId>,
		delay: number,
	) {
		this.visualizer.prepareGraph(this.userNode, this.graphData);

		this.visualizer.updateAlert(
			'info',
			`Starting Djikstra's on a weighted graph containing ${this.graphData.nodes.length} vertices and ${this.graphData.links.length} edges!`,
		);
		let start = new Date().getTime();

		this.visualizer.center(this.userNode.x, this.userNode.y, 100);
		delay ? await this.visualizer.sleep(2000) : null;

		for (let i = 0; i < shortestPath.length; i++) {
			let id = shortestPath[i];
			let currNode = this.recurserNodeMap.get(id)!;

			this.visualizer.updateAlert(
				'success',
				`Next node in shortest path is ${currNode.name}`,
			);

			if (!currNode.profilePath) {
				this.visualizer.center(currNode.x, currNode.y, 1000);
			}
			currNode.color = Color.Success;
			delay ? await this.visualizer.sleep(delay) : null;

			let paths = this.recurserEdgeMap.get(id)!;
			let nextEdge: RecurserEdge | null = null;
			let invalidEdges: Array<RecurserEdge> = [];
			let invalidNodes: Array<RecurserNode> = [];

			for (let edge of paths) {
				if (edge.color === Color.Success) {
					continue;
				}

				edge.color = Color.Update;

				let sourceNode = this.recurserNodeMap.get(edge.source.id)!;
				let targetNode = this.recurserNodeMap.get(edge.target.id)!;
				if (sourceNode.profilePath && sourceNode !== currNode) {
					sourceNode.color = Color.Update;

					this.visualizer.updateAlert(
						'warning',
						`Marked ${sourceNode.name} for later`,
					);

					invalidNodes.push(sourceNode);
				} else if (targetNode.profilePath && targetNode !== currNode) {
					targetNode.color = Color.Update;

					this.visualizer.updateAlert(
						'warning',
						`Marked ${targetNode.name} for later`,
					);

					invalidNodes.push(targetNode);
				}

				delay ? await this.visualizer.sleep(delay) : null;
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
			}

			for (let edge of invalidEdges) {
				edge.color = Color.Failure;
			}
			for (let node of invalidNodes) {
				node.color = Color.Failure;
			}
			delay ? await this.visualizer.sleep(delay) : null;

			if (nextEdge) {
				nextEdge.color = Color.Success;
			}
		}

		let end = new Date().getTime();
		let targetNode = this.recurserNodeMap.get(
			shortestPath[shortestPath.length - 1],
		)!;
		this.visualizer.updateAlert(
			'success',
			`Found ${this.visualizer.stringifyNode(targetNode)} in ${(end - start) /
				1000}'s after visiting ${shortestPath.length}/${
				this.graphData.nodes.length
			} nodes. Note that this is not necessarily the shortest path; DFS only guarantees a valid path!`,
		);
	}

	/** Utilized in the determination of the A* heuristic. */
	private euclideanDistance(
		curr: RecurserNode | undefined,
		goal: RecurserNode | undefined,
	) {
		let x = Math.pow(curr!.x! - goal!.x!, 2);
		let y = Math.pow(curr!.y! - goal!.y!, 2);
		return Math.sqrt(x + y);
	}
}
