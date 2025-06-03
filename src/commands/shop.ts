import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Buy stones, bracelets, forms and rare candies for your Pokémon')
		.addStringOption((option) =>
			option
				.setName('type')
				.setDescription('The type of items you want to view')
				.addChoices(
					{ name: 'Experience + level blockers & boosters', value: 'xp' },
					{ name: 'Evolution Stones', value: 'stones' },
					{ name: 'Evolution Items', value: 'evolution' },
					{ name: 'Remove item or stone', value: 'remove' },
					{ name: 'Nature Modifiers', value: 'natures' },
					{ name: 'Mega Evolution & Forms', value: 'forms' }
				)
		)
		.addStringOption((option) => option.setName('id').setDescription('The ID of the Pokémon you want to buy an item for (-1 for latest)'))
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const id = interaction.options.getString('id');
		const page = interaction.options.getString('type');

		return await runCommand(interaction, now, 'shop', { id, page });
	},
};
