import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('moves')
		.setDescription('Check the moves of a Pokémon')
		.addStringOption((option) => option.setName('pokemon').setDescription('The Pokémon you want the information for (-1 for latest)'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const id = interaction.options.getString('pokemon'); // Pokémon name or ID
		return await runCommand(interaction, now, 'moves', { id, page: 1 });
	},
};
