import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('weak')
		.setDescription('Find out which pokemon or type is immune, resistant or weak others')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('pokemon')
				.setDescription('Find out which types are immune, resistant or weak against a Pokémon')
				.addStringOption((option) => option.setName('pokemon').setDescription('The Pokémon you want the information for (-1 for latest)').setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('type')
				.setDescription('Find out which types are immune, resistant or weak against a specific type')
				.addStringOption((option) =>
					option
						.setName('type')
						.setDescription('The type you want the information for.')
						.addChoices(
							{ name: 'Normal', value: 'normal' },
							{ name: 'Fighting', value: 'fighting' },
							{ name: 'Flying', value: 'flying' },
							{ name: 'Poison', value: 'poison' },
							{ name: 'Ground', value: 'ground' },
							{ name: 'Rock', value: 'rock' },
							{ name: 'Bug', value: 'bug' },
							{ name: 'Ghost', value: 'ghost' },
							{ name: 'Steel', value: 'steel' },
							{ name: 'Fire', value: 'fire' },
							{ name: 'Water', value: 'water' },
							{ name: 'Grass', value: 'grass' },
							{ name: 'Electric', value: 'electric' },
							{ name: 'Psychic', value: 'psychic' },
							{ name: 'Ice', value: 'ice' },
							{ name: 'Dragon', value: 'dragon' },
							{ name: 'Dark', value: 'dark' },
							{ name: 'Fairy', value: 'fairy' }
						)
						.setRequired(true)
				)
		)
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const subcommand = interaction.options.getSubcommand();
		let argument;

		if (subcommand === 'pokemon')
			argument = interaction.options.getString('pokemon'); // Pokémon name or ID
		else argument = interaction.options.getString('type', true);

		return await runCommand(interaction, now, 'weak', { argument });
	},
};
