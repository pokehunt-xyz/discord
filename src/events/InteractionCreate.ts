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

import { runCallbackCommand } from '../utils/api';
import { APIError, CustomError, IgnoreError, InvalidOptionError, OnlyInGuildError } from '../utils/error';
import { CommandResponse } from '../utils/types';

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
			const isChatCommand = interaction instanceof ChatInputCommandInteraction;
			let deferPromise: Promise<unknown>;
			let cmdPromise: Promise<CommandResponse> | Promise<{ content: string }>;

			if (isChatCommand) {
				const command = interaction.client.commands.get(interaction.commandName);

				// Start deferring, but DON'T await it yet
				deferPromise = interaction.commandName === 'donate' ? interaction.deferReply({ ephemeral: true }) : interaction.deferReply();

				// Start command execution immediately
				cmdPromise = command ? command.execute(interaction, now) : Promise.resolve({ content: 'That command does not exists!' });
			} else {
				// Start deferring, but DON'T await it yet
				deferPromise = interaction.deferUpdate();

				// Start callback execution immediately
				cmdPromise = runCallbackCommand(interaction, now);
			}

			// Wait for BOTH to finish before editing
			const [deferResult, cmdResult] = await Promise.allSettled([deferPromise, cmdPromise]);

			if (deferResult.status === 'rejected') {
				console.log('\n\nDEFER REJECTED!!');

				// If the command was fulfilled, try to reply anyway
				if (cmdResult.status === 'fulfilled') {
					try {
						await interaction.reply(cmdResult.value);
					} catch (e) {
						console.log('\nAFTER DEFER REJECTED, REPLY FAILED:');
						console.error(e);
						console.log('===');
					}
				}

				console.error(deferResult.reason);
				return;
			}

			if (cmdResult.status === 'fulfilled') await interaction.editReply(cmdResult.value);
			else throw cmdResult.reason;
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
	if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

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
	if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

	if (!error) error = 'Something went wrong, please try again!';

	const embed = new EmbedBuilder();
	embed.setTitle('❌ Error!');
	embed.setDescription(error);
	embed.setColor('#FF0000');
	await interaction.editReply({ embeds: [embed], files: [], components: [], content: undefined });
}
