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

const LineChartCard = ({ data, options }) => {
	return <Line data={data} width={"100%"} options={options} />;
};

const BarChartCard = ({ data, options }) => {
	return <Bar data={data} width={"100%"} options={options} />;
};

export { LineChartCard, BarChartCard };
