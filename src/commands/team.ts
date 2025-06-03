import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('team')
		.setDescription('Manage your teams')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setDescription('View your teams')
				.addIntegerOption((option) => option.setName('page').setDescription('The page to view (-1 for latest)').setMinValue(-1))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('create')
				.setDescription('Create a team')
				.addStringOption((option) => option.setName('name').setDescription('The name of the team').setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Add a Pokémon to a team')
				.addStringOption((option) => option.setName('team').setDescription('The name of the team').setRequired(true))
				.addStringOption((option) => option.setName('id').setDescription('The ID of the Pokémon').setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove a Pokémon from a team')
				.addStringOption((option) => option.setName('team').setDescription('The name of the team').setRequired(true))
				.addStringOption((option) => option.setName('id').setDescription('The ID of the Pokémon').setRequired(true))
		)
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		switch (interaction.options.getSubcommand()) {
			case 'add':
			case 'remove': {
				const team = interaction.options.getString('team', true);
				const id = interaction.options.getString('id', true);

				return await runCommand(interaction, now, `team ${interaction.options.getSubcommand()}`, { team, id });
			}

			case 'create': {
				const name = interaction.options.getString('name', true);

				return await runCommand(interaction, now, 'team create', { name });
			}

			default: {
				const page = interaction.options.getInteger('page');
				return await runCommand(interaction, now, 'team view', { page });
			}
		}
	},
};
