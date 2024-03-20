import React from "react";
import { LineChartCard } from "../charts/chartComponents";
import { EnergyControls } from "../controls/energyControls";
import useData from "./useData";

const EnergyDashboard = () => {
	const { chartData, handleControlChange } = useData(
		"http://localhost:5000/data/energy",
		"total"
	);

	return (
		<div className="dashboard">
			<div className="card chart">
				<LineChartCard data={chartData} />
			</div>
			<div className="card controls">
				<EnergyControls onControlChange={handleControlChange} />
			</div>
		</div>
	);
};

export { EnergyDashboard };
