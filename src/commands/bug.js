const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	command: new SlashCommandBuilder()
		.setName("bug")
		.setDescription("Report a bug"),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setColor("2F3136")
			.setTitle("🐛 | Bug")
			// Temporary link
			.setDescription("Report a bug by clicking [here](https://github.com/VL07/djs-modular-bot/issues)")
			.setFooter({ text: "/help" })
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel("Report a bug")
							.setStyle("LINK")
							.setEmoji("🔗")
							.setURL("https://github.com/VL07/djs-modular-bot/issues"),
					),
			],
		});
	},
};