const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
	command: new SlashCommandSubcommandBuilder()
		.setName("test")
		.setDescription("Test the bot"),
	async execute(interaction, doc) {
		console.log(doc);
		await interaction.reply("test");
	},
};