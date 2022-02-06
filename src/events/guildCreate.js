const { REST } = require("@discordjs/rest");
const Guild = require("../db/models/guild");
const GuildModule = require("../db/models/guildModule");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } = require("@discordjs/builders");

module.exports = {
	name: "guildCreate",
	once: false,
	execute(guild) {
		console.log("Joined a new guild: " + guild.name);

		const moduleSlashCommand = new SlashCommandBuilder()
			.setName("module")
			.setDescription("Edit and view modules");

		(async () => {
			try {
				const rest = new REST({
					"version": "9",
				}).setToken(process.env.TOKEN);


				const guildDoc = await Guild.findOne({ guildId: guild.id });

				console.log(guildDoc);
				if (!guildDoc) {
					const newGuildDoc = new Guild({
						"ownerDiscordId": guild.ownerId,
						"modules": {},
						"guildId": guild.id,
					});

					await newGuildDoc.save();
					console.log("Document created");

					const moduleRefs = {};
					const commandsArr = [];

					for (const guildModule of guild.client.modules) {
						console.log(`Adding ${guildModule.name} to guild modules`);

						const moduleDoc = new GuildModule({
							"guildId": guild.id,
							name: guildModule.name,
							description: guildModule.description,
							enabled: guildModule.enabledByDefault,
							vars: guildModule.vars,
							canBeDisabled: guildModule.canBeDisabled || true,
							canBeEnabled: guildModule.canBeEnabled || true,
							hiddenVars: guildModule.hiddenVars || {},
						});

						await moduleDoc.save();

						moduleRefs[guildModule.name] = moduleDoc._id;

						console.log(guild.client.moduleCommands);

						if (!guildModule.global) {
							commandsArr.push(guild.client.moduleCommands[guildModule.name].command.toJSON());
						}

						const moduleSubcommandGroup = new SlashCommandSubcommandGroupBuilder()
							.setName(guildModule.name)
							.setDescription(guildModule.description)
							.addSubcommand(option =>
								option
									.setName("enable")
									.setDescription("Enable the module"),
							)
							.addSubcommand(option =>
								option
									.setName("disable")
									.setDescription("Disable the module"),
							)
							.addSubcommand(subcmd =>
								subcmd
									.setName("var")
									.setDescription("Get or set the value of a var")
									.addStringOption(option =>
										option
											.setName("operation")
											.setDescription("What you want to do")
											.setChoices([["set", "set"], ["get", "get"]])
											.setRequired(true),
									)
									.addStringOption(option =>
										option
											.setName("var")
											.setDescription("The name of the variable you want to view or change")
											.setRequired(false),
									)
									.addStringOption(option =>
										option
											.setName("value")
											.setDescription("(Only set) The value you want to give the variable")
											.setRequired(false),
									),
							);

						if (guildModule.enabledByDefault) {
							moduleSlashCommand.addSubcommandGroup(moduleSubcommandGroup);
						}
					}

					commandsArr.push(moduleSlashCommand.toJSON());

					console.log(commandsArr);

					newGuildDoc.modules = moduleRefs;
					console.log(await newGuildDoc.save());

					console.log("Adding / commnads");
					await rest.put(Routes.applicationGuildCommands(guild.client.user.id, guild.id), {
						body: commandsArr,
					});
					console.log("Done adding / commands");
				} else {
					const commandsArr = [];

					for (const guildModule of guild.client.modules) {
						if (!(guildModule.name in guildDoc.modules)) {
							console.log(`${guildModule.name} is not in db, adding to db`);

							const moduleDoc = new GuildModule({
								"guildId": guild.id,
								name: guildModule.name,
								description: guildModule.description,
								enabled: guildModule.enabledByDefault,
								vars: guildModule.vars,
							});

							await moduleDoc.save();

							guildDoc.modules[guildModule.name] = moduleDoc._id;

							if (!guildModule.global) {
								commandsArr.push(guild.client.moduleCommands[guildModule.name].command.toJSON());
							}

							const moduleSubcommandGroup = new SlashCommandSubcommandGroupBuilder()
								.setName(guildModule.name)
								.setDescription(guildModule.description)
								.addSubcommand(option =>
									option
										.setName("enable")
										.setDescription("Enable the module"),
								)
								.addSubcommand(option =>
									option
										.setName("disable")
										.setDescription("Disable the module"),
								)
								.addSubcommand(subcmd =>
									subcmd
										.setName("var")
										.setDescription("Get or set the value of a var")
										.addStringOption(option =>
											option
												.setName("operation")
												.setDescription("What you want to do")
												.setChoices(["set", "get"])
												.setRequired(true),
										)
										.addStringOption(option =>
											option
												.setName("var")
												.setDescription("The name of the variable you want to view or change")
												.setRequired(true),
										)
										.addStringOption(option =>
											option
												.setName("value")
												.setDescription("(Only set) The value you want to give the variable")
												.setRequired(false),
										),
								);


							if (guildModule.enabledByDefault) {
								moduleSlashCommand.addSubcommandGroup(moduleSubcommandGroup);
							}
						}
					}

					commandsArr.push(moduleSlashCommand.toJSON());

					console.log(commandsArr);

					if (commandsArr.length) {
						console.log("Adding / commnads");
						await rest.put(Routes.applicationGuildCommands(guild.client.user.id, guild.id), {
							body: commandsArr,
						});
						console.log("Done adding / commands");
					}

					console.log(guildDoc);

					guildDoc.markModified("modules");

					await guildDoc.save();

					console.log("Done with checking for new modules");
				}
			} catch (err) {
				console.error(err);
			}
		})();
	},
};