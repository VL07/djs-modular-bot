const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	command: new SlashCommandBuilder()
		.setName("bot")
		.setDescription("Commands about the bot")
		.addSubcommand(option =>
			option
				.setName("ping")
				.setDescription("Get the bots ping"),
		)
		.addSubcommand(option =>
			option
				.setName("invite")
				.setDescription("Get the bots invite link"),
		)
		.addSubcommand(option =>
			option
				.setName("bug")
				.setDescription("Report a bug"),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === "ping") {
			const embed = new MessageEmbed()
				.setColor("2F3136")
				.setTitle("🏓 | Ping")
				.setDescription(`Bot latency: \`Loading...\`\nWebsocket latency: \`${interaction.client.ws.ping}ms\``)
				.setFooter({ text: "/help" })
				.setTimestamp();

			const message = await interaction.reply({ embeds: [embed], fetchReply: true });

			embed.setDescription(`Bot latency: \`${message.createdTimestamp - interaction.createdTimestamp}ms\`\nWebsocket latency: \`${interaction.client.ws.ping}ms\``);

			await interaction.editReply({ embeds: [embed] });
		} else if (interaction.options.getSubcommand() === "invite") {
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
		} else if (interaction.options.getSubcommand() === "bug") {
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
		}
	},
};