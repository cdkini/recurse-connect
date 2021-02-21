import { Dispatch, SetStateAction } from 'react';
import {
	RecurserNode,
	RecurserEdge,
	RecurserGraph,
} from '../types/RecurserGraph';

export class Pathfinder {
	fgRef: any;
	userNode: RecurserNode;
	graphData: RecurserGraph;
	setGraphData: Dispatch<SetStateAction<RecurserGraph>>;
	recurserNodeMap: Map<string | number | undefined, RecurserNode>;
	recurserEdgeMap: Map<string | number | undefined, Array<RecurserEdge>>;
	setAlertSeverity: Dispatch<
		SetStateAction<'error' | 'warning' | 'info' | 'success' | undefined>
	>;
	setAlertMessage: Dispatch<SetStateAction<string>>;

	constructor(
		fgRef: any,
		userNode: RecurserNode,
		graphData: RecurserGraph,
		setGraphData: Dispatch<SetStateAction<RecurserGraph>>,
		setAlertSeverity: Dispatch<
			SetStateAction<'error' | 'warning' | 'info' | 'success' | undefined>
		>,
		setAlertMessage: Dispatch<SetStateAction<string>>,
	) {
		this.fgRef = fgRef;
		this.userNode = userNode;
		this.graphData = graphData;
		this.setGraphData = setGraphData;
		this.recurserNodeMap = this.getRecurserNodeMap(this.graphData.nodes);
		this.recurserEdgeMap = this.getRecurserEdgeMap(this.graphData.links);
		this.setAlertSeverity = setAlertSeverity;
		this.setAlertMessage = setAlertMessage;
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

	private updateAlert(
		status: 'error' | 'warning' | 'info' | 'success' | undefined,
		message: string,
	) {
		this.setAlertSeverity(status);
		this.setAlertMessage(message);
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

	async depthFirstSearch(
		start: string | number | undefined,
		end: string | number | undefined,
	) {
		this.prepareGraph();
		this.updateAlert;
		this.updateAlert(
			'success',
			`Starting graph traversal at ${this.userNode.name} (${this.userNode.batchShortName})`,
		);
		await this.sleep(1000);
		this.fgRef.current.centerAt(this.userNode.x, this.userNode.y, 100);
		this.userNode.color = '#3dc06c';

		let stack: Array<string | number | undefined> = [start];
		let visited = new Set<string | number | undefined>();

		while (stack.length > 0) {
			let id = stack.pop();
			let currNode = this.recurserNodeMap.get(id)!;
			this.updateAlert(
				'warning',
				`Visiting ${currNode.name} (${currNode.batchShortName})`,
			);

			await this.sleep(100);

			currNode.color = 'yellow';
			this.fgRef.current.centerAt(currNode.x, currNode.y, 2000);

			await this.sleep(100);

			if (currNode.id === end) {
				currNode.color = '#3dc06c';
				this.updateAlert(
					'success',
					`Found ${currNode.name} (${currNode.batchShortName})`,
				);
				break;
			}

			if (currNode.id === this.userNode.id) {
				currNode.color = '#3dc06c';
			}

			await this.sleep(100);

			if (currNode.profilePath && currNode.id !== this.userNode.id) {
				currNode.color = 'red';
				this.updateAlert(
					'error',
					`Marking ${currNode.name} (${currNode.batchShortName}) as visited`,
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

					this.updateAlert(
						'info',
						`Marking ${paths[i].target.name} (${paths[i].target.batchShortName}) for later`,
					);
					await this.sleep(100);
					delete paths[i].color;
					paths[i].target.color = 'grey';
				}
				if (!visited.has(paths[i]!.source.id)) {
					stack.push(paths[i].source.id);
					paths[i].color = 'yellow';
					paths[i].source.color = 'blue';
					this.updateAlert(
						'info',
						`Marking ${paths[i].source.name} (${paths[i].source.batchShortName}) for later`,
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
