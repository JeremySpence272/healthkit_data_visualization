import React from "react";
import {
	EnergyChartComponent,
	WeightChartComponent,
	HeartChartComponent,
} from "./dataComponents";

import "./App.css";

function App() {
	return (
		<div className="App">
			<div className="datacard wide">
				<EnergyChartComponent />
			</div>
			<div className="datacard wide">
				<WeightChartComponent />
			</div>
			<div className="datacard wide">
				<HeartChartComponent />
			</div>
		</div>
	);
}

export default App;
