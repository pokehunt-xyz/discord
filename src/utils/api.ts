import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	Message,
	ShardingManager,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	StringSelectMenuOptionBuilder,
	User,
} from 'discord.js';
import WebSocket from 'ws';

import { APIError, IgnoreError } from './error';
import { APICommandResponse, APIDiscordPayload, APIDiscordWSPayloadGuilds, APIDiscordWSPayloadSend, APIDiscordWSResponse, CommandResponse } from './types';

const API_URL = process.env.API_URL ?? 'https://api.pokehunt.xyz';
const API_KEY = process.env.API_KEY;
const API_WS_KEY = process.env.API_WS_KEY;
if (!API_KEY) throw new Error('No pokehunt API key specified!');
if (!API_WS_KEY) throw new Error('No pokehunt API WS key specified!');

let ws: WebSocket | null = null;
let wsQueue: string[] = [];

/**
 * This method will create a websocket connection to the Pokéhunt API
 *
 * @remarks
 * Uses the environment variable `API_URL` and `API_WS_KEY` for the URL and secret key.
 * Will try to re-connect after 5 seconds if disconnected.
 *
 * @param manager - The Discord.js sharing manager
 */
export function createWsConnection(manager: ShardingManager): void {
	const tempWs = new WebSocket(API_URL.replace('http', 'ws') + '/client', ['Authorization', 'discord', API_WS_KEY as string]); // https -> wss, http -> ws
	ws = tempWs;

	// Authenticate with the Pokéhunt API
	tempWs.onopen = (): void => {
		console.log('Connected to the Pokéhunt API');
		tempWs.send(JSON.stringify({ platform: 'discord' }));

		// Empty the queue
		for (const msg of wsQueue) {
			tempWs.send(msg);
		}
		wsQueue = [];

		tempWs.onmessage = async (data): Promise<void> => {
			const json: APIDiscordWSResponse = JSON.parse(data.data.toString());

			async function sendMessage(client, json): Promise<void> {
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				const { ChannelType, PermissionFlagsBits } = require('discord.js');
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				const { parseCommandResponse } = require('../../../../dist/utils/api.js'); // weird path as we are in node_modules/discord.js/src/client

				let channel;
				if (json.event === 'dm') {
					if (!client.shard.ids.includes(0)) return; // only allow shard 0 to send DM
					channel = await client.users.fetch(json.channelID);
					if (!channel) return;
				} else if (json.event === 'levelup' || json.event === 'spawn') {
					channel = await client.channels.fetch(json.channelID);
					if (!channel) return;

					if (channel.type === ChannelType.GuildText) {
						const me = await channel.guild.members.fetchMe();
						if (!channel.permissionsFor(me).has(PermissionFlagsBits.SendMessages)) return;

						if (!channel.permissionsFor(me).has(PermissionFlagsBits.AttachFiles)) {
							if (json.event === 'spawn')
								return channel.send(
									'I tried to spawn a Pokémon, however, I do not have permission to attach files, please contact a staff member to give it to me.'
								);
							else if (json.event === 'levelup') json.files = [];
							else return;
						}

						if (!channel.permissionsFor(me).has(PermissionFlagsBits.EmbedLinks)) {
							if (json.event === 'spawn')
								return channel.send(
									'I tried to spawn a Pokémon, however, I do not have permission to send embeds, please contact a staff member to give it to me.'
								);
							else if (json.event === 'levelup') {
								json.content = json.embeds[0].description;
								json.files = [];
								json.embeds = [];
							} else return;
						}
					} else if (channel.type === ChannelType.DM) {
						if (!client.shard.ids.includes(0)) return; // only allow shard 0 to send DM
					} else return console.log('no guildtext');
				}

				if (channel) {
					const toSend = await parseCommandResponse(json);
					await channel.send(toSend);
				}
			}

			manager.broadcastEval(sendMessage, { context: json }).catch((e) => {
				// TODO: tell api that message failed?
				/*
					if (redirectToChannelID) {
						try {
							const redirectChannel = await message.guild.channels.fetch(redirectToChannelID);
							if (redirectChannel && redirectChannel.type === ChannelType.GuildText) channel = redirectChannel;
						} catch (e) {
							await new DbClient().query('UPDATE guilds SET redirect = null WHERE id = $1;', [message.guild.id]);
						}
					}
					await channel.send({ embeds: [embed], files: [file] }).catch(() => null);
				*/
				const msg = e?.message ?? e;
				if (msg !== 'Cannot send messages to this user' && msg !== 'Missing Access' && msg !== 'Missing Permissions' && msg !== 'Unknown Channel') {
					console.log('---');
					console.log(`An error happened when trying to send a message at ${new Date()}:`);
					console.error(e);
					console.log('---');
				}
			});
		};
	};
	tempWs.onerror = (): void => {
		tempWs.close();
	};
	tempWs.onclose = (): void => {
		ws = null;
		console.log('Disconnected from the Pokéhunt API, retrying in 5 secs');
		setTimeout(() => createWsConnection(manager), 5000);
	};
}

