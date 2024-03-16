import React, { useState, useEffect } from "react";
import axios from "axios";
// import { EnergyChartComponent } from "../charts/energyChart";
import { EnergyControls } from "../controls/energyControls";
import { LineChartCard, BarChartCard } from "../charts/chartComponents";

const EnergyDashboard = () => {
	const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
	const [includeData, setIncludeData] = useState({
		includeTotal: true,
		includeActive: true,
		includeBasal: true,
	});
	const [chartData, setChartData] = useState({ labels: [], datasets: [] });
	const [chartType, setChartType] = useState("line");

	useEffect(() => {
		const fetchData = async () => {
			try {
				let response;
				if (dateRange.startDate && dateRange.endDate) {
					response = await axios.get("http://localhost:5000/data/energy", {
						params: {
							start: dateRange.startDate,
							end: dateRange.endDate,
						},
					});
				} else {
					response = await axios.get("http://localhost:5000/data/energy");
				}

				// Process your response and update chart data
				const labels = response.data.map((item) => item.date);
				let dataToInclude = [];
				if (includeData.includeTotal) {
					const totalEnergyData = response.data.map((item) => item.total);
					const totalData = {
						label: "Total Energy Burned (kCal)",
						data: totalEnergyData,
						backgroundColor: "rgba(60, 179, 113, 0.2)",
						borderColor: "rgba(60, 179, 113, 1)",
						borderWidth: 1,
					};
					dataToInclude.push(totalData);
				}
				if (includeData.includeActive) {
					const activeEnergyData = response.data.map((item) => item.active);
					const activeData = {
						label: "Active Energy Burned (kCal)",
						data: activeEnergyData,
						backgroundColor: "rgb(255, 99, 71, 0.2)",
						borderColor: "rgb(255, 99, 71, 1)",
						borderWidth: 1,
					};
					dataToInclude.push(activeData);
				}
				if (includeData.includeBasal) {
					const basalEnergyData = response.data.map((item) => item.basal);
					const basalData = {
						label: "Basal Energy Burned (kCal)",
						data: basalEnergyData,
						backgroundColor: "rgba(70, 130, 180, 0.2)",
						borderColor: "rgba(70, 130, 180, 1)",
						borderWidth: 1,
					};
					dataToInclude.push(basalData);
				}

				setChartData({
					labels: labels,
					datasets: dataToInclude,
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [dateRange, includeData]);

	const handleControlChange = (
		startDate,
		endDate,
		includeTotal,
		includeActive,
		includeBasal,
		updatedChartType
	) => {
		setDateRange({ startDate, endDate });
		setIncludeData({ includeTotal, includeActive, includeBasal });
		setChartType(updatedChartType);
	};

	return (
		<div className="dashboard">
			<div className="card chart">
				{chartType === "line" ? (
					<LineChartCard
						data={chartData}
						options={{ maintainAspectRatio: false }}
					/>
				) : (
					<BarChartCard
						data={chartData}
						options={{ maintainAspectRatio: false }}
					/>
				)}
			</div>
			<div className="card controls">
				<EnergyControls onControlChange={handleControlChange} />
			</div>
		</div>
	);
};

export { EnergyDashboard };
