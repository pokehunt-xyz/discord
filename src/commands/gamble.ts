import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { InvalidOptionError, OnlyInGuildError } from '../utils/error';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('gamble')
		.setDescription('Gamble credits with someone')
		.addUserOption((option) => option.setName('user').setDescription('The user you want to gamble with').setRequired(true))
		.addIntegerOption((option) => option.setName('amount').setDescription('The amount of credits').setRequired(true).setMinValue(250).setMaxValue(10000))
		.setContexts([InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		if (!interaction.inCachedGuild()) throw new OnlyInGuildError();

		const memberTo = interaction.options.getMember('user');
		if (!memberTo) throw new InvalidOptionError('user', 'should be a valid member');
		const amount = interaction.options.getInteger('amount', true);

		return await runCommand(interaction, now, 'gamble', {
			amount,
			taggedPlatform: 'discord',
			taggedID: memberTo.id,
			taggedName: memberTo.displayName,
		});
	},
};
