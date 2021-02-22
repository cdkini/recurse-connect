import { Dispatch, SetStateAction } from 'react';
import {
	RecurserNode,
	RecurserEdge,
	RecurserGraph,
} from '../types/RecurserGraph';

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
		status: 'error' | 'warning' | 'info' | 'success' | undefined,
		message: string,
	) {
		this.setAlertSeverity(status);
		this.setAlertMessage(message);
	}
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
			if (this.graphData.nodes[i].profilePath) {
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

	async depthFirstSearch(
		sourceId: string | number | undefined,
		targetId: string | number | undefined,
	) {
		this.prepareGraph();
		this.alerter.updateAlert(
			'success',
			`Starting DFS in a graph containing ${this.graphData.nodes.length} vertices and ${this.graphData.links.length} edges!`,
		);
		await this.sleep(2000);
		let start = new Date().getTime();
		this.fgRef.current.centerAt(this.userNode.x, this.userNode.y, 100);
		this.userNode.color = '#3dc06c';

		let stack: Array<string | number | undefined> = [sourceId];
		let visited = new Set<string | number | undefined>();

		while (stack.length > 0) {
			let id = stack.pop();
			let currNode = this.recurserNodeMap.get(id)!;
			this.alerter.updateAlert(
				'warning',
				`Visiting ${this.stringifyNode(currNode)}`,
			);

			await this.sleep(100);

			currNode.color = 'yellow';
			this.fgRef.current.centerAt(currNode.x, currNode.y, 2000);

			await this.sleep(100);

			if (currNode.id === targetId) {
				currNode.color = '#3dc06c';
				let end = new Date().getTime();
				this.alerter.updateAlert(
					'success',
					`Found ${this.stringifyNode(currNode)} in ${(end - start) /
						1000}'s after visiting ${visited.size}/${
						this.graphData.nodes.length
					} nodes. Note that this not necessarily the shortest path; DFS only guarantees a valid path!`,
				);
				break;
			}

			if (currNode.id === this.userNode.id) {
				currNode.color = '#3dc06c';
			}

			await this.sleep(100);

			if (currNode.profilePath && currNode.id !== this.userNode.id) {
				currNode.color = 'red';
				this.alerter.updateAlert(
					'error',
					`Marking ${this.stringifyNode(currNode)} as visited`,
				);
			} else if (!currNode.profilePath) {
				currNode.color = 'black';
			}
			await this.sleep(100);

			visited.add(currNode.id);

			let paths = this.recurserEdgeMap.get(currNode.id)!;
			for (let i = 0; i < paths.length; i++) {
				if (!visited.has(paths[i]!.target.id)) {
					stack.push(paths[i].target.id);
					paths[i].target.color = 'blue';
					paths[i].color = 'yellow';
					this.alerter.updateAlert(
						'info',
						`Marking ${this.stringifyNode(paths[i].target)} for later`,
					);
					await this.sleep(100);
					delete paths[i].color;
					paths[i].target.color = 'grey';
				}
				if (!visited.has(paths[i]!.source.id)) {
					stack.push(paths[i].source.id);
					paths[i].source.color = 'blue';
					paths[i].color = 'yellow';
					this.alerter.updateAlert(
						'info',
						`Marking ${this.stringifyNode(paths[i].source)} for later`,
					);
					await this.sleep(100);
					delete paths[i].color;
					paths[i].source.color = 'grey';
				}
			}
			this.setGraphData(this.graphData);
		}

		this.fgRef.current.zoom(5, 1000);
	}
}
