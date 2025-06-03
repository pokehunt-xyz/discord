import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('View the ping (latency) of PokéHunt')
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		return await runCommand(interaction, now, 'ping', {
			discord: interaction.client.ws.ping,
			client: Date.now() - interaction.createdTimestamp,
		});
	},
};
