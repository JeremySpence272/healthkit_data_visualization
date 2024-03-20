class DailyEnergy {
	constructor(date, total, active, basal) {
		this.date = date;
		this.basal = basal;
		this.active = active;
	}

	getTotal() {
		return this.basal + this.active;
	}
}

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
	"./data/database.db",
	sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
	(err) => {
		if (err) {
			console.error(err.message);
		}
		console.log("Connected to the SQLite database.");
	}
);

const totalsQuery = `
SELECT 
    SUBSTR(endDate, 1, 10) AS date, 
    SUM(CASE 
            WHEN type = 'HKQuantityTypeIdentifierActiveEnergyBurned' 
            THEN CAST(value AS FLOAT) 
            ELSE 0 
        END) AS activeTotal, 
    SUM(CASE 
            WHEN type = 'HKQuantityTypeIdentifierBasalEnergyBurned' 
            THEN CAST(value AS FLOAT) 
            ELSE 0 
        END) AS basalTotal
FROM all_records
GROUP BY SUBSTR(endDate, 1, 10);


`;

function fillDailyTable(dailyData) {
	db.run(
		`CREATE TABLE IF NOT EXISTS daily_energy (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      basal TEXT,
      active TEXT,
      total TEXT
    )`,
		(err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.log("Table for energy records created or already exists.");
			}
		}
	);

	for (let record of dailyData) {
		// Insert the record into the SQLite database
		const insert = `INSERT INTO daily_energy (date, basal, active, total)
    VALUES (?, ?, ?, ?)`;

		db.run(
			insert,
			[record.date, record.basal, record.active, record.getTotal()],
			(err) => {
				if (err) {
					console.error("Error inserting record into database:", err.message);
				}
			}
		);
	}
}

function queryAllRecords() {
	return new Promise((resolve, reject) => {
		db.all(totalsQuery, (err, rows) => {
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
		const rows = await queryAllRecords();
		const dailyArr = [];
		rows.forEach((row) => {
			let day = new DailyEnergy(
				row.date,
				row.total,
				row.activeTotal,
				row.basalTotal
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
