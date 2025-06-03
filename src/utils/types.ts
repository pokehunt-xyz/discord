import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ColorResolvable, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';

export type APIAttachment = {
	content: Buffer;
	name: string | undefined;
};

export type APIEmbed = {
	title?: string;
	fields?: { name: string; value: string; inline?: boolean }[];
	description?: string;
	author?: { name?: string; iconURL?: string };
	footer?: { text?: string };
	image?: string;
	thumbnail?: string;
	timestamp?: Date;
	color?: ColorResolvable;
};

export type APIButton = {
	id: string;
	label: string;
	style: 'Primary' | 'Secondary' | 'Success' | 'Danger' | 'Link';
	disabled?: boolean;
};
export type APISelectMenu = {
	id: string;
	placeholder: string;
	options: APISelect[];
	min: number;
	max: number;
};
export type APISelect = {
	value: string;
	label: string;
	description: string;
	enabled?: boolean;
};

export type APICommandResponse = {
	embeds: APIEmbed[];
	files: APIAttachment[];
	buttons: APIButton[][];
	menus: APISelectMenu[];
	content?: string;
};

export type APIDiscordWSResponse = {
	event: 'spawn' | 'levelup' | 'dm';
	channelID: string;
	embeds: APICommandResponse['embeds'];
	files: APICommandResponse['files'];
	buttons: APICommandResponse['buttons'];
	menus: APICommandResponse['menus'];
	content?: APICommandResponse['content'];
};

export type APIDiscordPayload = {
	platform: 'discord';
	values?: string[];
	userID: string;
	userName: string;
	channelID: string;
	guildID: string | null;
	guildName: string | null;
	timestamp: number;
	args?: unknown;
};

export type APIDiscordWSPayloadSend = {
	platform: 'discord';
	event: 'send';
	userID: string;
	userName: string;
	channelID: string;
	guildID: string | null;
	guildName: string | null;
};

export type APIDiscordWSPayloadGuilds = {
	platform: 'discord';
	event: 'added' | 'removed';
	id: string;
	name: string;
	total: number;
};

export type CommandResponse = {
	embeds: EmbedBuilder[];
	files: AttachmentBuilder[];
	components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[];
	content?: string;
};

export const natures = ['Adamant', 'Bashful', 'Bold', 'Brave', 'Calm', 'Careful', 'Docile', 'Gentle', 'Hardy', 'Hasty', 'Impish', 'Jolly', 'Lax', 'Lonely', 'Mild', 'Modest', 'Naive', 'Naughty', 'Quiet', 'Quirky', 'Rash', 'Relaxed', 'Sassy', 'Serious', 'Timid' ]; // eslint-disable-line prettier/prettier
