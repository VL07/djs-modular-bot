const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const GuildModule = require("../db/models/guildModule");

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		console.log(`${interaction.user.tag} ran command /${interaction.commandName}`);

		let command = interaction.client.commands[interaction.commandName];

		if (!command || !command.execute) {
			command = interaction.client.moduleSubcommands[`${interaction.commandName}-${interaction.options.getSubcommand()}`];
		}

		console.log(command);
		console.log(interaction.client.commands);
		console.log(interaction.commandName);

		try {
			const moduleDoc = await GuildModule.findOne({ name: interaction.commandName, guildId: interaction.guildId });
			await command.execute(interaction, moduleDoc);
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