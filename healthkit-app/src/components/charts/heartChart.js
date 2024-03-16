import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChartCard } from "./chartComponents.js";

const HeartChartComponent = () => {
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [],
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("http://localhost:5000/data/heart");
				const labels = response.data.map((item) => item.date);
				const averageHeartData = response.data.map((item) => item.avg);
				const averageRestingHeartData = response.data.map(
					(item) => item.restingAvg
				);

				setChartData({
					labels: labels,
					datasets: [
						{
							label: "Average HR (bpm)",
							data: averageHeartData,
							backgroundColor: "rgb(255, 99, 71, 0.2)",
							borderColor: "rgb(255, 99, 71, 1)",
							borderWidth: 1,
						},
						{
							label: "Average Resting HR (bpm)",
							data: averageRestingHeartData,
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

	return (
		<BarChartCard data={chartData} options={{ maintainAspectRatio: false }} />
	);
};

export { HeartChartComponent };
