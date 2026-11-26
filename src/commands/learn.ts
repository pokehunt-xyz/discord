import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('learn')
		.setDescription('Learn your Pokémon a specific move')
		.addStringOption((option) => option.setName('id').setDescription('The ID or nickname of your Pokémon (-1 for latest), default: 0'))
		.addStringOption((option) => option.setName('move').setDescription('The move, default: view moves'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const id = interaction.options.getString('id');
		const move = interaction.options.getString('move');

		return await runCommand(interaction, now, 'learn', { id, move });
	},
};
