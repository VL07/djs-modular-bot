const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	command: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Get the bots invite link"),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setColor("2F3136")
			.setTitle("🔗 | Invite")
			// Temporary link
			.setDescription("Invite the bot by clicking [here](https://google.com)")
			.setFooter({ text: "/help" })
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel("Invite")
							.setStyle("LINK")
							.setEmoji("🔗")
							.setURL("https://google.com"),
					),
			],
		});
	},
};