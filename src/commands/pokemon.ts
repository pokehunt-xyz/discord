import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse, natures } from '../utils/types';

const natureOptions = natures.map((n) => {
	return { name: n, value: n };
});

export default {
	data: new SlashCommandBuilder()
		.setName('pokemon')
		.setDescription('Check all your Pokémon')
		.addIntegerOption((option) => option.setName('page').setDescription('The page to view (-1 for latest)').setMinValue(-1))
		// .addBooleanOption((option) => option.setName('favorite').setDescription('Only show favorite Pokémon'))
		// .addBooleanOption((option) => option.setName('shiny').setDescription('Only show shiny Pokémon'))
		.addStringOption((option) => option.setName('name').setDescription('The Pokémon name to search for'))
		.addStringOption((option) => option.setName('nickname').setDescription('The Pokémon nickname to search for'))
		.addIntegerOption((option) => option.setName('maxlevel').setDescription('The maximum level to search for').setMinValue(1).setMaxValue(100))
		.addIntegerOption((option) => option.setName('minlevel').setDescription('The minimum level to search for').setMinValue(1).setMaxValue(100))
		.addIntegerOption((option) => option.setName('maxiv').setDescription('The maximum IV to search for').setMinValue(1).setMaxValue(100))
		.addIntegerOption((option) => option.setName('miniv').setDescription('The minimum IV to search for').setMinValue(1).setMaxValue(100))
		.addIntegerOption((option) => option.setName('maxattack').setDescription('The maximum attack IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('minattack').setDescription('The minimum attack IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('maxspattack').setDescription('The maximum special attack IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('minspattack').setDescription('The minimum special attack IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('maxdefence').setDescription('The maximum defence IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('mindefence').setDescription('The minimum defence IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('maxspdefence').setDescription('The maximum special defence IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('minspdefence').setDescription('The minimum special defence IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('maxhp').setDescription('The maximum hp IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('minhp').setDescription('The minimum hp IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('maxspeed').setDescription('The maximum speed IV to search for').setMinValue(0).setMaxValue(31))
		.addIntegerOption((option) => option.setName('minspeed').setDescription('The minimum speed IV to search for').setMinValue(0).setMaxValue(31))
		.addStringOption((option) =>
			option
				.setName('nature')
				.setDescription('The Pokémon nature to search for')
				.addChoices(...natureOptions)
		)
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const page = interaction.options.getInteger('page');

		const filters = {
			name: interaction.options.getString('name'),
			nature: interaction.options.getString('nature'),
		};

		const bounds = {
			level: { min: interaction.options.getInteger('minlevel'), max: interaction.options.getInteger('maxlevel') },
			iv: { min: interaction.options.getInteger('miniv'), max: interaction.options.getInteger('maxiv') },
			attack: { min: interaction.options.getInteger('minattack'), max: interaction.options.getInteger('maxattack') },
			spattack: { min: interaction.options.getInteger('minspattack'), max: interaction.options.getInteger('maxspattack') },
			defence: { min: interaction.options.getInteger('mindefence'), max: interaction.options.getInteger('maxdefence') },
			spdefence: { min: interaction.options.getInteger('minspdefence'), max: interaction.options.getInteger('maxspdefence') },
			hp: { min: interaction.options.getInteger('minhp'), max: interaction.options.getInteger('maxhp') },
			speed: { min: interaction.options.getInteger('minspeed'), max: interaction.options.getInteger('maxspeed') },
		};

		return await runCommand(interaction, now, 'pokemon', {
			page,
			fbs: {
				filters,
				bounds,
			},
		});
	},
};
