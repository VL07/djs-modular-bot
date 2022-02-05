const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
	ownerDiscordId: {
		type: String,
		required: true,
	},
	modules: {
		type: Schema.Types.Mixed,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
		unique: true,
	},
});

const Guild = model("Guilds", guildSchema);

module.exports = Guild;