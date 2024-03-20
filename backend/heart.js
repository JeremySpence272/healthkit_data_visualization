class DailyHR {
	constructor(day, max, min, avg, restingAvg) {
		this.date = day;
		this.max = max;
		this.min = min;
		this.avg = avg;
		this.restingAvg = restingAvg;
	}
}

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data/database.db", (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log("Connected to the SQLite database.");
});

const query = `
SELECT SUBSTR(creationDate, 1, 10) AS date,
AVG(CASE 
	WHEN type = 'HKQuantityTypeIdentifierHeartRate' 
	THEN CAST(value AS FLOAT) 
END) AS average,
MIN(CASE 
	WHEN type = 'HKQuantityTypeIdentifierHeartRate' 
	THEN CAST(value AS FLOAT) 
END) AS minimum,
MAX(CASE 
	WHEN type = 'HKQuantityTypeIdentifierHeartRate' 
	THEN CAST(value AS FLOAT) 
END) AS maximum,
AVG(CASE 
	WHEN type = 'HKQuantityTypeIdentifierRestingHeartRate' 
	THEN CAST(value AS FLOAT) 
END) AS restingAvg
       
FROM all_records
GROUP BY SUBSTR(creationDate, 1, 10);

`;

function queryDatabase() {
	return new Promise((resolve, reject) => {
		db.all(query, (err, rows) => {
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
async function getDays() {
	try {
		const rows = await queryDatabase();
		const dailyArr = [];
		rows.forEach((row) => {
			let day = new DailyHR(
				row.date,
				row.maximum,
				row.minimum,
				row.average,
				row.restingAvg
			);
			dailyArr.push(day);
		});

		//initDailyTable();
		fillDailyTable(dailyArr);

		// console.log(dailyArr);
	} catch (error) {
		console.error("Failed to query database", error);
	} finally {
		// Close the database connection here
		db.close((err) => {
			if (err) {
				console.error("Error closing the database", err.message);
			} else {
				console.log("Database connection closed.");
			}
		});
	}
}

getDays();

function fillDailyTable(dailyData) {
	db.run(
		`CREATE TABLE IF NOT EXISTS daily_heart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      max TEXT,
      min TEXT,
      avg TEXT,
      restingAvg TEXT
    )`,
		(err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.log("Table for HeartRate records created or already exists.");
			}
		}
	);

	for (let record of dailyData) {
		// Insert the record into the SQLite database
		const insert = `INSERT INTO daily_heart (date, max, min, avg, restingAvg)
    VALUES (?, ?, ?, ?, ?)`;

		db.run(
			insert,
			[record.date, record.max, record.min, record.avg, record.restingAvg],
			(err) => {
				if (err) {
					console.error("Error inserting record into database:", err.message);
				}
			}
		);
	}
}
