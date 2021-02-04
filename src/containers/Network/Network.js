"use strict";
exports.__esModule = true;
exports.Network = void 0;
var React = require("react");
var react_force_graph_2d_1 = require("react-force-graph-2d");
var NavigationBar_1 = require("../../components/NavigationBar/NavigationBar");
exports.Network = function (_a) {
    var profileID = _a.profileID;
    var useRef = React.useRef;
    var fgRef = useRef();
    var _b = React.useState({ nodes: [], links: [] }), graphData = _b[0], setGraphData = _b[1];
    React.useEffect(function () {
        fetch('/api/v1/graph/' + profileID.toString())
            .then(function (res) { return res.json(); })
            .then(function (data) {
            setGraphData(data);
        });
    }, []);
    var handleNodeClick = function (node) {
        fgRef.current.zoom(8, 2000);
        fgRef.current.centerAt(node.x, node.y, 1000);
    };
    var handleBackgroundClick = function () {
        fgRef.current.zoom(5, 2000);
        fgRef.current.centerAt(0, 0, 1000);
    };
    var handleBackgroundRightClick = function () {
        fgRef.current.zoom(1, 2000);
        fgRef.current.centerAt(0, 0, 1000);
    };
    return (React.createElement("div", null,
        React.createElement(NavigationBar_1.NavigationBar, null),
        React.createElement("div", null, "Network"),
        React.createElement(react_force_graph_2d_1["default"], { ref: fgRef, graphData: graphData, nodeLabel: "name", nodeAutoColorBy: "id", onNodeClick: handleNodeClick, linkDirectionalParticles: 2, linkDirectionalParticleWidth: 1.4, onBackgroundClick: handleBackgroundClick, onBackgroundRightClick: handleBackgroundRightClick }),
        ","));
};
