import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { InvalidOptionError, OnlyInGuildError } from '../utils/error';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('gift')
		.setDescription('Gift a Pokémon to someone')
		.addUserOption((option) => option.setName('user').setDescription('The user you want to gift to').setRequired(true))
		.addStringOption((option) => option.setName('id').setDescription('The ID or nickname of your Pokémon (-1 for latest), default: 0'))
		.setContexts([InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		if (!interaction.inCachedGuild()) throw new OnlyInGuildError();

		const memberTo = interaction.options.getMember('user');
		if (!memberTo) throw new InvalidOptionError('user', 'should be a valid member');
		const id = interaction.options.getString('id');

		return await runCommand(interaction, now, 'gift', {
			id,
			taggedPlatform: 'discord',
			taggedID: memberTo.id,
			taggedName: memberTo.displayName,
		});
	},
};
