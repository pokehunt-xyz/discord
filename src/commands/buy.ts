import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy rare candies to level up your Pokémon')
		.addStringOption((option) => option.setName('id').setDescription('The ID of the Pokémon you want to gift (-1 for latest)'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const id = interaction.options.getString('id');

		return await runCommand(interaction, now, 'buy', { id });
	},
};
