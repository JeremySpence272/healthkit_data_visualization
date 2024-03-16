import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChartCard } from "./chartComponents.js";

const EnergyChartComponent = () => {
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [],
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("http://localhost:5000/data/energy");
				const labels = response.data.map((item) => item.date);
				const totalEnergyData = response.data.map((item) => item.total);
				const activeEnergyData = response.data.map((item) => item.active);
				const basalEnergyData = response.data.map((item) => item.basal);

				setChartData({
					labels: labels,
					datasets: [
						{
							label: "Total Energy Burned (kCal)",
							data: totalEnergyData,
							backgroundColor: "rgba(60, 179, 113, 0.2)",
							borderColor: "rgba(60, 179, 113, 1)",
							borderWidth: 1,
						},
						{
							label: "Active Energy Burned (kCal)",
							data: activeEnergyData,
							backgroundColor: "rgb(255, 99, 71, 0.2)",
							borderColor: "rgb(255, 99, 71, 1)",
							borderWidth: 1,
						},
						{
							label: "Basal Energy Burned (kCal)",
							data: basalEnergyData,
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

export { EnergyChartComponent };
