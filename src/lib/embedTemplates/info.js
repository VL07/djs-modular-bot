const { MessageEmbed } = require("discord.js");

module.exports = function createInfoEmbed(commandName, description) {
	return new MessageEmbed()
		.setColor("2F3136")
		.setTitle(`ℹ️ | ${commandName}`)
		.setDescription(description)
		.setFooter({ text: "/help" })
		.setTimestamp();
};