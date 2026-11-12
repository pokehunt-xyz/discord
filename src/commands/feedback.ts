import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('feedback')
		.setDescription('Provide feedback about the bot or report bugs')
		.addStringOption((option) => option.setName('text').setDescription('Your feedback or bug report, leave empty to view existing feedback').setRequired(false))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const text = interaction.options.getString('text', false);
		return await runCommand(interaction, now, 'feedback', { text });
	},
};
