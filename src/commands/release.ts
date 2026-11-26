import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('release')
		.setDescription('Release (delete) a Pokémon')
		.addStringOption((option) => option.setName('id').setDescription('The ID or nickname of your Pokémon (-1 for latest), default: 0'))
		.addBooleanOption((option) => option.setName('force').setDescription('Release without confirmation, default: ask for confirmation first'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const id = interaction.options.getString('id');
		const force = interaction.options.getBoolean('force');

		return await runCommand(interaction, now, 'release', { id, force });
	},
};
