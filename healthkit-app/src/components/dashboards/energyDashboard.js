import React, { useState, useEffect } from "react";
import axios from "axios";
import { EnergyControls } from "../controls/energyControls";
import { LineChartCard } from "../charts/chartComponents";
import { getChartData } from "../../helpers/chartSetup";

const EnergyDashboard = () => {
	const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
	const [dataType, setDataType] = useState("total");
	const [interval, setInterval] = useState("daily");

	const [chartData, setChartData] = useState({ labels: [], datasets: [] });
	const [compareDateRange, setCompareDateRange] = useState({
		compareStartDate: "",
		compareEndDate: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log(interval);
				let response;
				let comparedResponse;
				let data = [];
				if (
					compareDateRange.compareStartDate &&
					compareDateRange.compareEndDate
				) {
					let r = await axios.get("http://localhost:5000/data/energy", {
						params: {
							start: dateRange.startDate,
							end: dateRange.endDate,
							compareStart: compareDateRange.compareStartDate,
							compareEnd: compareDateRange.compareEndDate,
							interval: interval,
						},
					});

					console.log(r);

					response = r.data.primaryData;
					comparedResponse = r.data.compareData;

					// MAKE DATA SAME LENGTH IF COMPARE NOT LONG ENOUGH
					const lengthDifference = response.length - comparedResponse.length;
					let updatedComparedResponseData;
					if (lengthDifference > 0) {
						updatedComparedResponseData = Array(lengthDifference)
							.fill(null)
							.concat(comparedResponse);
					} else {
						updatedComparedResponseData = comparedResponse;
					}

					data.push(getChartData(response, dataType, false));
					data.push(getChartData(updatedComparedResponseData, dataType, true));
				} else {
					if (dateRange.startDate && dateRange.endDate) {
						let r = await axios.get("http://localhost:5000/data/energy", {
							params: {
								start: dateRange.startDate,
								end: dateRange.endDate,
								interval: interval,
							},
						});
						response = r.data.primaryData;
					} else {
						let r = await axios.get("http://localhost:5000/data/energy");
						response = r.data.primaryData;
					}

					data.push(getChartData(response, dataType, false));
				}

				setChartData({
					labels: response.map((item) => item.date),
					datasets: data,
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [dateRange, dataType, compareDateRange, interval]);

	const handleControlChange = (period, dataType, interval, compare) => {
		const today = new Date(2024, 2, 10); //SET SPECIFIC DATE FOR NOW BECAUSE DATA NOT UPDATED
		const endDate = today.toISOString().split("T")[0];
		const startDate = new Date(today.setDate(today.getDate() - period))
			.toISOString()
			.split("T")[0];

		setDateRange({
			startDate: startDate,
			endDate: endDate,
		});
		setDataType(dataType);
		setInterval(interval);

		if (compare) {
			const comparePeriod = parseInt(period) * 2;

			const compareEndDate = startDate;

			const compareStartDate = new Date(
				today.setDate(today.getDate() - parseInt(comparePeriod))
			)
				.toISOString()
				.split("T")[0];

			setCompareDateRange({
				compareStartDate: compareStartDate,
				compareEndDate: compareEndDate,
			});
		} else {
			setCompareDateRange({
				compareStartDate: "",
				compareEndDate: "",
			});
		}
	};

	return (
		<div className="dashboard">
			<div className="card chart">
				<LineChartCard data={chartData} />
			</div>
			<div className="card controls">
				<EnergyControls onControlChange={handleControlChange} />
			</div>
		</div>
	);
};

export { EnergyDashboard };
