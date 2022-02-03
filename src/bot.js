const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } = require("@discordjs/builders");
const fs = require("fs");
const connectToDb = require("./db/connect");

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

client.moduleCommands = {};
client.moduleSubcommands = {};
client.modules = [];

const moduleFiles = fs
	.readdirSync("./src/modules", { withFileTypes: true })
	.filter(file => file.isDirectory())
	.map(file => file.name);

for (const file of moduleFiles) {

	const info = require(`${__dirname}/modules/${file}/info.js`);
	client.modules.push(info);
	const moduleCommandFiles = fs
		.readdirSync(`${__dirname}/modules/${file}/commands`)
		.filter(commandFile => commandFile.endsWith(".js"));
	const moduleEventFiles = fs
		.readdirSync(`${__dirname}/modules/${file}/events`)
		.filter(commandFile => commandFile.endsWith(".js"));

	for (const eventFile of moduleEventFiles) {
		const event = require(`${__dirname}/modules/${file}/events/${eventFile}`);

		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	const baseCommand = new SlashCommandBuilder()
		.setName(info.name)
		.setDescription(info.description);

	for (const commnadFile of moduleCommandFiles) {
		const command = require(`${__dirname}/modules/${file}/commands/${commnadFile}`);

		if (command.command instanceof SlashCommandSubcommandBuilder) {
			console.log("sub cmd");
			baseCommand.addSubcommand(command.command);
			client.moduleSubcommands[`${info.name}-${command.command.name}`] = command;
		} else if (command.command instanceof SlashCommandSubcommandGroupBuilder) {
			console.log("sub group");
			baseCommand.addSubcommandGroup(command.command);
			client.moduleSubcommands[`${info.name}-${command.command.name}`] = command;
		} else {
			console.error("Not a valid type: ", typeof command.command);
		}
	}

	console.log(baseCommand.toJSON());

	const commandObject = {
		command: baseCommand,
	};

	if (info.global) {
		client.commands[info.name] = commandObject;
	} else {
		client.moduleCommands[info.name] = commandObject;
	}

	console.log(`Successfully loaded module '${file}'`);
}

connectToDb()
	.then(() => {
		client.login(process.env.TOKEN);
	})
	.catch(err => {
		console.error(err);
	});

