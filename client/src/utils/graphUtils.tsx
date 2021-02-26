import { Dispatch, SetStateAction } from 'react';
import {
	RecurserNode,
	RecurserEdge,
	RecurserGraph,
} from '../types/RecurserGraph';
import PriorityQueue from '../utils/PriorityQueue';

export class Alerter {
	setAlertSeverity: Dispatch<
		SetStateAction<'error' | 'warning' | 'info' | 'success' | undefined>
	>;
	setAlertMessage: Dispatch<SetStateAction<string>>;

	constructor(
		setAlertSeverity: Dispatch<
			SetStateAction<'error' | 'warning' | 'info' | 'success' | undefined>
		>,
		setAlertMessage: Dispatch<SetStateAction<string>>,
	) {
		this.setAlertSeverity = setAlertSeverity;
		this.setAlertMessage = setAlertMessage;
	}

	updateAlert(
		status: 'error' | 'warning' | 'info' | 'success',
		message: string,
	) {
		this.setAlertSeverity(status);
		this.setAlertMessage(message);
	}
}

export interface AlgoArgs {
	sourceId: string | number | undefined;
	targetId: string | number | undefined;
	animationSpeed: number;
}

export class Pathfinder {
	fgRef: any;
	userNode: RecurserNode;
	graphData: RecurserGraph;
	setGraphData: Dispatch<SetStateAction<RecurserGraph>>;
	recurserNodeMap: Map<string | number | undefined, RecurserNode>;
	recurserEdgeMap: Map<string | number | undefined, Array<RecurserEdge>>;
	alerter: Alerter;

	constructor(
		fgRef: any,
		userNode: RecurserNode,
		graphData: RecurserGraph,
		setGraphData: Dispatch<SetStateAction<RecurserGraph>>,
		alerter: Alerter,
	) {
		this.fgRef = fgRef;
		this.userNode = userNode;
		this.graphData = graphData;
		this.setGraphData = setGraphData;
		this.recurserNodeMap = this.getRecurserNodeMap(this.graphData.nodes);
		this.recurserEdgeMap = this.getRecurserEdgeMap(this.graphData.links);
		this.alerter = alerter;
	}

	private getRecurserNodeMap(
		nodes: Array<RecurserNode>,
	): Map<string | number | undefined, RecurserNode> {
		return nodes.reduce(function(map, obj) {
			map.set(obj.id, obj);
			return map;
		}, new Map<string | number | undefined, RecurserNode>());
	}

	// FIXME: Refactor?
	private getRecurserEdgeMap(
		edges: Array<RecurserEdge>,
	): Map<string | number | undefined, Array<RecurserEdge>> {
		return edges.reduce(function(map, obj) {
			map.has(obj.source.id)
				? map.get(obj.source.id)!.push(obj)
				: map.set(obj.source.id, [obj]);
			map.has(obj.target.id)
				? map.get(obj.target.id)!.push(obj)
				: map.set(obj.target.id, [obj]);
			return map;
		}, new Map<string | number | undefined, Array<RecurserEdge>>());
	}

	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private prepareGraph() {
		for (let i = 0; i < this.graphData.nodes.length; i++) {
			if (this.graphData.nodes[i].id === this.userNode.id) {
				this.graphData.nodes[i].color = '#3dc06c';
			} else if (this.graphData.nodes[i].profilePath) {
				this.graphData.nodes[i].color = 'grey';
			} else {
				this.graphData.nodes[i].color = '#000000';
			}
		}
		this.setGraphData(this.graphData);
	}

	private stringifyNode(node: RecurserNode): string | undefined {
		if (node.profilePath) {
			return `${node.name} (${node.batchShortName})`;
		}
		return node.name;
	}

