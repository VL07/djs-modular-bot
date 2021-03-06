const { Schema, model } = require("mongoose");

const GuildPluginSchema = new Schema({
	guildId: {
		type: String,
		required: true,
	},
	vars: {
		type: Schema.Types.Mixed,
		default: {},
	},
	hiddenVars: {
		type: Schema.Types.Mixed,
		default: {},
	},
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
	canBeDisabled: {
		type: Boolean,
		required: true,
	},
	canBeEnabled: {
		type: Boolean,
		required: true,
	},
}, { minimize: false });

const GuildModule = model("GuildPlugins", GuildPluginSchema);

module.exports = GuildModule;
