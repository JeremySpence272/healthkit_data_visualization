class DailyEnergy {
	constructor(date, active, basal, total) {
		this.date = date;
		this.basal = basal;
		this.active = active;
		this.total = total;
	}
}

const sqlite3 = require("sqlite3").verbose();
const oldDB = new sqlite3.Database(
	"./data/database.db",
	sqlite3.OPEN_READWRITE
);
const newDB = new sqlite3.Database(
	"./data/daily_database.db",
	sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
);

const energyQuery = `
SELECT * FROM daily_energy
ORDER BY date ASC
`;

const energyTable = `CREATE TABLE IF NOT EXISTS energy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    basal TEXT,
    active TEXT,
    total TEXT
  )`;

const heartQuery = `
  SELECT * FROM daily_heart
  ORDER BY date ASC
  `;

const heartTable = `CREATE TABLE IF NOT EXISTS heart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      max TEXT,
      min TEXT,
      avg TEXT,
      restingAvg TEXT
    )`;

const weightQuery = `
    SELECT * FROM weight_log
    ORDER BY date ASC
    `;

const weightTable = `CREATE TABLE IF NOT EXISTS weight (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        weight TEXT
      )`;

function createTable(table) {
	newDB.run(table);
}

function queryAllRecords(query) {
	return new Promise((resolve, reject) => {
		oldDB.all(query, (err, rows) => {
			if (err) {
				console.error("Error executing select query", err.message);
				reject(err);
				return;
			} else {
				resolve(rows);
			}
		});
	});
}

// Async function to use await
async function insertRecords() {
	try {
		const rows = await queryAllRecords(weightQuery);
		rows.forEach((row) => {
			const insert = `INSERT INTO weight (date, weight) VALUES (?, ?)`;

			newDB.run(insert, [row.date, row.weight], (err) => {
				if (err) {
					console.error("Error inserting record into database:", err.message);
				}
			});
		});
	} catch (error) {
		console.error("Failed to query database", error);
	} finally {
		newDB.close((err) => {
			if (err) {
				console.error("Error closing the database", err.message);
			} else {
				console.log("Database connection closed.");
			}
		});
	}
}

// createTable(heartTable);
insertRecords();
