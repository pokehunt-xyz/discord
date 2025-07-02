import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Change your settings')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('profile')
				.setDescription('Set your profile to public available')
				.addBooleanOption((option) => option.setName('enable').setDescription('Set your profile to be public'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('levelup')
				.setDescription('Enable/disable Pokémon level up messages')
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable level up messages'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('dmnotifications')
				.setDescription('Enable/disable DM notifications')
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable DM notifications'))
		)
		.addSubcommand((subcommand) => subcommand.setName('link').setDescription('Link your account with Telegram'))
		.addSubcommand((subcommand) => subcommand.setName('view').setDescription('View all your settings'))
		.addSubcommand((subcommand) => subcommand.setName('reset').setDescription('Reset all your settings'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		switch (interaction.options.getSubcommand()) {
			case 'reset': {
				return await runCommand(interaction, now, 'settings reset', {});
			}
			case 'view': {
				return await runCommand(interaction, now, 'settings view', {});
			}
			case 'link': {
				return await runCommand(interaction, now, 'settings link', {});
			}
			default: {
				const setEnabled = interaction.options.getBoolean('enable');
				return await runCommand(interaction, now, `settings ${interaction.options.getSubcommand()}`, { setEnabled });
			}
		}
	},
};
