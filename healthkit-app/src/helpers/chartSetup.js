const getChartData = (response, type, isCompare) => {
	const colors = {
		blue: {
			backgroundColor: "rgba(000, 122, 255, 0.2)",
			borderColor: "rgba(000, 122, 255, 1)",
		},
		red: {
			backgroundColor: "rgba(255, 99, 71, 0.2)",
			borderColor: "rgba(255, 99, 71, 1)",
		},
	};

	const { backgroundColor, borderColor } = isCompare ? colors.red : colors.blue;

	const typeMap = {
		basal: "Basal Energy Burned (kCal)",
		active: "Active Energy Burned (kCal)",
		total: "Total Energy Burned (kCal)",
		avg: "Average HR (BPM)",
		max: "Maximum HR (BPM)",
		min: "Minimum HR (BPM)",
		restingAvg: "Average Resting HR (BPM)",
		weight: "Weight (LBS)",
	};

	const labelPrefix = isCompare ? " (Compared)" : "";
	const dataKey = typeMap[type] ? type : "total";

	return {
		label: typeMap[dataKey] + labelPrefix,
		data: response.map((item) => (item ? item[dataKey] : null)),
		backgroundColor,
		borderColor,
		borderWidth: 1.5,
	};
};

export { getChartData };
