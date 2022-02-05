const { REST } = require("@discordjs/rest");
const GuildModule = require("../db/models/guildModule");
const { Routes } = require("discord-api-types/v9");

module.exports = {
	dontAdd: true,
	name: "module",
	async execute(interaction) {
		const moduleName = interaction.options.getSubcommandGroup();
		const action = interaction.options.getSubcommand();

		const moduleDoc = await GuildModule.findOne({ guildId: interaction.guildId, name: moduleName });

		const rest = new REST({
			"version": "9",
		}).setToken(process.env.TOKEN);

		if (!moduleDoc) {
			throw "Doc not found";
		}

		if (action === "disable") {
			if (!moduleDoc.canBeDisabled) {
				interaction.reply("Cannot be disabled");
				return;
			} else if (!moduleDoc.enabled) {
				interaction.reply("Already disabled");
				return;
			}

			moduleDoc.enabled = false;

			const commands = await interaction.guild.commands.fetch();

			console.log(commands);

			commands.find(c => c.name === moduleName).delete();

			await moduleDoc.save();

			interaction.reply("Successfully disabled");
		} else if (action === "enable") {
			if (!moduleDoc.canBeEnabled) {
				interaction.reply("Cannot be enabled");
				return;
			} else if (moduleDoc.enabled) {
				interaction.reply("Already enabled");
				return;
			}

			moduleDoc.enabled = true;

			// await rest.put(Routes.applicationGuildCommand(interaction.client.user.id, interaction.guildId), {
			// 	body: [interaction.client.moduleCommands[moduleName].command.toJSON()],
			// });

			await interaction.guild.commands.create(
				interaction.client.moduleCommands[moduleName].command.toJSON(),
			);

			await moduleDoc.save();

			interaction.reply("Successfully enabled");
		}
	},
};