import React, { useState } from "react";

const EnergyControls = ({ onControlChange }) => {
	const [period, setPeriod] = useState("999999");
	const [dataType, setDataType] = useState("total");
	const [interval, setInterval] = useState("daily");
	const [compare, setCompare] = useState(false);
	// THESE SHOULD ALL BE SET TO ONE VARIABLE

	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent form submission from refreshing the page
		onControlChange(period, dataType, interval, compare);
	};
	return (
		<form onSubmit={handleSubmit}>
			<div className="control date-dropdown">
				<label>
					Select Period:
					<select
						id="dropdown"
						value={period}
						onChange={(e) => setPeriod(e.target.value)}
					>
						<option value="999999">All Time</option>
						<option value="7">Last Week</option>
						<option value="30">Last Month</option>
						<option value="90">Last 90 Days</option>
						<option value="180">Last 6 Months</option>
						<option value="365">Last Year</option>
					</select>
				</label>
			</div>

			<div className="control data-type">
				<label>
					<input
						type="radio"
						name="dataType"
						value="total"
						checked={dataType === "total"}
						onChange={(e) => setDataType(e.target.value)}
					/>
					Total
				</label>
				<label>
					<input
						type="radio"
						name="dataType"
						value="active"
						checked={dataType === "active"}
						onChange={(e) => setDataType(e.target.value)}
					/>
					Active
				</label>
				<label>
					<input
						type="radio"
						name="dataType"
						value="basal"
						checked={dataType === "basal"}
						onChange={(e) => setDataType(e.target.value)}
					/>
					Basal
				</label>
			</div>
			<div className="control select-interval">
				<label>
					<input
						type="radio"
						name="interval"
						value="daily"
						checked={interval === "daily"}
						onChange={(e) => setInterval(e.target.value)}
					/>
					Daily
				</label>
				<label>
					<input
						type="radio"
						name="interval"
						value="weekly"
						checked={interval === "weekly"}
						onChange={(e) => setInterval(e.target.value)}
					/>
					Weekly
				</label>
				<label>
					<input
						type="radio"
						name="interval"
						value="monthly"
						checked={interval === "monthly"}
						onChange={(e) => setInterval(e.target.value)}
					/>
					Monthly
				</label>
			</div>
			<div className="control compare-box">
				<label>
					<input
						type="checkbox"
						name="compare"
						value="compare"
						disabled={period === "999999"}
						checked={compare}
						onChange={(e) => setCompare(e.target.checked)}
					/>
					compare with previous period ?
				</label>
			</div>
			<button className="submit-button" type="submit">
				Go
			</button>
		</form>
	);
};

export { EnergyControls };
