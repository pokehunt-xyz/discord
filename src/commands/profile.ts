import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Check your profile card')
		.addUserOption((option) => option.setName('user').setDescription('The user you want to view the profile off'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const memberTo = interaction.options.getUser('user') ?? interaction.user;

		return await runCommand(interaction, now, 'profile', {
			taggedPlatform: 'discord',
			taggedID: memberTo.id,
			taggedName: memberTo.displayName,
			taggedAvatar: memberTo.avatarURL({ extension: 'png' }),
		});
	},
};
