import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('View the leaderboard')
		.addStringOption((option) =>
			option
				.setName('category')
				.setDescription('The leaderboard category, default: all-round')
				.addChoices(
					{ name: 'All-round', value: 'allRound' },
					{ name: 'Pokédex', value: 'dex' },
					{ name: 'Catches', value: 'catches' },
					{ name: 'Hunts', value: 'hunts' },
					{ name: 'Duels', value: 'duels' },
					{ name: 'Vote streak', value: 'votes' },
					{ name: 'Balance', value: 'balance' },
					{ name: 'Market sales', value: 'marketSales' },
					{ name: 'Market spending', value: 'marketSpending' }
				)
		)
		.addStringOption((option) =>
			option
				.setName('period')
				.setDescription('The period (only for catches, hunts and market), default: this week')
				.addChoices({ name: 'This week', value: 'week' }, { name: 'This month', value: 'month' }, { name: 'All time', value: 'all' })
		)
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const category = interaction.options.getString('category');
		const period = interaction.options.getString('period');
		return await runCommand(interaction, now, 'leaderboard', { category, period });
	},
};
