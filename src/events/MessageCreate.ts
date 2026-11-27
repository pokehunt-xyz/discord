import { Events, Message } from 'discord.js';
import { runCommand, userSendMessage } from '../utils/api';
import { isForbiddenGuild, leaveGuild } from '../utils/allowedGuilds';

export default {
	name: Events.MessageCreate,

	async execute(message: Message): Promise<void> {
		const now = Date.now();
		if (message.author.bot) return; // User is a bot

		// Leave servers where the bot should not be (see ALLOWED_GUILD_IDS)
		if (isForbiddenGuild(message.guildId)) {
			if (message.guild) await leaveGuild(message.guild, (content) => (message.channel.isSendable() ? message.channel.send(content) : Promise.resolve()));
			return;
		}

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
