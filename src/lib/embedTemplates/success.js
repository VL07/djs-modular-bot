const { MessageEmbed } = require("discord.js");

module.exports = function createSuccessEmbed(commandName, description) {
	return new MessageEmbed()
		.setColor("2F3136")
		.setTitle(`✅ | ${commandName}`)
		.setDescription(description)
		.setFooter({ text: "/help" })
		.setTimestamp();
};