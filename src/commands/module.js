const GuildModule = require("../db/models/guildModule");
const createWarningEmbed = require("../lib/embedTemplates/warning");
const createSuccessEmbed = require("../lib/embedTemplates/success");

module.exports = {
	dontAdd: true,
	name: "module",
	async execute(interaction) {
		const moduleName = interaction.options.getSubcommandGroup();
		const action = interaction.options.getSubcommand();

		const moduleDoc = await GuildModule.findOne({ guildId: interaction.guildId, name: moduleName });

		if (!moduleDoc) {
			throw "Doc not found";
		}

		if (action === "disable") {
			if (!moduleDoc.canBeDisabled) {
				await interaction.reply({ embeds: [createWarningEmbed("Module", "Cannot disable this module")] });
				return;
			} else if (!moduleDoc.enabled) {
				await interaction.reply({ embeds: [createWarningEmbed("Module", "The module is already disabled")] });
				return;
			}

			moduleDoc.enabled = false;

			const commands = await interaction.guild.commands.fetch();

			console.log(commands);

			commands.find(c => c.name === moduleName).delete();

			await moduleDoc.save();

			await interaction.reply({ embeds: [createSuccessEmbed("Module", "Successfully disabled the module")] });
		} else if (action === "enable") {
			if (!moduleDoc.canBeEnabled) {
				await interaction.reply({ embeds: [createWarningEmbed("Module", "Cannot enable this module")] });
				return;
			} else if (moduleDoc.enabled) {
				await interaction.reply({ embeds: [createWarningEmbed("Module", "The module is already enabled")] });
				return;
			}

			moduleDoc.enabled = true;

			await interaction.guild.commands.create(
				interaction.client.moduleCommands[moduleName].command.toJSON(),
			);

			await moduleDoc.save();

			await interaction.reply({ embeds: [createSuccessEmbed("Module", "Successfully enabled the module")] });
		}
	},
};