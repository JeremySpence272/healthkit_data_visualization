const fs = require("fs");
const readline = require("readline");
const sqlite3 = require("sqlite3").verbose();

// Open the SQLite database
const db = new sqlite3.Database(
	"./energy.db",
	sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
	(err) => {
		if (err) {
			console.error(err.message);
		}
		console.log("Connected to the SQLite database.");
	}
);

// Create the table for HeartRate records if it doesn't exist
db.run(
	`CREATE TABLE IF NOT EXISTS all_records (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		type TEXT,
		sourceName TEXT,
		date TEXT,
		value TEXT
	)`,
	(err) => {
		if (err) {
			console.error(err.message);
		} else {
			console.log("Table for energy records created or already exists.");
		}
	}
);

// Prepare to read the data.json file
const jsonFilePath = "./data/data.json";
const fileStream = fs.createReadStream(jsonFilePath);

const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
});

// Read the file line by line
rl.on("line", (line) => {
	try {
		const record = JSON.parse(line);

		if (
			record.type === "HKQuantityTypeIdentifierActiveEnergyBurned" ||
			record.type === "HKQuantityTypeIdentifierBasalEnergyBurned"
		) {
			const type =
				record.type === "HKQuantityTypeIdentifierActiveEnergyBurned"
					? "Active"
					: "Basal";

			const insert = `INSERT INTO all_records (type, sourceName, date, value)
							VALUES (?, ?, ?, ?)`;

			db.run(
				insert,
				[type, record.sourceName, record.endDate, record.value],
				(err) => {
					if (err) {
						console.error("Error inserting record into database:", err.message);
					}
				}
			);
		}
	} catch (err) {
		console.error("Error parsing line from file:", err);
	}
});

rl.on("close", () => {
	console.log("Finished reading the file.");
	// Close the database connection
	db.close((err) => {
		if (err) {
			console.error(err.message);
		}
		console.log("Closed the database connection.");
	});
});
