import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { runCommand } from '../utils/api';
import { CommandResponse } from '../utils/types';

export default {
	data: new SlashCommandBuilder()
		.setName('nickname')
		.setDescription('Give a Pokémon a nickname, or remove it')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('set')
				.setDescription('Set the nickname of your Pokémon')
				.addStringOption((option) => option.setName('nickname').setDescription('The nickname to set').setRequired(true).setMaxLength(32))
				.addStringOption((option) => option.setName('id').setDescription('The ID or nickname of your Pokémon (-1 for latest), default: 0'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('reset')
				.setDescription('Remove the nickname of your Pokémon')
				.addStringOption((option) => option.setName('id').setDescription('The ID or nickname of your Pokémon (-1 for latest), default: 0'))
		)
		.setContexts([InteractionContextType.BotDM, InteractionContextType.Guild]),

	async execute(interaction: ChatInputCommandInteraction, now: number): Promise<CommandResponse> {
		const id = interaction.options.getString('id');

		// nickname option is required for set subcommand, and impossible to set for reset subcommand, thus we can bypass checking subcommand
		const nickname = interaction.options.getString('nickname') ?? null;

		return await runCommand(interaction, now, 'nickname', { id, nickname });
	},
};
