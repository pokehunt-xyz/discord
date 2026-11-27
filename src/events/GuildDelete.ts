import { Client, Events, Guild } from 'discord.js';
import { guildChange } from '../utils/api';
import { isForbiddenGuild } from '../utils/allowedGuilds';

export default {
	name: Events.GuildDelete,
	once: true,

	async execute(guild: Guild, client: Client): Promise<void> {
		// Servers where the bot should not be were never counted (see ALLOWED_GUILD_IDS)
		if (isForbiddenGuild(guild.id)) return;

		client.shard?.fetchClientValues('guilds.cache.size').then((results) => {
			const total = results.reduce((acc: number, guildCount) => {
				if (typeof guildCount === 'number') return acc + guildCount;
				else return acc;
			}, 0);
			guildChange('removed', guild.id, guild.name, total);
		});
	},
};
