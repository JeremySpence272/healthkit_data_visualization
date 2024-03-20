const fs = require("fs");
const csv = require("csv-parser");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data/database.db", (err) => {
	if (err) console.error(err.message);
});

// db.run(
// 	`CREATE TABLE IF NOT EXISTS weight_log (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       date TEXT,
//       weight TEXT
//     )`,
// 	(err) => {
// 		if (err) {
// 			console.error(err.message);
// 		} else {
// 			console.log("Table for HeartRate records created or already exists.");
// 		}
// 	}
// );

fs.createReadStream("./data/weight.csv")
	.pipe(csv())
	.on("data", (data) => {
		console.log(`Date: ${data["date"]} - Weight ${data["weight"]}`);
		const insert = `INSERT INTO weight_log (date, weight)
		    VALUES (?, ?)`;

		db.run(insert, [data.date, data.weight], (err) => {
			if (err) {
				console.error("Error inserting record into database:", err.message);
			}
		});
	})
	.on("end", () => {
		console.log("successfully logged weights");
	});
