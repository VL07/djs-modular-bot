const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const GuildModule = require("../db/models/guildModule");
const createWarningEmbed = require("../lib/embedTemplates/warning");

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

		if (command.permissions) {
			let hasPermission = false;
			for (const permission of command.permissions) {
				if (interaction.member.permissions.has(permission)) {
					hasPermission = true;
					break;
				}
			}
			if (interaction.member.permissions.has("ADMINISTRATOR")) {
				hasPermission = true;
			}

			if (!hasPermission) {
				let permissionStr = command.permissions[0];
				if (command.permissions.length > 1) {
					permissionStr = `${command.permissions.slice(0, -1).join(", ")} or ${command.permissions[command.permissions.length - 1]}`;
				}

				interaction.reply({ embeds: [createWarningEmbed("Missing permissions", `Required permissions: \`${permissionStr}\``)], ephemeral: true });
				return;
			}
		}

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