import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('donate')
		.setDescription('Support the bot')
		.addIntegerOption((option) => option.setName('amount').setDescription('The donation amount in euro, default: show instructions').setMinValue(1))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const amount = interaction.options.getInteger('amount');
		return await runCommand(interaction, now, 'donate', { amount });
	},
};
