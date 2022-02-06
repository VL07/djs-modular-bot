const { MessageActionRow } = require("discord.js");
const GuildModule = require("../../../db/models/guildModule");
const createSuccessEmbed = require("../../../lib/embedTemplates/success");

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction) {
		if (!interaction.isSelectMenu() && !interaction.isButton()) { return; }

		const moduleDoc = await GuildModule.findOne({ name: "poll", guildId: interaction.guildId });

		if (!(interaction.message.id in moduleDoc.hiddenVars.polls)) { return; }

		const messageId = interaction.message.id;

		const embed = interaction.message.embeds[0];

		let customId = interaction.customId;

		if (customId === "dropdown") {
			customId = interaction.values[0];
		}

		if (customId === "end") {
			embed.setTitle("Ended: " + embed.title);

			const components = [];

			for (const componentRow of interaction.message.components) {
				const row = new MessageActionRow();
				for (const component of componentRow.components) {
					row.addComponents(component.setDisabled(true));
				}
				components.push(row);
			}

			let winner = [];
			let winnerVotes = 0;

			for (const [i, option] of Object.entries(moduleDoc.hiddenVars.polls[messageId].votes)) {
				if (option.length == winnerVotes) {
					winner.push(moduleDoc.hiddenVars.polls[messageId].titles[i]);
				} else if (option.length > winnerVotes) {
					winnerVotes = option.length;
					winner = [moduleDoc.hiddenVars.polls[messageId].titles[i]];
				}
			}

			embed.setDescription(`**Winner: __${winner.join(", ")}__**\n${embed.description}`);

			delete moduleDoc.hiddenVars.polls[messageId];

			moduleDoc.markModified("hiddenVars");
			await moduleDoc.save();

			await interaction.message.edit({ embeds: [embed], components: components });

			interaction.reply({ embeds: [createSuccessEmbed("Poll", "Successfully ended the vote")], ephemeral: true });

			return;
		}

		for (const [i, option] of Object.entries(moduleDoc.hiddenVars.polls[messageId].votes)) {
			if (option.includes(interaction.user.id)) {
				const indexOfItem = moduleDoc.hiddenVars.polls[messageId].votes[i].indexOf(interaction.user.id);
				moduleDoc.hiddenVars.polls[messageId].votes[i].splice(indexOfItem, 1);

				moduleDoc.hiddenVars.polls[messageId].votes[parseInt(customId)].push(interaction.user.id);

				moduleDoc.markModified("hiddenVars");

				await moduleDoc.save();

				let asStr = "";
				let totalVotes = 0;

				for (const arrVotes of moduleDoc.hiddenVars.polls[messageId].votes) {
					totalVotes += arrVotes.length;
				}

				for (const [index, v] of Object.entries(moduleDoc.hiddenVars.polls[messageId].votes)) {
					const title = moduleDoc.hiddenVars.polls[messageId].titles[index];
					const percent = Math.round((v.length / totalVotes) * 100);
					asStr += `${title}: \`${percent}% (${v.length} votes)\`\n`;
				}

				embed.setDescription(`${asStr}Total votes: \`${totalVotes}\``);

				await interaction.message.edit({ embeds: [embed] });

				await interaction.reply({ embeds: [createSuccessEmbed("Voted", "Successfully changed your vote")], ephemeral: true });
				return;
			}
		}

		console.log(customId);
		moduleDoc.hiddenVars.polls[messageId].votes[parseInt(customId)].push(interaction.user.id);

		moduleDoc.markModified("hiddenVars");

		await moduleDoc.save();

		let asStr = "";
		let totalVotes = 0;

		for (const arrVotes of moduleDoc.hiddenVars.polls[messageId].votes) {
			totalVotes += arrVotes.length;
		}

		for (const [index, v] of Object.entries(moduleDoc.hiddenVars.polls[messageId].votes)) {
			const title = moduleDoc.hiddenVars.polls[messageId].titles[index];
			const percent = Math.round((v.length / totalVotes) * 100);
			asStr += `${title}: \`${percent}% (${v.length} votes)\`\n`;
		}

		embed.setDescription(`${asStr}Total votes: \`${totalVotes}\``);

		await interaction.message.edit({ embeds: [embed] });

		await interaction.reply({ embeds: [createSuccessEmbed("Voted", "Successfully voted")], ephemeral: true });
		return;
	},
};