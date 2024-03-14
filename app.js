const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
	"./data/database.db",
	sqlite3.OPEN_READWRITE,
	(err) => {
		if (err) {
			console.error(err.message);
		}
		console.log("Connected to the database.");
	}
);

app.use(cors()); // Enables CORS for your frontend

const weightQuery = `
SELECT * FROM weight_log
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

const energyQuery = `
SELECT * FROM daily_energy
ORDER BY date ASC
`;

app.get("/data/energy", (req, res) => {
	db.all(energyQuery, [], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json(rows);
	});
});

const heartQuery = `
SELECT * FROM daily_heart
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
