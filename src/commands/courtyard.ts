import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('courtyard')
		.setDescription('Register your Courtyard username for the event')
		.addStringOption((option) => option.setName('username').setDescription('Your Courtyard username'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const username = interaction.options.getString('username');

		return await runCommand(interaction, now, 'courtyard', { username });
	},
};
