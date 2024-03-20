import React from "react";

import "./App.css";
import { Dashboard } from "./components/dashboard";

const chartInfo = {
	energy: {
		endpointURL: "http://localhost:5000/data/energy",
		dataTypeOptions: ["total", "active", "basal"],
	},
	heart: {
		endpointURL: "http://localhost:5000/data/heart",
		dataTypeOptions: ["avg", "max", "min", "restingAvg"],
	},
	weight: {
		endpointURL: "http://localhost:5000/data/weight",
		dataTypeOptions: ["weight"],
	},
};

function App() {
	return (
		<div className="App">
			{Object.keys(chartInfo).map((chartKey) => {
				console.log(chartInfo[chartKey]);
				return (
					<Dashboard
						key={chartKey}
						endpointURL={chartInfo[chartKey].endpointURL}
						dataTypeOptions={chartInfo[chartKey].dataTypeOptions}
					/>
				);
			})}
		</div>
	);
}

export default App;
