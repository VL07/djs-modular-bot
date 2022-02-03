const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
	ownerDiscordId: {
		type: String,
		required: true,
	},
	plugins: [{
		type: Schema.Types.ObjectId,
		ref: "GuildPlugin",
		required: true,
	}],
	guildId: {
		type: String,
		required: true,
	},
});

const Guild = model("Guilds", guildSchema);

module.exports = Guild;