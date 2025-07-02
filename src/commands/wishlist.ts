import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('wishlist')
		.setDescription('Manage your Pokémon wishlist')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('edit')
				.setDescription('Edit (toggle) a Pokémon from your wishlist')
				.addStringOption((option) => option.setName('pokemon').setDescription('The Pokémon you want to add/remove').setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setDescription('View your wishlist')
				.addIntegerOption((option) => option.setName('page').setDescription('The page to view (-1 for latest)').setMinValue(-1))
		)
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		switch (interaction.options.getSubcommand()) {
			case 'edit': {
				const name = interaction.options.getString('pokemon', true);
				return await runCommand(interaction, now, 'wishlist edit', { name });
			}
			default: {
				const page = interaction.options.getInteger('page');
				return await runCommand(interaction, now, 'wishlist view', { page });
			}
		}
	},
};
