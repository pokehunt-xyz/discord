import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('select')
		.setDescription('Select a Pokémon')
		.addStringOption((option) => option.setName('id').setDescription('The ID of the Pokémon you want to select (-1 for latest)').setRequired(true))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const id = interaction.options.getString('id', true);
		return await runCommand(interaction, now, 'select', { id });
	},
};
