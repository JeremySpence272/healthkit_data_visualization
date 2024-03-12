const fs = require("fs");
const readline = require("readline");
const sqlite3 = require("sqlite3").verbose();

// Open the SQLite database
const db = new sqlite3.Database(
	"./heartrate.db",
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
	`CREATE TABLE IF NOT EXISTS all_heart_rate_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT,
  sourceName TEXT,
  sourceVersion TEXT,
  unit TEXT,
  creationDate TEXT,
  startDate TEXT,
  endDate TEXT,
  value TEXT
)`,
	(err) => {
		if (err) {
			console.error(err.message);
		} else {
			console.log("Table for HeartRate records created or already exists.");
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
		if (record.type === "HKQuantityTypeIdentifierHeartRate") {
			// Log the record to the console
			//console.log(record);

			// Insert the record into the SQLite database
			const insert = `INSERT INTO all_heart_rate_records (type, sourceName, sourceVersion, unit, creationDate, startDate, endDate, value)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

			db.run(
				insert,
				[
					record.type,
					record.sourceName,
					record.sourceVersion,
					record.unit,
					record.creationDate,
					record.startDate,
					record.endDate,
					record.value,
				],
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
