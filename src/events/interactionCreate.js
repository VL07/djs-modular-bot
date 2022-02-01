const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		console.log(`${interaction.user.tag} ran command /${interaction.commandName}`);

		const command = interaction.client.commands[interaction.commandName];

		try {
			command.execute(interaction);
		} catch (err) {
			if (err) console.error("Error while running command: \n", err);

			const embed = new MessageEmbed()
				.setColor("2F3136")
				.setTitle("❌ | Error")
				.setDescription("An error occurred while running the command")
				.setTimestamp()
				.setFooter({ text: "Use /help to get help" });

			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
				components: [
					new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setEmoji("🐛")
								.setLabel("Report a bug")
								.setStyle("LINK")
								.setURL("https://github.com/VL07/djs-modular-bot/issues"),
						),
				],
			});
		}
	},
};