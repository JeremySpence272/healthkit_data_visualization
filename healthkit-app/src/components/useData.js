import { useState, useEffect } from "react";
import axios from "axios";
import { getChartData } from "../helpers/chartSetup";

const useData = (apiEndpoint, defaultDataType) => {
	const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
	const [dataType, setDataType] = useState(defaultDataType);
	const [interval, setInterval] = useState("daily");
	const [chartData, setChartData] = useState({ labels: [], datasets: [] });
	const [compareDateRange, setCompareDateRange] = useState({
		compareStartDate: "",
		compareEndDate: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const params = {
					start: dateRange.startDate,
					end: dateRange.endDate,
					compareStart: compareDateRange.compareStartDate,
					compareEnd: compareDateRange.compareEndDate,
					interval: interval,
				};
				let response = await axios.get(apiEndpoint, { params });

				const primaryData = response.data.primaryData || [];
				const datasets = [getChartData(primaryData, dataType, false)];

				const compareData = response.data.compareData;
				if (compareData) {
					const nullsNeeded = primaryData.length - compareData.length;
					const correctedCompareData =
						nullsNeeded > 0
							? [...Array(nullsNeeded).fill(null), ...compareData]
							: compareData;
					datasets.push(getChartData(correctedCompareData, dataType, true));
				}

				setChartData({
					labels: primaryData.map((item) => item.date),
					datasets: datasets,
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [apiEndpoint, dateRange, dataType, compareDateRange, interval]);

	const handleControlChange = ({ period, dataType, interval, compare }) => {
		const today = new Date(2024, 2, 10); // Last Data Point - Change when update
		const adjustDate = (days) =>
			new Date(today.getTime() - days * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0];

		const endDate = today;
		const startDate = adjustDate(period);

		setDateRange({ startDate, endDate });
		setDataType(dataType);
		setInterval(interval);

		setCompareDateRange(
			compare
				? {
						compareStartDate: adjustDate(period * 2),
						compareEndDate: startDate,
				  }
				: {
						compareStartDate: "",
						compareEndDate: "",
				  }
		);
	};

	return {
		chartData,
		handleControlChange,
		setDataType,
		setInterval,
		setCompareDateRange,
	};
};

export default useData;
