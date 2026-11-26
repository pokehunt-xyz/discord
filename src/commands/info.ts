import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('View information about a Pokémon')
		.addStringOption((option) => option.setName('id').setDescription('The ID or nickname of your Pokémon (-1 for latest), default: 0'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const id = interaction.options.getString('id');
		return await runCommand(interaction, now, 'info', { id });
	},
};
