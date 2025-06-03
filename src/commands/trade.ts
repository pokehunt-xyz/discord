import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { InvalidOptionError, OnlyInGuildError } from '../utils/error';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('trade')
		.setDescription('Trade Pokémon and/or credits with others')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('start')
				.setDescription('Start a trade with a user')
				.addUserOption((option) => option.setName('user').setDescription('The user you want to trade with').setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Add an item to the trade')
				.addStringOption((option) => option.setName('value').setDescription('The Pokémon ID or amount of currency you want to add').setRequired(true))
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('The item you want to add to the trade')
						.addChoices({ name: 'Pokémon', value: 'pokemon' }, { name: 'Credits', value: 'credits' }, { name: 'Redeems', value: 'redeems' })
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove an item from the trade')
				.addStringOption((option) => option.setName('value').setDescription('The Pokémon ID or amount of currency you want to remove').setRequired(true))
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('The item you want to remove from the trade')
						.addChoices({ name: 'Pokémon', value: 'pokemon' }, { name: 'Credits', value: 'credits' }, { name: 'Redeems', value: 'redeems' })
				)
		)
		.addSubcommand((subcommand) => subcommand.setName('cancel').setDescription('Cancel a trade and get your items back'))
		.addSubcommand((subcommand) => subcommand.setName('confirm').setDescription('Confirm the trade'))
		.addSubcommand((subcommand) => subcommand.setName('view').setDescription('View the trade'))
		.setContexts([InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		if (!interaction.inCachedGuild()) throw new OnlyInGuildError();

		switch (interaction.options.getSubcommand()) {
			case 'start': {
				const memberTo = interaction.options.getMember('user');
				if (!memberTo) throw new InvalidOptionError('user', 'should be a valid member');

				return await runCommand(interaction, now, 'trade start', {
					taggedPlatform: 'discord',
					taggedID: memberTo.id,
					taggedName: memberTo.displayName,
				});
			}

			case 'cancel': {
				return await runCommand(interaction, now, 'trade cancel', {});
			}
			case 'confirm': {
				return await runCommand(interaction, now, 'trade confirm', {});
			}
			case 'add':
			case 'remove': {
				let item = interaction.options.getString('item');
				if (!item) item = 'viabutton';

				const value = interaction.options.getString('value', true);
				return await runCommand(interaction, now, `trade ${interaction.options.getSubcommand()}${item}`, { value });
			}
			default: {
				return await runCommand(interaction, now, 'trade view', {});
			}
		}
	},
};