	public async dfs(args: AlgoArgs) {
		this.prepareGraph();
		this.alerter.updateAlert(
			'success',
			`Starting DFS in an unweighted graph containing ${this.graphData.nodes.length} vertices and ${this.graphData.links.length} edges!`,
		);
		let start = new Date().getTime();
		this.fgRef.current.centerAt(this.userNode.x, this.userNode.y, 100);
		await this.sleep(2000);

		let stack: Array<[string | number | undefined, Array<RecurserEdge>]> = [
			[args.sourceId, [this.recurserEdgeMap.get(args.sourceId)![0]]],
		];
		let visited = new Set<string | number | undefined>();

		while (stack.length > 0) {
			let item = stack.pop();
			let id = item![0];
			let currNode = this.recurserNodeMap.get(id)!;
			let path = item![1];
			let currEdge = path[path.length - 1];

			this.alerter.updateAlert(
				'warning',
				`Visiting ${this.stringifyNode(currNode)}`,
			);

			await this.sleep(args.animationSpeed);

			currEdge.color = 'orange';
			currNode.color = 'orange';
			this.fgRef.current.centerAt(currNode.x, currNode.y, 2000);

			await this.sleep(args.animationSpeed);

			if (currNode.id === args.targetId) {
				currNode.color = '#3dc06c';
				let end = new Date().getTime();
				this.alerter.updateAlert(
					'success',
					`Found ${this.stringifyNode(currNode)} in ${(end - start) /
						1000}'s after visiting ${visited.size}/${
						this.graphData.nodes.length
					} nodes. Note that this is not necessarily the shortest path; DFS only guarantees a valid path!`,
				);

				for (let i = 0; i < path.length; i++) {
					path[i].color = 'green';
				}
				break;
			}

			if (currNode.id === this.userNode.id) {
				currNode.color = '#3dc06c';
			}

			await this.sleep(args.animationSpeed);

			if (currNode.profilePath && currNode.id !== this.userNode.id) {
				currEdge.color = 'red';
				currNode.color = 'red';
				this.alerter.updateAlert(
					'error',
					`Marking ${this.stringifyNode(currNode)} as visited`,
				);
			} else if (!currNode.profilePath) {
				currNode.color = 'black';
			}
			await this.sleep(args.animationSpeed);

			visited.add(currNode.id);

			let paths = this.recurserEdgeMap.get(id)!;

			for (let i = 0; i < paths.length; i++) {
				if (!visited.has(paths[i]!.target.id)) {
					let newPath = [...paths].concat(paths[i]);
					stack.push([paths[i].target.id, newPath]);
					paths[i].target.color = 'blue';
					paths[i].color = 'blue';
					this.alerter.updateAlert(
						'info',
						`Marking ${this.stringifyNode(paths[i].target)} for later`,
					);
					await this.sleep(args.animationSpeed);
					delete paths[i].color;
					paths[i].target.color = 'grey';
				}
				if (!visited.has(paths[i]!.source.id)) {
					let newPath = [...paths].concat(paths[i]);
					stack.push([paths[i].source.id, newPath]);
					paths[i].source.color = 'blue';
					paths[i].color = 'blue';
					this.alerter.updateAlert(
						'info',
						`Marking ${this.stringifyNode(paths[i].source)} for later`,
					);
					await this.sleep(args.animationSpeed);
					delete paths[i].color;
					paths[i].source.color = 'grey';
				}
			}
			this.setGraphData(this.graphData);
		}
		this.fgRef.current.zoom(5, 1000);
	}

	public async bfs(args: AlgoArgs) {
		this.prepareGraph();
		this.alerter.updateAlert(
			'success',
			`Starting BFS in an unweighted graph containing ${this.graphData.nodes.length} vertices and ${this.graphData.links.length} edges!`,
		);
		await this.sleep(2000);
		let start = new Date().getTime();
		this.fgRef.current.centerAt(this.userNode.x, this.userNode.y, 100);

		let queue: Array<string | number | undefined> = [args.sourceId];
		let visited = new Set<string | number | undefined>();

		while (queue.length > 0) {
			let id = queue.shift();
			let currNode = this.recurserNodeMap.get(id)!;

			if (visited.has(id)) {
				continue;
			}
			visited.add(id);
			console.log(currNode);

			this.alerter.updateAlert(
				'warning',
				`Visiting ${this.stringifyNode(currNode)}`,
			);

			await this.sleep(args.animationSpeed);

			currNode.color = 'yellow';
			this.fgRef.current.centerAt(currNode.x, currNode.y, 2000);

			await this.sleep(args.animationSpeed);

			if (currNode.id === args.targetId) {
				currNode.color = '#3dc06c';
				let end = new Date().getTime();
				this.alerter.updateAlert(
					'success',
					`Found ${this.stringifyNode(currNode)} in ${(end - start) /
						1000}'s after visiting ${visited.size}/${
						this.graphData.nodes.length
					} nodes. This is the shortest path if you treat the data as an unweighted graph.`,
				);
				break;
			}

			if (currNode.id === this.userNode.id) {
				currNode.color = '#3dc06c';
			}

			await this.sleep(args.animationSpeed);

			if (currNode.profilePath && currNode.id !== this.userNode.id) {
				currNode.color = 'red';
				this.alerter.updateAlert(
					'error',
					`Marking ${this.stringifyNode(currNode)} as visited`,
				);
			} else if (!currNode.profilePath) {
				currNode.color = 'black';
			}
			await this.sleep(args.animationSpeed);

			let paths = this.recurserEdgeMap.get(id)!;
			console.log(paths);

			for (let i = 0; i < paths.length; i++) {
				if (!visited.has(paths[i]!.target.id)) {
					queue.push(paths[i].target.id);
					paths[i].target.color = 'blue';
					paths[i].color = 'blue';
					this.alerter.updateAlert(
						'info',
						`Marking ${this.stringifyNode(paths[i].target)} for later`,
					);
					await this.sleep(args.animationSpeed);
					delete paths[i].color;
					paths[i].target.color = 'grey';
				}
				if (!visited.has(paths[i]!.source.id)) {
					queue.push(paths[i].source.id);
					paths[i].source.color = 'blue';
					paths[i].color = 'blue';
					this.alerter.updateAlert(
						'info',
						`Marking ${this.stringifyNode(paths[i].source)} for later`,
					);
					await this.sleep(args.animationSpeed);
					delete paths[i].color;
					paths[i].source.color = 'grey';
				}
			}
			this.setGraphData(this.graphData);
		}
		this.fgRef.current.zoom(5, 1000);
	}

