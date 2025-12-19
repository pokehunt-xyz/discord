import {
	BaseInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	DiscordjsError,
	DiscordjsErrorCodes,
	EmbedBuilder,
	Events,
	StringSelectMenuInteraction,
} from 'discord.js';

import { APIError, CustomError, IgnoreError, InvalidOptionError, OnlyInGuildError } from '../utils/error';
import { runCallbackCommand } from '../utils/api';

export default {
	name: Events.InteractionCreate,

	async execute(interaction: BaseInteraction): Promise<void> {
		const now = Date.now();
		if (
			!(interaction instanceof ButtonInteraction) &&
			!(interaction instanceof ChatInputCommandInteraction) &&
			!(interaction instanceof StringSelectMenuInteraction)
		)
			return;
		if (interaction.user.bot) return; // User is a bot

		try {
			if (interaction instanceof ChatInputCommandInteraction) {
				const command = interaction.client.commands.get(interaction.commandName);
				if (interaction.commandName === 'donate' || interaction.commandName === 'courtyard') await interaction.deferReply({ ephemeral: true });
				else await interaction.deferReply();

				if (!command) interaction.editReply({ content: 'That command does not exists!' });
				else {
					const cmdRes = await command.execute(interaction, now);
					await interaction.editReply(cmdRes);
				}
			} else {
				await interaction.deferUpdate();
				const cmdRes = await runCallbackCommand(interaction, now);
				await interaction.editReply(cmdRes);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			try {
				if (error instanceof IgnoreError) return;
				else if (error instanceof CustomError) return await CUSTOM(interaction, error.message);
				else if (error instanceof InvalidOptionError) return await CUSTOM(interaction, error.message);
				else if (error instanceof OnlyInGuildError) return await CUSTOM(interaction, error.message);
				else if (error instanceof APIError) return await CUSTOM(interaction, error.message + '. Please contact support here: https://discord.gg/cpYkJzd');
				else if (error instanceof DiscordjsError && error.code === DiscordjsErrorCodes.InteractionCollectorError) {
					if (error.message.includes('time'))
						await interaction.editReply({ components: [] }); // content: 'You waited too long, please run the command again.',
					else if (!error.message.includes('messageDelete')) console.log(error.message);
				} else return await UNKNOWN_ERROR(interaction, error);
			} catch (e) {
				console.log('---');
				console.log(`An error happened when trying to process an error at ${new Date()}:`);
				console.error(error);
				console.log('-');
				console.error(e);
				console.log('---');
			}
		}
	},
};

/**
 * ERROR: Unknown error with the code (not user). For user errors use CUSTOM
 * @param interaction - The interaction to followUp to
 * @param error - The error message/code
 */
async function UNKNOWN_ERROR(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, error: Error): Promise<void> {
	if (!interaction.deferred) await interaction.deferReply();

	const embed = new EmbedBuilder();
	embed.setTitle('❌ Error!');
	embed.setColor('#FF0000');

	console.log('---');
	console.log('An unknown error happened:');
	console.log(error);
	console.log('---');

	embed.setDescription('An unknown error occurred (client). Please contact support here: https://discord.gg/cpYkJzd');
	await interaction.editReply({ embeds: [embed], files: [], components: [], content: undefined });
}
/**
 * ERROR: Custom error. Leave error empty to send default one
 * @param interaction - The interaction to followUp to
 * @param error - The error to show, leave empty for general error message
 */
async function CUSTOM(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, error?: string): Promise<void> {
	if (!interaction.deferred) await interaction.deferReply();

	if (!error) error = 'Something went wrong, please try again!';

	const embed = new EmbedBuilder();
	embed.setTitle('❌ Error!');
	embed.setDescription(error);
	embed.setColor('#FF0000');
	await interaction.editReply({ embeds: [embed], files: [], components: [], content: undefined });
}
