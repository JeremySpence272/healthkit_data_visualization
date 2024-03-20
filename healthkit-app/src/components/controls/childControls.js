import React from "react";

export default function ChildControls({
	controls,
	setControls,
	typeOptions,
	onControlChange,
}) {
	const handleChange = (e) => {
		if (e.target.name === "compareCheckbox") {
			setControls((prev) => ({ ...prev, compare: e.target.checked }));
		} else {
			setControls((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onControlChange(controls);
	};

	const intervalOptions = ["daily", "weekly", "monthly"];

	return (
		<form onSubmit={handleSubmit}>
			<div className="control date-dropdown">
				<label htmlFor="periodDropdown">Select Period:</label>
				<select
					id="dropdown"
					name="period"
					value={controls.period}
					onChange={handleChange}
				>
					<option value="999999">All Time</option>
					<option value="7">Last Week</option>
					<option value="30">Last Month</option>
					<option value="90">Last 90 Days</option>
					<option value="180">Last 6 Months</option>
					<option value="365">Last Year</option>
				</select>
			</div>

			<div className="control data-type">
				{typeOptions.map((type) => {
					return (
						<React.Fragment key={type}>
							<label htmlFor={`dataType-${type}`}> {type} </label>
							<input
								type="radio"
								id={`dataType-${type}`}
								name="dataType"
								value={type}
								checked={controls.dataType === type}
								onChange={handleChange}
							/>
						</React.Fragment>
					);
				})}
			</div>
			<div className="control select-interval">
				{intervalOptions.map((interval) => {
					return (
						<React.Fragment key={interval}>
							<label htmlFor={`interval-${interval}`}> {interval} </label>
							<input
								type="radio"
								id={`interval-${interval}`}
								name="interval"
								value={interval}
								checked={controls.interval === interval}
								onChange={handleChange}
							/>
						</React.Fragment>
					);
				})}
			</div>

			<div className="control compare-box">
				<label htmlFor="compareCheckbox"> compare w/ prev period</label>
				<input
					type="checkbox"
					name="compareCheckbox"
					value="compare"
					disabled={controls.period === "999999"}
					checked={controls.compare}
					onChange={handleChange}
				/>
			</div>
			<button className="submit-button" type="submit">
				Go
			</button>
		</form>
	);
}
