"use strict";
exports.__esModule = true;
exports.NetworkGraph = void 0;
var React = require("react");
var react_force_graph_2d_1 = require("react-force-graph-2d");
var core_1 = require("@material-ui/core");
var RecurserCard_1 = require("../RecurserCard/RecurserCard");
exports.NetworkGraph = function (props) {
    var _a = React.useState({
        nodes: [],
        links: []
    }), graphData = _a[0], setGraphData = _a[1];
    React.useEffect(function () {
        fetch('/api/v1/graph/' + props.profileId.toString())
            .then(function (res) { return res.json(); })
            .then(function (data) {
            setGraphData(data);
        });
    }, []);
    var _b = React.useState({}), currNode = _b[0], setCurrNode = _b[1];
    React.useEffect(function () {
        fetch('/api/v1/users/' + props.profileId.toString())
            .then(function (res) { return res.json(); })
            .then(function (data) {
            setCurrNode(data);
        });
    }, []);
    var _c = React.useState(false), open = _c[0], setOpen = _c[1];
    var handleDialogOpen = function () {
        setOpen(true);
    };
    var handleDialogClose = function () {
        setOpen(false);
    };
    var useRef = React.useRef;
    var fgRef = useRef();
    var handleNodeClick = function (node) {
        fgRef.current.zoom(8, 2000);
        fgRef.current.centerAt(node.x, node.y, 1000);
    };
    var handleNodeRightClick = function (node) {
        setCurrNode(node);
        handleDialogOpen();
    };
    var handleBackgroundClick = function () {
        fgRef.current.zoom(3, 2000);
        fgRef.current.centerAt(0, 0, 1000);
    };
    var handleBackgroundRightClick = function () {
        fgRef.current.zoom(1, 2000);
        fgRef.current.centerAt(0, 0, 1000);
    };
    return (React.createElement("div", null,
        React.createElement(core_1.Dialog, { onClose: handleDialogClose, open: open },
            React.createElement(RecurserCard_1.RecurserCard, { node: currNode })),
        React.createElement(react_force_graph_2d_1["default"], { ref: fgRef, graphData: graphData, nodeLabel: "name", nodeAutoColorBy: "name", linkDirectionalParticles: 2, linkDirectionalParticleWidth: 1.4, onNodeClick: handleNodeClick, onNodeRightClick: handleNodeRightClick, onBackgroundClick: handleBackgroundClick, onBackgroundRightClick: handleBackgroundRightClick })));
};
