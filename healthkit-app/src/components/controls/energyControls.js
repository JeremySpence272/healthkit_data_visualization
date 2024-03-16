import React, { useState } from "react";

const EnergyControls = ({ onControlChange }) => {
	const [localStartDate, setLocalStartDate] = useState("");
	const [localEndDate, setLocalEndDate] = useState("");
	const [includeTotal, setIncludeTotal] = useState(true);
	const [includeActive, setIncludeActive] = useState(true);
	const [includeBasal, setIncludeBasal] = useState(true);
	const [chartType, setChartType] = useState("line");

	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent form submission from refreshing the page
		onControlChange(
			localStartDate,
			localEndDate,
			includeTotal,
			includeActive,
			includeBasal,
			chartType
		);
	};
	return (
		<form onSubmit={handleSubmit}>
			<div className="date-picker">
				<label>
					{" "}
					Start Date
					<input
						type="date"
						value={localStartDate}
						onChange={(e) => setLocalStartDate(e.target.value)}
					/>
				</label>

				<label>
					End Date
					<input
						type="date"
						value={localEndDate}
						onChange={(e) => setLocalEndDate(e.target.value)}
					/>
				</label>
			</div>
			<div className="checkboxes">
				<label>
					<input
						type="checkbox"
						checked={includeTotal === true}
						onChange={(e) => setIncludeTotal(e.target.checked)}
					/>
					Total
				</label>
				<label>
					<input
						type="checkbox"
						checked={includeActive === true}
						onChange={(e) => setIncludeActive(e.target.checked)}
					/>
					Active
				</label>
				<label>
					<input
						type="checkbox"
						checked={includeBasal === true}
						onChange={(e) => setIncludeBasal(e.target.checked)}
					/>
					Basal
				</label>
			</div>
			<div className="radio-buttons">
				<label>
					<input
						type="radio"
						name="chartType"
						value="line"
						checked={chartType === "line"}
						onChange={(e) => setChartType(e.target.value)}
					/>
					Line Chart
				</label>
				<label>
					<input
						type="radio"
						name="chartType"
						value="bar"
						checked={chartType === "bar"}
						onChange={(e) => setChartType(e.target.value)}
					/>
					Bar Chart
				</label>
			</div>

			<button type="submit">Go</button>
		</form>
	);
};

export { EnergyControls };
