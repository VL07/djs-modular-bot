const { Client, Intents } = require("discord.js");
const fs = require("fs");

require("dotenv").config();

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
	],
});

const eventFiles = fs
	.readdirSync("./src/events")
	.filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const commandFiles = fs
	.readdirSync("./src/commands")
	.filter(file => file.endsWith(".js"));

client.commands = {};
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands[command.command.name] = command;
}

client.login(process.env.TOKEN);