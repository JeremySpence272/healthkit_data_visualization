const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
// const dateConverter = require("./helpers/dateConverter");

const db = new sqlite3.Database(
	"./data/daily_database.db",
	sqlite3.OPEN_READONLY,
	(err) => {
		if (err) {
			console.error(err.message);
		}
		console.log("Connected to the database.");
	}
);

app.use(cors()); // Enables CORS for your frontend

//////////////////////////////////////////////////////////////

const weightQuery = `
SELECT * FROM weight
ORDER BY date ASC
`;

app.get("/data/weight", (req, res) => {
	db.all(weightQuery, [], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json(rows);
	});
});

const heartQuery = `
SELECT * FROM heart
ORDER BY date ASC
`;

app.get("/data/heart", (req, res) => {
	db.all(heartQuery, [], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json(rows);
	});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

app.get("/data/energy", (req, res) => {
	//PARAMS.. PERIOD | TYPE | COMPARE | INTERVAL

	const { start, end, compareStart, compareEnd, interval } = req.query;
	let params = [];
	let groupBy;

	// Determine the SQL GROUP BY clause based on the interval
	switch (interval) {
		case "weekly":
			groupBy = "strftime('%Y-W%W', date)"; // Group by ISO week
			break;
		case "monthly":
			groupBy = "strftime('%Y-%m', date)"; // Group by month
			break;
		default:
			groupBy = "strftime('%Y-%m-%d', date)"; // Group by day
			break;
	}

	let energyQuery = `
		SELECT 
    	${groupBy} AS date, 
    	ROUND(AVG(total)) as total, 
    	ROUND(AVG(active)) as active, 
    	ROUND(AVG(basal)) as basal
		FROM energy

    `;

	if (start && end) {
		energyQuery += ` WHERE date >= ? AND date <= ?`;
		params.push(start, end);
	}

	energyQuery += ` GROUP BY ${groupBy} ORDER BY date ASC`;

	let response = {};

	db.all(energyQuery, params, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		rows.forEach((row) => {
			if (interval === "weekly") {
				row.date = getWeeklyLabel(row.date);
			} else if (interval === "monthly") {
				row.date = getMonthlyLabel(row.date);
			}
			response.primaryData = rows;
		});
		if (compareStart && compareEnd) {
			console.log("we are comparing");
			response.primaryData = rows;
			const compareParams = [compareStart, compareEnd];
			db.all(energyQuery, compareParams, (compareErr, compareRows) => {
				if (compareErr) {
					res.status(500).json({ error: err.message });
					return;
				}
				compareRows.forEach((row) => {
					if (interval === "weekly") {
						row.date = getWeeklyLabel(row.date);
					} else if (interval === "monthly") {
						row.date = getMonthlyLabel(row.date);
					}
				});

				response.compareData = compareRows;
				res.json(response);
			});
		} else {
			res.json(response);
		}
	});
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
