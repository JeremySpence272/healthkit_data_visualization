import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	LineElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	LineElement
);

const LineChartCard = ({ data }) => {
	// Accept data as a prop
	return (
		<Line
			data={data}
			width={"100%"}
			options={{
				maintainAspectRatio: false,
				scales: {
					y: {
						min: 165,
						max: 190,
					},
				},
			}}
		/>
	);
};

const BarChartCard = ({ data }) => {
	// Accept data as a prop
	return (
		<Bar data={data} width={"100%"} options={{ maintainAspectRatio: false }} />
	);
};

export { LineChartCard, BarChartCard };
