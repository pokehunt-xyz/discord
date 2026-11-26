import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Change your settings')
		.addSubcommand((subcommand) => subcommand.setName('link').setDescription('Link your account with Telegram'))
		.addSubcommand((subcommand) => subcommand.setName('reset').setDescription('Reset your settings'))
		.addSubcommand((subcommand) => subcommand.setName('view').setDescription('View your settings'))
		.addSubcommand((subcommand) =>
			subcommand
				.setName('profile')
				.setDescription('Make your profile public or private')
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable or disable, default: toggle'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('levelup')
				.setDescription('Enable or disable level up messages')
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable or disable, default: toggle'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('dmnotifications')
				.setDescription('Enable or disable DM notifications')
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable or disable, default: toggle'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('username')
				.setDescription('Show or hide your username')
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable or disable, default: toggle'))
		)
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
