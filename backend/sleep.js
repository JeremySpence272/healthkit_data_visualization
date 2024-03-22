const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
	"./data/database.db",
	sqlite3.OPEN_READWRITE,
	(err) => {
		if (err) console.log(err.message);
	}
);

const query = `SELECT * FROM all_records WHERE type = 'HKCategoryTypeIdentifierSleepAnalysis' ORDER BY startDate ASC`;

db.all(query, [], (err, rows) => {
	if (err) console.log(err);
	returnNightOne(rows).forEach((night) => {
		console.log(night);
	});
});

function returnNightOne(rows) {
	let nightsArr = [];
	let prevEndDate;
	let fellAsleepRecord = null;
	let lastSleepRecord = null;

	let coreCounter = 0;
	let remCounter = 0;
	let deepCounter = 0;
	let awakeCounter = 0;

	rows.forEach((row) => {
		if (row.value !== "HKCategoryValueSleepAnalysisInBed") {
			const startDate = new Date(row.startDate);
			const endDate = new Date(row.endDate);

			// Check for start of a new night
			if (!fellAsleepRecord || startDate - prevEndDate > 600000) {
				//console.log(`STARTING NIGHT FOR ${row.startDate}`);
				fellAsleepRecord = row;
			}

			// Accumulate sleep data
			const elapsedMilliseconds = endDate - startDate;
			switch (row.value) {
				case "HKCategoryValueSleepAnalysisAsleepDeep":
					deepCounter += elapsedMilliseconds;
					break;
				case "HKCategoryValueSleepAnalysisAsleepCore":
					coreCounter += elapsedMilliseconds;
					break;
				case "HKCategoryValueSleepAnalysisAsleepREM":
					remCounter += elapsedMilliseconds;
					break;
				case "HKCategoryValueSleepAnalysisAwake":
					awakeCounter += elapsedMilliseconds;
					break;
			}

			// Check for wake-up time (end of a night's sleep)
			if (
				lastSleepRecord &&
				startDate - new Date(lastSleepRecord.endDate) > 600000
			) {
				//console.log(`WOKE UP AT ${lastSleepRecord.endDate}`);

				// Correctly calculate timeAsleep and initialize a new night object here
				let night = {
					date: fellAsleepRecord.startDate,
					fellAsleepTime: fellAsleepRecord.startDate,
					wokeUpTime: lastSleepRecord.endDate,
					timeAsleep:
						(lastSleepRecord.endDate - fellAsleepRecord.startDate) /
						(1000 * 60), // Corrected calculation
					timesleeping_deep: deepCounter / (1000 * 60),
					timesleeping_rem: remCounter / (1000 * 60),
					timesleeping_core: coreCounter / (1000 * 60),
					timesleeping_awake: awakeCounter / (1000 * 60),
				};

				nightsArr.push(night);

				// Reset for the next night
				fellAsleepRecord = null;
				coreCounter = 0;
				remCounter = 0;
				deepCounter = 0;
				awakeCounter = 0;
			}

			prevEndDate = endDate;
			lastSleepRecord = row; // Update lastSleepRecord to the current row at each iteration
		}
	});

	// Consider adding logic here to handle the last sleep record if it ends a night

	return nightsArr;
}

/*
nights = {
    record id: autoincrement
    date: night fell asleep - date value of asleeptime
    asleeptime: datestr - There's no record with an end date less than 10 mins before this start date
    awaketime: datestr - There's no record with a start date less than 10 mins after this end date
    timesleeping: hr:min - asleeptime -> awaketime interval
    timesleeping-deep: hr:min - is within bounds of start and end date. add to sum of elapsed time for all records of HKCategoryValueSleepAnalysisAsleepDeep
    timesleeping-core: hr:min - is within bounds of start and end date. add to sum of elapsed time for all records of HKCategoryValueSleepAnalysisAsleepDeep
    timesleeping-rem: hr:min - is within bounds of start and end date. add to sum of elapsed time for all records of HKCategoryValueSleepAnalysisAsleepDeep
    timesleeping-awake: hr:min - is within bounds of start and end date. add to sum of elapsed time for all records of HKCategoryValueSleepAnalysisAsleepDeep
}

for some reason the times are 1hr off the actual times (5am says 6am)
looking at "value" , "startDate", "creationDate"

*/
