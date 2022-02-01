const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	command: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Get the bots ping"),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setColor("2F3136")
			.setTitle("🏓 | Ping")
			.setDescription(`Bot latency: \`Loading...\`\nWebsocket latency: \`${interaction.client.ws.ping}ms\``)
			.setFooter({ text: "/help" })
			.setTimestamp();

		const message = await interaction.reply({ embeds: [embed], fetchReply: true });

		embed.setDescription(`Bot latency: \`${message.createdTimestamp - interaction.createdTimestamp}ms\`\nWebsocket latency: \`${interaction.client.ws.ping}ms\``);

		await interaction.editReply({ embeds: [embed] });
	},
};