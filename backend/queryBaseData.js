const sqlite3 = require("sqlite3").verbose();

// Open the SQLite database
const db = new sqlite3.Database(
	"./data/database.db",
	sqlite3.OPEN_READWRITE,
	(err) => {
		if (err) console.error(err);
	}
);

const typeQuery = `
SELECT DISTINCT type FROM all_records;

`;

db.all(typeQuery, (err, rows) => {
	if (rows) {
		rows.forEach((row) => {
			console.log(row.type);
		});
	} else {
		console.error(err);
	}
});
