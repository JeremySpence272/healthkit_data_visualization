const fs = require("fs");
const readline = require("readline");

const jsonFilePath = "./data/data.json";

// Create a read stream and a readline interface
const readStream = fs.createReadStream(jsonFilePath);
const rl = readline.createInterface({
	input: readStream,
	crlfDelay: Infinity, // Recognize all instances of CR LF ('\r\n') as a single line break
});

const uniqueRecordTypes = new Set();

rl.on("line", (line) => {
	try {
		const record = JSON.parse(line); // Parse each line as JSON
		uniqueRecordTypes.add(record.type); // Collect unique record types
	} catch (err) {
		console.error("Error parsing line:", err);
	}
});

rl.on("close", () => {
	console.log(Array.from(uniqueRecordTypes)); // Log unique record types after processing all lines
});
