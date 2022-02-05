const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
	command: new SlashCommandSubcommandBuilder()
		.setName("test")
		.setDescription("Test the bot"),
	async execute(interaction) {
		await interaction.reply("test");
	},
};