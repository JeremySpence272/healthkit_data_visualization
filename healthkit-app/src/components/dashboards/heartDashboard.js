import React from "react";
import { LineChartCard } from "../chartComponents";
import { HeartControls } from "../controls/heartControls";
import useData from "../useData";

const HeartDashboard = () => {
	const { chartData, handleControlChange } = useData(
		"http://localhost:5000/data/heart",
		"avg"
	);

	return (
		<div className="dashboard">
			<div className="card chart">
				<LineChartCard data={chartData} />
			</div>
			<div className="card controls">
				<HeartControls onControlChange={handleControlChange} />
			</div>
		</div>
	);
};

export { HeartDashboard };
