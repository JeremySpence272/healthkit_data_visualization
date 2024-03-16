const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

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

app.get("/data/energy", (req, res) => {
	const { start, end } = req.query;
	let params = [];

	let energyQuery = `SELECT * FROM energy`;

	if (start && end) {
		energyQuery += ` WHERE date >= ? AND date <= ?`;
		params.push(start, end);
	}

	energyQuery += ` ORDER BY date ASC`;

	db.all(energyQuery, params, (err, rows) => {
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
