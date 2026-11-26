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
		.addSubcommand((subcommand) => subcommand.setName('balance').setDescription('Check the amount of redeems you have'))
		.addSubcommand((subcommand) => subcommand.setName('credits').setDescription('Redeem 15,000 credits'))
		.addSubcommand((subcommand) => subcommand.setName('info').setDescription('View information about redeems'))
		.addSubcommand((subcommand) =>
			subcommand
				.setName('spawn')
				.setDescription('Redeem a Pokémon of your choice')
				.addStringOption((option) => option.setName('pokemon').setDescription('The Pokémon to redeem (use "random" for a random Pokémon)').setRequired(true))
				.addBooleanOption((option) => option.setName('autocatch').setDescription('Catch it directly, default: spawn in channel'))
				.addChannelOption((option) =>
					option.setName('channel').setDescription('The channel to spawn the Pokémon in, default: current channel').addChannelTypes(ChannelType.GuildText)
				)
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
