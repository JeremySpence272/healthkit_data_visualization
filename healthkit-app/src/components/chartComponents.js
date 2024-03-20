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
	const options = {
		maintainAspectRatio: false,
		scales: {
			y: {
				display: true,
				afterDataLimits: (axis) => {
					const padding = 0.3;
					const dataRange = axis.max - axis.min;
					const expandedRange = dataRange * padding;

					axis.max += expandedRange;
					axis.min -= expandedRange;
				},
			},
		},
	};
	return <Line data={data} width={"100%"} options={options} />;
};

const BarChartCard = ({ data }) => {
	const options = { maintainAspectRatio: false };
	return <Bar data={data} width={"100%"} options={options} />;
};

export { LineChartCard, BarChartCard };
