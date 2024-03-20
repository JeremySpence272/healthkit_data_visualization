import React from "react";
import { LineChartCard } from "./chartComponents";
import useData from "./useData";
import { Controls } from "./controls";

const Dashboard = ({ endpointURL, dataTypeOptions }) => {
	const { chartData, handleControlChange } = useData(
		endpointURL,
		dataTypeOptions[0]
	);

	return (
		<div className="dashboard">
			<div className="card chart">
				<LineChartCard data={chartData} />
			</div>
			<div className="card controls">
				<Controls
					onControlChange={handleControlChange}
					dataTypeOptions={dataTypeOptions}
				/>
			</div>
		</div>
	);
};

export { Dashboard };