//  * Indicate that a user send a message in a channel

/**
 * Send a message to the API that a user send a message in a channel
 *
 * @param userID - The user's Discord ID
 * @param userName - The user's Discord userName
 * @param channelID - The channel's ID
 * @param guildID - The guild's ID, or null
 * @param guildName - The guild's name, or null
 */
export async function userSendMessage(
	userID: APIDiscordWSPayloadSend['userID'],
	userName: APIDiscordWSPayloadSend['userName'],
	channelID: APIDiscordWSPayloadSend['channelID'],
	guildID: APIDiscordWSPayloadSend['guildID'] | null,
	guildName: APIDiscordWSPayloadSend['guildName'] | null
): Promise<void> {
	const toSend: APIDiscordWSPayloadSend = { platform: 'discord', event: 'send', userID, userName, channelID, guildID, guildName };

	if (!ws || !ws.readyState) wsQueue.push(JSON.stringify(toSend));
	else ws.send(JSON.stringify(toSend));
}

/**
 * Send a message to the API that the bot got added or removed to a guild
 *
 * @param event - Either `added` or `removed`
 * @param id - The guild ID
 * @param name - The guild name
 * @param total - The amount of guilds the bot is in
 *
 * @example
 * ```ts
 * const values = await client.fetchClientValues('guilds.cache');
 * const total = values.flat().length;
 * guildChange('added', event.guild.id, event.guild.name, total);
 * ```
 */
export async function guildChange(event: 'added' | 'removed', id: string, name: string, total: number): Promise<void> {
	const toSend: APIDiscordWSPayloadGuilds = { platform: 'discord', event, id, name, total };

	if (!ws || !ws.readyState) wsQueue.push(JSON.stringify(toSend));
	else ws.send(JSON.stringify(toSend));
}

/**
 * Call the API to run a command for a particular user
 *
 * @param interaction - The interaction the user did
 * @param now - Amount of ms since unix epoch that the client received the message
 * @param command - The command that the user ran
 * @param args - Optional extra arguments that are needed for this command
 * @returns The command response
 * @throws {@link APIError} if API is not reachable or invalid credentials
 */
