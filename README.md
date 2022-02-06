# djs-modular-bot

A modular discord bot

## Modules

1. Create a new folder with the same name as your module in `/modules`
2. In the folder add a folder named `commands` and another folder named `events`
3. Add a `info.js`
4. In `info.js` copy in this code and fill it out

```js
module.exports = {
	name: "",				// The name of your module
	description: "",		// The description
	global: ,				// If it should be a global command
	enabledByDefault: ,		// If it should be enabled when added to a guild
	canBeEnabled: ,			// If it can be enabled
	canBeDisabled: ,		// If it can be disabled
	vars: {},				// An object of vars the user can change
	hiddenVars: {},			// Vars the user cannot change
};
```

5. To add commands create a js file in the commands folder you created, the code should look like this:
```js
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
	command: new SlashCommandSubcommandBuilder()
		.setName("")				// The name of the command
		.setDescription(""),		// The description of the command
	async execute(interaction, doc) {	// The function that will run when the command if fired
		await interaction.reply("Hello World");
	},
};
```

6. Events should look like this:

```js
module.exports = {
	name: "",			// The event name
	once: ,				// If it should be able to run multiple times
	execute() {	// The function that is called

	}
}
```