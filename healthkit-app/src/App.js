import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register the components you need
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

function App() {
	return (
		<div className="App">
			<h1>Hello HealthKit</h1>
			<Bar
				data={{
					labels: ["a", "b", "c"],
					datasets: [
						{
							label: "please",
							data: [1, 2, 3],
							backgroundColor: [
								"rgba(255, 99, 132, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(255, 206, 86, 0.2)",
							],
							borderColor: [
								"rgba(255,99,132,1)",
								"rgba(54, 162, 235, 1)",
								"rgba(255, 206, 86, 1)",
							],
							borderWidth: 1,
						},
					],
				}}
				options={{
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				}}
			/>
		</div>
	);
}

export default App;
