import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse, natures } from '../utils/types';

const natureOptions = natures.map((n) => {
	return { name: n, value: n };
});

export default {
	data: new SlashCommandBuilder()
		.setName('auction')
		.setDescription('View, manage, find and bid (on) auctions')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('listings')
				.setDescription('View the Pokémon you put on the auction')
				.addIntegerOption((option) => option.setName('page').setDescription('The page to view (-1 for latest), default: 1'))
				// .addBooleanOption((option) => option.setName('shiny').setDescription('Only show shiny Pokémon'))
				.addStringOption((option) => option.setName('name').setDescription('The Pokémon name to search for'))
				.addIntegerOption((option) => option.setName('maxlevel').setDescription('The maximum level to search for').setMinValue(1).setMaxValue(100))
				.addIntegerOption((option) => option.setName('minlevel').setDescription('The minimum level to search for').setMinValue(1).setMaxValue(100))
				.addIntegerOption((option) => option.setName('maxiv').setDescription('The maximum IV to search for').setMinValue(1).setMaxValue(100))
				.addIntegerOption((option) => option.setName('miniv').setDescription('The minimum IV to search for').setMinValue(1).setMaxValue(100))
				.addIntegerOption((option) => option.setName('maxattack').setDescription('The maximum attack IV to search for').setMinValue(0).setMaxValue(31))
				.addIntegerOption((option) => option.setName('minattack').setDescription('The minimum attack IV to search for').setMinValue(0).setMaxValue(31))
				.addIntegerOption((option) => option.setName('maxspattack').setDescription('The maximum special attack IV to search for').setMinValue(0).setMaxValue(31)) // eslint-disable-line prettier/prettier
				.addIntegerOption((option) => option.setName('minspattack').setDescription('The minimum special attack IV to search for').setMinValue(0).setMaxValue(31)) // eslint-disable-line prettier/prettier
				.addIntegerOption((option) => option.setName('maxdefence').setDescription('The maximum defence IV to search for').setMinValue(0).setMaxValue(31))
				.addIntegerOption((option) => option.setName('mindefence').setDescription('The minimum defence IV to search for').setMinValue(0).setMaxValue(31))
				.addIntegerOption((option) => option.setName('maxspdefence').setDescription('The maximum special defence IV to search for').setMinValue(0).setMaxValue(31)) // eslint-disable-line prettier/prettier
				.addIntegerOption((option) => option.setName('minspdefence').setDescription('The minimum special defence IV to search for').setMinValue(0).setMaxValue(31)) // eslint-disable-line prettier/prettier
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
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('search')
				.setDescription('Search for Pokémon listed on the auction')
				.addIntegerOption((option) => option.setName('page').setDescription('The page to view (-1 for latest), default: 1'))
				// .addBooleanOption((option) => option.setName('shiny').setDescription('Only show shiny Pokémon'))
				.addStringOption((option) => option.setName('name').setDescription('The Pokémon name to search for'))
				.addIntegerOption((option) => option.setName('maxlevel').setDescription('The maximum level to search for').setMinValue(1).setMaxValue(100))
				.addIntegerOption((option) => option.setName('minlevel').setDescription('The minimum level to search for').setMinValue(1).setMaxValue(100))
				.addIntegerOption((option) => option.setName('maxiv').setDescription('The maximum IV to search for').setMinValue(1).setMaxValue(100))
				.addIntegerOption((option) => option.setName('miniv').setDescription('The minimum IV to search for').setMinValue(1).setMaxValue(100))
				.addIntegerOption((option) => option.setName('maxattack').setDescription('The maximum attack IV to search for').setMinValue(0).setMaxValue(31))
				.addIntegerOption((option) => option.setName('minattack').setDescription('The minimum attack IV to search for').setMinValue(0).setMaxValue(31))
				.addIntegerOption((option) => option.setName('maxspattack').setDescription('The maximum special attack IV to search for').setMinValue(0).setMaxValue(31)) // eslint-disable-line prettier/prettier
				.addIntegerOption((option) => option.setName('minspattack').setDescription('The minimum special attack IV to search for').setMinValue(0).setMaxValue(31)) // eslint-disable-line prettier/prettier
				.addIntegerOption((option) => option.setName('maxdefence').setDescription('The maximum defence IV to search for').setMinValue(0).setMaxValue(31))
				.addIntegerOption((option) => option.setName('mindefence').setDescription('The minimum defence IV to search for').setMinValue(0).setMaxValue(31))
				.addIntegerOption((option) => option.setName('maxspdefence').setDescription('The maximum special defence IV to search for').setMinValue(0).setMaxValue(31)) // eslint-disable-line prettier/prettier
				.addIntegerOption((option) => option.setName('minspdefence').setDescription('The minimum special defence IV to search for').setMinValue(0).setMaxValue(31)) // eslint-disable-line prettier/prettier
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
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('create')
				.setDescription('Put a Pokémon on the auction')
				.addStringOption((option) => option.setName('id').setDescription('The ID or nickname of your Pokémon (-1 for latest)').setRequired(true))
				.addIntegerOption((option) => option.setName('insta').setDescription('The bid that ends the auction immediately, default: none').setMinValue(1))
				.addIntegerOption((option) => option.setName('min').setDescription('The minimum first bid, default: none').setMinValue(1))
				.addIntegerOption((option) => option.setName('jump').setDescription('The minimum increase of a bid, default: 1').setMinValue(1))
				.addIntegerOption((option) =>
					option
						.setName('hours')
						.setDescription('How long the auction runs, default: 36 hours')
						.setMinValue(12)
						.setMaxValue(30 * 24)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('bid')
				.setDescription('Bid on an auction')
				.addStringOption((option) => option.setName('id').setDescription('The auction ID').setMinLength(1).setMaxLength(6).setRequired(true))
				.addIntegerOption((option) => option.setName('bid').setDescription('Your bid in credits').setMinValue(1).setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setDescription('View an auction')
				.addStringOption((option) => option.setName('id').setDescription('The auction ID').setMinLength(1).setMaxLength(6).setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('end')
				.setDescription('End your own auction')
				.addStringOption((option) => option.setName('id').setDescription('The auction ID').setMinLength(1).setMaxLength(6).setRequired(true))
		)

		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		switch (interaction.options.getSubcommand()) {
			case 'listings': {
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

				return await runCommand(interaction, now, 'auction listings', {
					page,
					fbs: { filters, bounds },
				});
			}
			case 'create': {
				const pokeID = interaction.options.getString('id');
				const hours = interaction.options.getInteger('hours');
				const insta = interaction.options.getInteger('insta');
				const min = interaction.options.getInteger('min');
				const jump = interaction.options.getInteger('jump');

				return await runCommand(interaction, now, 'auction create', {
					pokeID,
					hours,
					insta,
					min,
					jump,
				});
			}
			case 'bid': {
				const id = interaction.options.getString('id', true);
				const amount = interaction.options.getInteger('bid', true);

				return await runCommand(interaction, now, 'auction bid', { id, amount });
			}
			case 'view': {
				const id = interaction.options.getString('id', true);

				return await runCommand(interaction, now, 'auction view', { id });
			}
			case 'end': {
				const id = interaction.options.getString('id', true);

				return await runCommand(interaction, now, 'auction end', { id });
			}
			default: {
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

				return await runCommand(interaction, now, 'auction search', {
					page,
					fbs: {
						filters,
						bounds,
					},
				});
			}
		}
	},
};
