import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('View the commands and how to use them')
		.addStringOption((option) => option.setName('command').setDescription('The command you want help with, default: all commands'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const command = await interaction.options.getString('command');
		return await runCommand(interaction, now, 'help', { command });
	},
};
