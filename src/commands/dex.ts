import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('dex')
		.setDescription('The Pokémon dex')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('search')
				.setDescription('Get information about a specific Pokémon')
				.addStringOption((option) => option.setName('pokemon').setDescription('The Pokémon, move or type you want information about').setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('edit-wishlist')
				.setDescription('Edit (toggle) a Pokémon from your wishlist')
				.addStringOption((option) => option.setName('pokemon').setDescription('The Pokémon you want to add/remove').setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view-wishlist')
				.setDescription('View your wishlist')
				.addIntegerOption((option) => option.setName('page').setDescription('The page to view (-1 for latest)').setMinValue(-1))
		)
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		switch (interaction.options.getSubcommand()) {
			case 'edit-wishlist': {
				const name = interaction.options.getString('pokemon', true);
				return await runCommand(interaction, now, 'dex edit-wishlist', { name });
			}
			case 'view-wishlist': {
				const page = interaction.options.getInteger('page');
				return await runCommand(interaction, now, 'dex view-wishlist', { page });
			}
			default: {
				const name = interaction.options.getString('pokemon', true);
				return await runCommand(interaction, now, 'dex search', { name });
			}
		}
	},
};
