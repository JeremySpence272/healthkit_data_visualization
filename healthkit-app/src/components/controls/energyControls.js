import React, { useState } from "react";
import ChildControls from "./childControls";

const EnergyControls = ({ onControlChange }) => {
	const [controls, setControls] = useState({
		period: "999999",
		dataType: "total",
		interval: "daily",
		compare: false,
	});

	const typeOptions = ["total", "active", "basal"];

	return (
		<ChildControls
			controls={controls}
			setControls={setControls}
			typeOptions={typeOptions}
			onControlChange={onControlChange}
		/>
	);
};

export { EnergyControls };
