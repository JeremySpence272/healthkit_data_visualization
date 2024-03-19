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
			x: {
				display: true, //set false to remove ticks on x-axis
			},

			// this will set top and bottom limit
			// y: {
			// 	min: 165,
			// 	max: 190,
			// },
		},
	};
	return <Line data={data} width={"100%"} options={options} />;
};

const BarChartCard = ({ data }) => {
	const options = { maintainAspectRatio: false };
	return <Bar data={data} width={"100%"} options={options} />;
};

export { LineChartCard, BarChartCard };
