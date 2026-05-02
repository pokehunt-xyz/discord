import { Events, Message } from 'discord.js';
import { runCommand, userSendMessage } from '../utils/api';

export default {
	name: Events.MessageCreate,

	async execute(message: Message): Promise<void> {
		const now = Date.now();
		if (message.author.bot) return; // User is a bot

		userSendMessage(
			message.author.id,
			message.member?.displayName ?? message.author.displayName,
			message.channelId,
			message.guildId,
			message.guild?.name ?? null
		);

		if (message.author.id === '425165710847770634' && message.content.startsWith('/admin')) {
			try {
				const cmdRes = await runCommand(message, now, 'admin', { message: message.content });
				await message.reply(cmdRes);
			} catch (e) {
				await message.reply({ content: JSON.stringify(e) });
			}
		}
	},
};
