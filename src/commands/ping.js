const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	command: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pong"),
	async execute(interaction) {
		await interaction.reply("Pong");
	},
};