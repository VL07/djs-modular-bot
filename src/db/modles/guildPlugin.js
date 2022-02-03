const { Schema, model } = require("mongoose");

const GuildPluginSchema = new Schema({
	guild: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Guild",
	},
	vars: [{
		type: Schema.Types.Mixed,
		default: {},
	}],
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	enabled: {
		type: Boolean,
		required: true,
	},
}, { minimize: false });

const GuildPlugin = model("GuildPlugins", GuildPluginSchema);

module.exports = GuildPlugin;
