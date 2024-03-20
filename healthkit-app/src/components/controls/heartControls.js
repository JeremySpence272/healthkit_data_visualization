import React, { useState } from "react";
import ChildControls from "./childControls";

const HeartControls = ({ onControlChange }) => {
	const [controls, setControls] = useState({
		period: "999999",
		dataType: "avg",
		interval: "daily",
		compare: false,
	});

	const typeOptions = ["avg", "max", "min", "restingAvg"];

	return (
		<ChildControls
			controls={controls}
			setControls={setControls}
			typeOptions={typeOptions}
			onControlChange={onControlChange}
		/>
	);
};

export { HeartControls };
