import { Client, Events, Guild } from 'discord.js';
import { guildChange } from '../utils/api';

export default {
	name: Events.GuildDelete,
	once: true,

	async execute(guild: Guild, client: Client): Promise<void> {
		client.shard?.fetchClientValues('guilds.cache.size').then((results) => {
			const total = results.reduce((acc: number, guildCount) => {
				if (typeof guildCount === 'number') return acc + guildCount;
				else return acc;
			}, 0);
			guildChange('removed', guild.id, guild.name, total);
		});
	},
};
