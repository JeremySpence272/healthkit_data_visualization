import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChartCard } from "./chartComponents.js";

const scaleOptions = {
	maintainAspectRatio: false,
	scales: {
		y: {
			min: 165,
			max: 190,
		},
	},
};

const WeightChartComponent = () => {
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [],
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("http://localhost:5000/data/weight");
				const labels = response.data.map((item) => item.date);
				const weightData = response.data.map((item) => item.weight);

				setChartData({
					labels: labels,
					datasets: [
						{
							label: "Weight",
							data: weightData,
							backgroundColor: "rgba(70, 130, 180, 0.2)",
							borderColor: "rgba(70, 130, 180, 1)",
							borderWidth: 1,
						},
					],
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return <LineChartCard data={chartData} options={scaleOptions} />;
};

export { WeightChartComponent };
