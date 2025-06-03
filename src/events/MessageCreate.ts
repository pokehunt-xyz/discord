import { Events, Message } from 'discord.js';
import { runCommand } from '../utils/api';

export default {
	name: Events.MessageCreate,

	async execute(message: Message): Promise<void> {
		const now = Date.now();
		if (message.author.bot) return; // User is a bot

		message.client.shard?.send({
			function: 'userSendMessage',
			userID: message.author.id,
			userName: message.member?.displayName ?? message.author.displayName,
			channelID: message.channelId,
			guildID: message.guildId,
			guildName: message.guild?.name ?? null,
		});

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
