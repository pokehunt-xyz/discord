import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('learn')
		.setDescription('Learn a Pokémon a specific move')
		.addStringOption((option) => option.setName('move').setDescription('The move you want to learn your pokemon'))
		.addStringOption((option) => option.setName('id').setDescription('The ID of the Pokémon you want to learn a move (-1 for latest)'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const id = interaction.options.getString('id');
		const move = interaction.options.getString('move');

		return await runCommand(interaction, now, 'learn', { id, move });
	},
};
