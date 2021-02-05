import * as React from 'react';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import { TextField } from '@material-ui/core';


interface Props {
	profileID: number;
}

export const FuzzySearchBar: React.FC<Props> = ({ profileID} ) => {
	// const [graphData, setGraphData] = React.useState({ nodes: [], links: [] });
	// React.useEffect(() => {
	// 	fetch('/api/v1/graph/' + profileID.toString())
	// 		.then(res => res.json())
	// 		.then(data => {
	// 			setGraphData(data);
	// 		});
	// }, []);

	return (
    <h1>{ profileID }</h1>
	);
};
