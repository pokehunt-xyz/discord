import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('release')
		.setDescription('Release (delete) a Pokémon')
		.addStringOption((option) => option.setName('id').setDescription('The ID of the Pokémon you want to release (-1 for latest'))
		.addBooleanOption((option) => option.setName('force').setDescription('Skip the confirmation menu'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const id = interaction.options.getString('id');
		const force = interaction.options.getBoolean('force');

		return await runCommand(interaction, now, 'release', { id, force });
	},
};