export async function runCommand(interaction: ChatInputCommandInteraction | Message, now: number, command: string, args): Promise<CommandResponse> {
	let member: GuildMember | User = interaction.member as GuildMember;
	if (!member) {
		if (interaction instanceof ChatInputCommandInteraction) member = interaction.user;
		else if (interaction instanceof Message) member = interaction.author;
	}

	const data: APIDiscordPayload = {
		platform: 'discord',
		userID: member.id,
		userName: member.displayName,
		channelID: interaction.channelId,
		guildID: interaction.guildId,
		guildName: interaction.guild?.name ?? null,
		timestamp: now,
		args,
	};

	const res = await fetch(`${API_URL}/client/command/${command}`, {
		method: 'POST',
		credentials: 'include',
		headers: { Authorization: `${API_KEY}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	}).catch(() => {
		throw new APIError('The Pokéhunt API is offline');
	});

	return await handleCommandResponse(res);
}

/**
 * Call the API to run a callback command for a particular user
 * @param interaction  - The interaction the user did
 * @param now  - Amount of ms since unix epoch that the client received the message
 * @returns The command response
 * @throws {@link APIError} if API is not reachable or invalid credentials
 */
export async function runCallbackCommand(interaction: ButtonInteraction | StringSelectMenuInteraction, now: number): Promise<CommandResponse> {
	let member: GuildMember | User = interaction.member as GuildMember;
	if (!member) member = interaction.user;

	const data: APIDiscordPayload = {
		platform: 'discord',
		userID: member.id,
		userName: member.displayName,
		channelID: interaction.channelId,
		guildID: interaction.guildId,
		guildName: interaction.guild?.name ?? null,
		timestamp: now,
	};

	if (interaction instanceof StringSelectMenuInteraction) {
		data['values'] = interaction.values;
	}

	const res = await fetch(`${API_URL}/client/callbackCommand/${interaction.customId}`, {
		method: 'POST',
		credentials: 'include',
		headers: { Authorization: `${API_KEY}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	}).catch(() => {
		throw new APIError('The Pokéhunt API is offline');
	});

	return await handleCommandResponse(res);
}

/**
 * Convert the raw API response into an object that can be send to Discord
 * @param res - The raw API response
 * @returns The object that can be send to Discord
 * @throws {@link APIError} if API is not reachable or invalid credentials
 * @throws {@link IgnoreError} if this message should not be send/should be ignored
 */
export async function handleCommandResponse(res): Promise<CommandResponse> {
	switch (res.status) {
		case 200: {
			const json: APICommandResponse = await res.json();
			return await parseCommandResponse(json);
		}
		case 400:
			throw new APIError('An invalid API request was made'); // Malformed request
		case 401:
			throw new APIError('An invalid API key is provided'); // Invalid API key
		case 418:
			throw new IgnoreError(); // Wrong user pressed button/menu
		default:
			throw new APIError(`The API server is not responding correctly (${res.status})`); // Other error codes than success (200)
	}
}

/**
 * Convert the json API response body into an object that can be send to Discord
 * @param res - The json API response body
 * @returns The object that can be send to Discord
 */
export async function parseCommandResponse(json: APICommandResponse | APIDiscordWSResponse): Promise<CommandResponse> {
	const embeds: EmbedBuilder[] = [];
	const files: AttachmentBuilder[] = [];
	const components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] = [];

	for (const { title, fields, description, author, footer, image, thumbnail, timestamp, color } of json.embeds) {
		const embed = new EmbedBuilder();
		let hasContent = false;
		if (title) {
			embed.setTitle(title);
			hasContent = true;
		}
		if (fields && fields.length > 0) {
			embed.setFields(fields);
			hasContent = true;
		}
		if (description) {
			embed.setDescription(description);
			hasContent = true;
		}
		if (author && author.name) {
			embed.setAuthor({ name: author.name, iconURL: author.iconURL });
			hasContent = true;
		}
		if (footer && footer.text) {
			embed.setFooter({ text: footer.text });
			hasContent = true;
		}
		if (image) {
			embed.setImage(image);
			hasContent = true;
		}
		if (thumbnail) {
			embed.setThumbnail(thumbnail);
			hasContent = true;
		}
		if (timestamp) embed.setTimestamp(new Date(timestamp));
		if (color) embed.setColor(color);
		if (hasContent) embeds.push(embed);
	}

	for (const { content, name } of json.files) {
		const file = new AttachmentBuilder(Buffer.from(content), { name });
		files.push(file);
	}

	// If we have too many rows or too many buttons in one row, just force everything in max rows
	if (json.buttons.length > 5 || json.buttons.some((buttonRow) => buttonRow.length > 5)) {
		let buttons: ButtonBuilder[] = [];
		for (const { id, label, style, disabled } of json.buttons.flat()) {
			const button = new ButtonBuilder().setLabel(label).setStyle(ButtonStyle[style]);
			if (disabled) button.setDisabled(true);
			if (style === 'Link') button.setURL(id);
			else button.setCustomId(id);
			buttons.push(button);

			// Create rows with a max of 5 buttons
			if (buttons.length === 5) {
				const row = new ActionRowBuilder<ButtonBuilder>();
				row.addComponents(buttons);
				if (components.length < 5) components.push(row); // make sure there is a max of 5 rows
				buttons = [];
			}
		}

		// If there are still buttons left
		if (buttons.length > 0) {
			const row = new ActionRowBuilder<ButtonBuilder>();
			row.addComponents(buttons);
			components.push(row);
		}
	} else {
		for (const buttonRow of json.buttons) {
			const row = new ActionRowBuilder<ButtonBuilder>();
			for (const { id, label, style, disabled } of buttonRow) {
				const button = new ButtonBuilder().setLabel(label).setStyle(ButtonStyle[style]);
				if (disabled) button.setDisabled(true);
				if (style === 'Link') button.setURL(id);
				else button.setCustomId(id);
				row.addComponents(button);
			}
			components.push(row);
		}
	}

	for (const { id, placeholder, options, min, max } of json.menus) {
		const doptions: StringSelectMenuOptionBuilder[] = [];
		for (const { value, label, description, enabled } of options) {
			const option = new StringSelectMenuOptionBuilder()
				.setValue(value)
				.setLabel(label)
				.setDescription(description)
				.setDefault(enabled ?? false);
			doptions.push(option);
		}
		components.push(
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				new StringSelectMenuBuilder().setCustomId(id).setPlaceholder(placeholder).setMinValues(min).setMaxValues(max).addOptions(doptions)
			)
		);
	}

	// Discord has a limit of 5 rows, ignore everything afterwards
	components.splice(5);

	return { embeds, files, components, content: json.content };
}
