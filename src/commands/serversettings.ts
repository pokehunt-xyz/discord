import { ChannelType, ChatInputCommandInteraction, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { CommandResponse } from '../utils/types';
import { CustomError, NoPermissionError, OnlyInGuildError } from '../utils/error';
import { runCommand } from '../utils/api';

export default {
	data: new SlashCommandBuilder()
		.setName('serversettings')
		.setDescription('Change your server settings')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('redirect')
				.setDescription('Let all Pokémon spawn in one channel')
				.addChannelOption((option) => option.setName('channel').setDescription('The channel all Pokémon should spawn in, leave empty to remove'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('spawns')
				.setDescription('Disable Pokémon spawns in a specific channel')
				.addChannelOption((option) => option.setName('channel').setDescription('The channel Pokémon spawns should be disabled in'))
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable Pokémon spawns'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('commands')
				.setDescription('Disable commands in a specific channel')
				.addChannelOption((option) => option.setName('channel').setDescription('The channel Pokémon commands should be disabled in'))
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable Pokémon commands'))
		)
		.addSubcommand((subcommand) => subcommand.setName('view').setDescription('View all server settings'))
		.addSubcommand((subcommand) => subcommand.setName('reset').setDescription('Reset all server settings'))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts([InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		if (!interaction.inCachedGuild()) throw new OnlyInGuildError();
		if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) throw new NoPermissionError();

		switch (interaction.options.getSubcommand()) {
			case 'reset': {
				return await runCommand(interaction, now, 'discordguildsettings reset', {});
			}
			case 'redirect': {
				const channel = interaction.options.getChannel('channel') ?? interaction.channel;
				if (!channel || channel.type !== ChannelType.GuildText) throw new OnlyInGuildError();
				if (channel.guildId !== interaction.guildId) throw new CustomError('You can only set the redirect in this server!');

				return await runCommand(interaction, now, 'discordguildsettings redirect', {
					channelID: channel.id,
				});
			}
			case 'spawns':
			case 'commands': {
				const channel = interaction.options.getChannel('channel') ?? interaction.channel;
				if (!channel || channel.type !== ChannelType.GuildText) throw new OnlyInGuildError();
				if (channel.guildId !== interaction.guildId) throw new CustomError('You can only change settings of this server!');

				const setEnabled = interaction.options.getBoolean('enable');
				return await runCommand(interaction, now, `discordguildsettings ${interaction.options.getSubcommand()}`, {
					setEnabled,
					channelID: channel.id,
				});
			}
			default: {
				return await runCommand(interaction, now, 'discordguildsettings view', {});
			}
		}
	},
};
