import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { InvalidOptionError, OnlyInGuildError } from '../utils/error';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('duel')
		.setDescription('Duel (fight) with someone')
		.addUserOption((option) => option.setName('user').setDescription('The user you want to gamble with').setRequired(true))
		.setContexts([InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		if (!interaction.inCachedGuild()) throw new OnlyInGuildError();

		const hunterTo = interaction.options.getMember('user');
		if (!hunterTo) throw new InvalidOptionError('user', 'should be a valid member');

		return await runCommand(interaction, now, 'duel', {
			taggedPlatform: 'discord',
			taggedID: hunterTo.id,
			taggedName: hunterTo.displayName,
		});
	},
};
