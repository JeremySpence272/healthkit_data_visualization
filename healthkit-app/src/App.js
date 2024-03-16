import React from "react";
import { EnergyDashboard } from "./components/dashboards/energyDashboard";

// import { WeightChartComponent } from "./components/charts/weightChart";
// import { HeartChartComponent } from "./components/charts/heartChart";

import "./App.css";

function App() {
	return (
		<div className="App">
			<EnergyDashboard />

			{/* <div className="card chart">
				<WeightChartComponent />
			</div>
			<div className="card chart">
				<HeartChartComponent />
			</div> */}
		</div>
	);
}

export default App;
