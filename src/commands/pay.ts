import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { InvalidOptionError, OnlyInGuildError } from '../utils/error';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('pay')
		.setDescription('Pay someone some credits or redeems')
		.addUserOption((option) => option.setName('user').setDescription('The user you want to pay').setRequired(true))
		.addIntegerOption((option) => option.setName('amount').setDescription('The amount you want to pay').setMinValue(1).setRequired(true))
		.addStringOption((option) =>
			option
				.setName('currency')
				.setDescription('The currency you want to pay')
				.addChoices({ name: 'Credits', value: 'credits' }, { name: 'Redeems', value: 'redeems' })
		)
		.setContexts([InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		if (!interaction.inCachedGuild()) throw new OnlyInGuildError();

		const memberTo = interaction.options.getMember('user');
		if (!memberTo) throw new InvalidOptionError('user', 'should be a valid member');

		const amount = interaction.options.getInteger('amount', true);
		const currency = interaction.options.getString('currency');

		return await runCommand(interaction, now, 'pay', {
			amount,
			currency,
			taggedPlatform: 'discord',
			taggedID: memberTo.id,
			taggedName: memberTo.displayName,
		});
	},
};
