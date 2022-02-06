const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require("discord.js");
const createSuccessEmbed = require("../../../lib/embedTemplates/success");

module.exports = {
	command: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Create a poll")
		.addStringOption(option =>
			option
				.setName("question")
				.setDescription("The question")
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName("answer1")
				.setDescription("Answer (leave blank for yes or no question)")
				.setRequired(false),
		)
		.addStringOption(option =>
			option
				.setName("answer2")
				.setDescription("Answer (leave blank for yes or no question)")
				.setRequired(false),
		)
		.addStringOption(option =>
			option
				.setName("answer3")
				.setDescription("Answer (leave blank for yes or no question)")
				.setRequired(false),
		)
		.addStringOption(option =>
			option
				.setName("answer4")
				.setDescription("Answer (leave blank for yes or no question)")
				.setRequired(false),
		)
		.addStringOption(option =>
			option
				.setName("answer5")
				.setDescription("Answer (leave blank for yes or no question)")
				.setRequired(false),
		),
	permissions: ["MANAGE_MESSAGES"],
	async execute(interaction, doc) {
		const question = interaction.options.getString("question");

		const a1 = interaction.options.getString("answer1");
		const a2 = interaction.options.getString("answer2");
		const a3 = interaction.options.getString("answer3");
		const a4 = interaction.options.getString("answer4");
		const a5 = interaction.options.getString("answer5");

		let answers = [a1, a2, a3, a4, a5];
		answers = answers.filter(x => x !== null);

		if (!answers.length) {
			answers = ["Yes", "No"];
		}

		const row = new MessageActionRow();
		const row2 = new MessageActionRow();

		if (answers.length <= 3) {
			for (const [i, answer] of answers.entries()) {
				row.addComponents(
					new MessageButton()
						.setCustomId(String(i))
						.setLabel(answer)
						.setStyle("PRIMARY"),
				);
			}

			row.addComponents(
				new MessageButton()
					.setLabel("End vote")
					.setStyle("DANGER")
					.setCustomId("end"),
			);
		} else {
			const dropdown = new MessageSelectMenu()
				.setCustomId("dropdown")
				.setPlaceholder("Vote here");

			const options = [];
			for (const [i, answer] of answers.entries()) {
				options.push({
					label: answer,
					value: String(i),
				});
			}

			dropdown.addOptions(options);

			row.addComponents(dropdown);

			row2.addComponents(
				new MessageButton()
					.setLabel("End vote")
					.setStyle("DANGER")
					.setCustomId("end"),
			);
		}

		let strOptions = "";
		for (const answer of answers) {
			strOptions += `${answer}: \`0%\`\n`;
		}

		const embed = new MessageEmbed()
			.setColor("2F3136")
			.setTitle(question)
			.setDescription(`${strOptions}Total votes: \`0\``);

		let message;

		if (row2.components.length) {
			message = await interaction.channel.send({ embeds: [embed], components: [row, row2], fetchReply: true });
		} else {
			message = await interaction.channel.send({ embeds: [embed], components: [row], fetchReply: true });
		}

		const votes = [];

		for (const i in answers) {
			votes.splice(i, 0, []);
		}

		if (!doc.hiddenVars.polls) {
			doc.hiddenVars.polls = {};
		}

		doc.hiddenVars.polls[message.id] = {
			creator: message.author.id,
			votes: votes,
			titles: answers,
		};

		doc.markModified("hiddenVars");

		await doc.save();

		await interaction.reply({ embeds: [createSuccessEmbed("Poll", `Successfully created poll, view it [here](${message.url})`)], ephemeral: true });
	},
};