import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('moveinfo')
		.setDescription('Get information about a move')
		.addStringOption((option) => option.setName('move').setDescription('The move you want information about').setRequired(true))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const move = interaction.options.getString('move', true);
		return await runCommand(interaction, now, 'moveinfo', { move });
	},
};
