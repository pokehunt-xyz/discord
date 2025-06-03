import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help using PokéHunt')
		.addStringOption((option) => option.setName('command').setDescription('The command you need help with'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const command = await interaction.options.getString('command');
		return await runCommand(interaction, now, 'help', { command });
	},
};
