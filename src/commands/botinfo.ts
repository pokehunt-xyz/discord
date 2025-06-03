import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('Get information about PokéHunt')
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const shardID = interaction.client.shard?.ids[0] || 0;

		return await runCommand(interaction, now, 'botinfo', { shardID });
	},
};
