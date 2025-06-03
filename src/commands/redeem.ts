import {
	ChannelType,
	ChatInputCommandInteraction,
	GuildMember,
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextChannel,
} from 'discord.js';

import { runCommand } from '../utils/api';
import { CustomError, UnknownError } from '../utils/error';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('redeem')
		.setDescription('Find out how to use, and actually use your redeems')
		.addSubcommand((subcommand) => subcommand.setName('info').setDescription('Get information about redeems'))
		.addSubcommand((subcommand) => subcommand.setName('balance').setDescription('Find out how many redeems you have'))
		.addSubcommand((subcommand) => subcommand.setName('credits').setDescription('Redeem 15,000 credits for 1 redeem'))
		.addSubcommand((subcommand) =>
			subcommand
				.setName('spawn')
				.setDescription('Spawn a Pokémon for 1 redeem')
				.addStringOption((option) =>
					option.setName('pokemon').setDescription('The Pokémon you want to spawn (use "random" for a random one).').setRequired(true)
				)
				.addBooleanOption((option) => option.setName('autocatch').setDescription('Automatically catch the Pokémon and DONT spawn in the channel.'))
				.addChannelOption((option) => option.setName('channel').setDescription('Send the Pokémon to a different channel, useful for surprise spawns'))
		)
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const member = (interaction.member as GuildMember) ?? interaction.user;

		switch (interaction.options.getSubcommand()) {
			case 'balance': {
				return await runCommand(interaction, now, 'redeem balance', {});
			}
			case 'credits': {
				return await runCommand(interaction, now, 'redeem credits', {});
			}
			case 'spawn': {
				const channel = interaction.options.getChannel('channel') ?? interaction.channel ?? (await interaction.client.channels.fetch(interaction.channelId));

				if (!channel || (channel.type !== ChannelType.DM && channel.type !== ChannelType.GuildText))
					throw new CustomError('You can only spawn it into a valid text channel!');

				const name = interaction.options.getString('pokemon', true);
				const autocatch = interaction.options.getBoolean('autocatch');

				if (channel.type === ChannelType.GuildText) {
					const textChannel = channel as TextChannel;
					if (!interaction.inCachedGuild() || !interaction.channelId) throw new UnknownError('[redeem] spawn', new Error('not in guild'));
					if (!member || !interaction.guild) throw new UnknownError('[redeem] spawn', new Error('no member or guild'));

					if (!textChannel.permissionsFor(interaction.member).has(PermissionFlagsBits.SendMessages))
						throw new CustomError('You do not have permission to spawn a Pokémon in there!');

					const me = await interaction.guild.members.fetchMe();
					if (!textChannel.permissionsFor(me).has(PermissionFlagsBits.ViewChannel)) throw new CustomError('I do not have permission to access this channel!');
					if (!textChannel.permissionsFor(me).has(PermissionFlagsBits.SendMessages))
						throw new CustomError('I do not have permission to send messages in there!');
					if (!textChannel.permissionsFor(me).has(PermissionFlagsBits.AttachFiles)) throw new CustomError('I do not have permission to send images in there!');
					if (!textChannel.permissionsFor(me).has(PermissionFlagsBits.EmbedLinks)) throw new CustomError('I do not have permission to send embeds in there!');
				}

				return await runCommand(interaction, now, 'redeem spawn', { name, autocatch, taggedChatID: channel.id });
			}
			default: {
				return await runCommand(interaction, now, 'redeem info', {});
			}
		}
	},
};
