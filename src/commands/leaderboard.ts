import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Check the leaderboard')
		.addStringOption((option) =>
			option
				.setName('category')
				.setDescription('The leaderboard category you want to see')
				.setRequired(true)
				.addChoices(
					{ name: 'pokemon', value: 'pokemon' },
					{ name: 'balance', value: 'balance' },
					{ name: 'donations', value: 'donations' },
					{ name: 'hunts', value: 'hunts' },
					{ name: 'votes', value: 'votes' },
					{ name: 'allRound', value: 'allRound' }
				)
		)
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const category = interaction.options.getString('category');
		return await runCommand(interaction, now, 'leaderboard', { category });
	},
};
