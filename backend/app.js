const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
	"./data/daily_database.db",
	sqlite3.OPEN_READONLY
);

app.use(cors());
//////////////////////////////////////////////////////////////

// Common function to fetch data and process it
function fetchDataAndRespond(tableName, groupByFields, res, reqQuery) {
	const { start, end, compareStart, compareEnd, interval } = reqQuery;
	let params = [];
	let groupBy = "strftime('%Y-%m-%d', date)";

	switch (interval) {
		case "weekly":
			groupBy = "strftime('%Y-W%W', date)";
			break;
		case "monthly":
			groupBy = "strftime('%Y-%m', date)";
			break;
	}

	let query = `
        SELECT 
        ${groupBy} AS date, 
        ${groupByFields}
        FROM ${tableName}
    `;

	if (start && end) {
		query += ` WHERE date >= ? AND date <= ?`;
		params.push(start, end);
	}

	query += ` GROUP BY ${groupBy} ORDER BY date ASC`;

	const fetchData = (q, p) =>
		new Promise((resolve, reject) => {
			db.all(q, p, (err, rows) => {
				if (err) reject(err);
				else
					resolve(
						rows.map((row) => ({
							...row,
							date:
								interval === "weekly"
									? getWeeklyLabel(row.date)
									: interval === "monthly"
									? getMonthlyLabel(row.date)
									: row.date,
						}))
					);
			});
		});

	Promise.all([
		fetchData(query, params),
		compareStart && compareEnd
			? fetchData(query, [compareStart, compareEnd])
			: Promise.resolve(null),
	])
		.then(([primaryData, compareData]) =>
			res.json({ primaryData, compareData })
		)
		.catch((err) => res.status(500).json({ error: err.message }));
}

app.get("/data/energy", (req, res) => {
	const groupByFields = `ROUND(AVG(total)) as total, ROUND(AVG(active)) as active, ROUND(AVG(basal)) as basal`;
	fetchDataAndRespond("energy", groupByFields, res, req.query);
});

app.get("/data/heart", (req, res) => {
	const groupByFields = `ROUND(AVG(avg)) as avg, ROUND(AVG(max)) as max, ROUND(AVG(min)) as min, ROUND(AVG(restingAvg)) as restingAvg`;
	fetchDataAndRespond("heart", groupByFields, res, req.query);
});

app.get("/data/weight", (req, res) => {
	const groupByFields = `ROUND(AVG(weight)) as weight`;
	fetchDataAndRespond("weight", groupByFields, res, req.query);
});

// HELPER FUNCTIONS

function getMonthlyLabel(date) {
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const [year, month] = date.split("-");
	return year + " - " + monthNames[parseInt(month, 10) - 1];
}

function getWeeklyLabel(date) {
	const [year, weekStr] = date.split("-W");
	const weekNumber = parseInt(weekStr, 10);
	const startDate = new Date(year, 0, 1);

	const dayOffset = (weekNumber - 1) * 7 - startDate.getDay();
	startDate.setDate(startDate.getDate() + dayOffset);

	const endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + 6);

	return endDate.toISOString().split("T")[0]; // Return only the end date in YYYY-MM-DD format
}

///////////////////////////////////////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
