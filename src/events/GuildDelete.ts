import { Events, Guild } from 'discord.js';

export default {
	name: Events.GuildDelete,
	once: true,

	async execute(guild: Guild): Promise<void> {
		guild.client.shard?.send({ function: 'guildChange', event: 'removed', guildID: guild.id, guildName: guild.name });
	},
};
