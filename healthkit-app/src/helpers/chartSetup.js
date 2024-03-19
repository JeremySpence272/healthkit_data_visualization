const getChartData = (response, type, isCompare) => {
	const green = {
		backgroundColor: "rgba(60, 179, 113, 0.2)",
		borderColor: "rgba(60, 179, 113, 1)",
	};
	const red = {
		backgroundColor: "rgba(255, 99, 71, 0.2)",
		borderColor: "rgba(255, 99, 71, 1)",
	};

	let outputData = {
		label: !isCompare
			? "Total Energy Burned (kCal)"
			: "Total Energy Burned (Compared) (kCal)",
		data: [],
		backgroundColor: !isCompare ? green.backgroundColor : red.backgroundColor,
		borderColor: !isCompare ? green.borderColor : red.borderColor,
		borderWidth: 1,
	};

	switch (type) {
		case "basal":
			outputData.label = !isCompare
				? "Basal Energy Burned (kCal)"
				: "Basal Energy Burned (Compared) (kCal)";
			outputData.data = response.map((item) => (item ? item.basal : null));
			outputData.backgroundColor = !isCompare
				? green.backgroundColor
				: red.backgroundColor;
			outputData.borderColor = !isCompare ? green.borderColor : red.borderColor;
			break;
		case "active":
			outputData.label = !isCompare
				? "Active Energy Burned (kCal)"
				: "Active Energy Burned (Compared) (kCal)";
			outputData.data = response.map((item) => (item ? item.active : null));
			outputData.backgroundColor = !isCompare
				? green.backgroundColor
				: red.backgroundColor;
			outputData.borderColor = !isCompare ? green.borderColor : red.borderColor;
			break;
		default:
			outputData.data = response.map((item) => (item ? item.total : null));
			break;
	}

	return outputData;
};

export { getChartData };
