const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		console.log(`${client.user.username} is now running!`);

		const clientId = client.user.id;

		const rest = new REST({
			"version": "9",
		}).setToken(process.env.TOKEN);

		const commands = client.commands;

		(async () => {
			try {
				if (process.env.MODE === "PRODUCTION") {
					const commandsArr = [];
					for (const key in commands) {
						commandsArr.push(commands[key].command.toJSON());
					}
					await rest.put(Routes.applicationCommands(clientId), {
						body: commandsArr,
					});
					console.log("Successfully registered commands globally");
				} else {
					const commandsArr = [];
					for (const key in commands) {
						commandsArr.push(commands[key].command.toJSON());
					}
					await rest.put(Routes.applicationGuildCommands(clientId, process.env.GUILD_ID), {
						body: commandsArr,
					});
					console.log("Successfully registered commands locally");
				}
			} catch (err) {
				if (err) console.error(err);
			}
		})();
	},
};