import { Client, Events, Guild } from 'discord.js';
import { guildChange } from '../utils/api';
import { isForbiddenGuild, leaveGuild } from '../utils/allowedGuilds';

export default {
	name: Events.GuildCreate,
	once: true,

	async execute(guild: Guild, client: Client): Promise<void> {
		// Leave servers where the bot should not be right away, they are not counted as a server of the bot (see ALLOWED_GUILD_IDS)
		if (isForbiddenGuild(guild.id)) {
			await leaveGuild(guild, (content) => guild.systemChannel?.send(content) ?? Promise.resolve());
			return;
		}

		client.shard?.fetchClientValues('guilds.cache.size').then((results) => {
			const total = results.reduce((acc: number, guildCount) => {
				if (typeof guildCount === 'number') return acc + guildCount;
				else return acc;
			}, 0);
			guildChange('added', guild.id, guild.name, total);
		});
	},
};
