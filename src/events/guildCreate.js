const Guild = require("../db/modles/guild");
const GuildModule = require("../db/modles/guildModule");

module.exports = {
	name: "guildCreate",
	once: false,
	execute(guild) {
		console.log("Joined a new guild: " + guild.name);

		(async () => {
			try {
				const guildDoc = await Guild.findOne({ guildId: guild.id });

				console.log(guildDoc);
				if (!guildDoc) {
					const newGuildDoc = new Guild({
						"ownerDiscordId": guild.ownerId,
						"plugins": [],
						"guildId": guild.id,
					});

					await newGuildDoc.save();
					console.log("Document created");

					const moduleRefs = [];

					for (const guildModule of guild.client.modules) {
						console.log(`Adding ${guildModule.name} to guild modules`);

						const moduleDoc = new GuildModule({
							"guildId": guild.id,
							name: guildModule.name,
							description: guildModule.description,
							enabled: guildModule.enabledByDefault,
						});

						await moduleDoc.save();

						moduleRefs.push(moduleDoc._id);
					}

					newGuildDoc.plugins = moduleRefs;
					console.log(await newGuildDoc.save());
				}
			} catch (err) {
				console.error(err);
			}
		})();
	},
};