import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('catch')
		.setDescription('Catch the Pokémon that spawned in this chat')
		.addStringOption((option) => option.setName('pokemon').setDescription('The name of the Pokémon').setRequired(true))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const name = interaction.options.getString('pokemon', true);

		return await runCommand(interaction, now, 'catch', { name });
	},
};
