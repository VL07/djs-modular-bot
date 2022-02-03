const mongoose = require("mongoose");

module.exports = async () => {
	try {
		console.log("Connecting to db...");
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Successfully connected to db!");
	} catch (error) {
		console.error(error);
	}
};