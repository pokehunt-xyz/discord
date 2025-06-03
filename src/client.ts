import { ChatInputCommandInteraction, Client, Collection, GatewayIntentBits, Partials, SlashCommandBuilder } from 'discord.js';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { CommandResponse } from './utils/types';

type CommandData = {
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction, now: number) => CommandResponse;
};

declare module 'discord.js' {
	interface Client {
		commands: Collection<string, CommandData>;
	}
}

// DM need DM intent and channel partial
const client = new Client({
	partials: [Partials.Channel],
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
});
const commands: SlashCommandBuilder[] = [];

async function load(): Promise<void> {
	client.commands = new Collection();

	// Load all commands
	const commandFiles = await readdir(join(__dirname, './commands'));
	for (const file of commandFiles) {
		const command = (await import(`./commands/${file}`)).default;
		commands.push(command.data.toJSON());

		// Log all commands and their description to use in Telegram
		// if (command.data.name !== 'serversettings') console.log(`${command.data.name} - ${command.data.description}`);

		client.commands.set(command.data.name, command);
	}

	// Load all events
	const eventFiles = await readdir(join(__dirname, './events'));
	for (const file of eventFiles) {
		const event = (await import(`./events/${file}`)).default;
		client.on(event.name, (...args) => event.execute(...args));
	}
}
load();

client.on('ready', async () => {
	try {
		if (process.env.RESET_SLASH_COMMANDS === 'true') await client.application?.commands.set([]);
		await client.application?.commands.set(commands);
	} catch (e) {
		console.error(e);
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
