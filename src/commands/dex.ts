import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('dex')
		.setDescription('Get information about a specific Pokémon')
		.addStringOption((option) => option.setName('pokemon').setDescription('The Pokémon, move or type you want information about').setRequired(true))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const name = interaction.options.getString('pokemon', true);
		return await runCommand(interaction, now, 'dex', { name });
	},
};