	public async djikstras(args: AlgoArgs) {
		let maxWeight = Math.max.apply(
			Math,
			this.graphData.links.map(link => link.weight),
		);
		this.graphData.links.forEach(link =>
			typeof link.source.id == 'number'
				? (link.weight /= maxWeight)
				: (link.weight = 1),
		);

		let distances: Map<
			number | string | undefined,
			number
		> = this.graphData.nodes.reduce((map, obj) => {
			map.set(obj.id, Number.MAX_SAFE_INTEGER);
			return map;
		}, new Map<number | string | undefined, number>());
		distances.set(args.sourceId, 0);

		let previous: Map<
			number | string | undefined,
			number | string | undefined
		> = new Map<number | string | undefined, number | string | undefined>();

		let priorityQueue = new PriorityQueue<
			[number | string | undefined, number]
		>({
			comparator: function(a, b) {
				return b[1] - a[1];
			},
		});
		priorityQueue.queue([args.sourceId, 0]);

		while (priorityQueue.length > 0) {
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
					priorityQueue.queue([path.target.id, distance]);
				}
				if (distance < distances.get(path.source.id)!) {
					distances.set(path.source.id, distance);
					previous.set(path.source.id, currNode);
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
		console.log(shortestPath);
	}

	private euclideanDistance(
		curr: RecurserNode | undefined,
		goal: RecurserNode | undefined,
	) {
		let x = Math.pow(curr!.x! - goal!.x!, 2);
		let y = Math.pow(curr!.y! - goal!.y!, 2);
		return Math.sqrt(x + y);
	}

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

		let distances: Map<
			number | string | undefined,
			number
		> = this.graphData.nodes.reduce((map, obj) => {
			map.set(obj.id, Number.MAX_SAFE_INTEGER);
			return map;
		}, new Map<number | string | undefined, number>());
		distances.set(args.sourceId, 0);

		let maxHeuristic = Number.MIN_SAFE_INTEGER;
		let heuristics: Map<
			number | string | undefined,
			number
		> = this.graphData.nodes.reduce((map, obj) => {
			let heuristic = this.euclideanDistance(
				obj,
				this.recurserNodeMap.get(args.targetId),
			);
			maxHeuristic = Math.max(maxHeuristic, heuristic);
			map.set(obj.id, heuristic);
			return map;
		}, new Map<number | string | undefined, number>());
		heuristics.set(args.targetId, 0);
		Array.from(heuristics.entries()).forEach(entry =>
			heuristics.set(entry[0], entry[1] / maxHeuristic),
		);

		let previous: Map<
			number | string | undefined,
			number | string | undefined
		> = new Map<number | string | undefined, number | string | undefined>();

		let priorityQueue = new PriorityQueue<
			[number | string | undefined, number, number]
		>({
			comparator: function(a, b) {
				return b[1] + b[2] - (a[1] + a[2]);
			},
		});
		priorityQueue.queue([args.sourceId, 0, heuristics.get(args.sourceId)!]);

		while (priorityQueue.length > 0) {
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
		console.log(shortestPath);
	}
}
