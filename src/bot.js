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

client.login(process.env.TOKEN);