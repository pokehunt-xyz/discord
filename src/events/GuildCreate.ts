import { Events, Guild } from 'discord.js';

export default {
	name: Events.GuildCreate,
	once: true,

	async execute(guild: Guild): Promise<void> {
		guild.client.shard?.send({ function: 'guildChange', event: 'added', guildID: guild.id, guildName: guild.name });
	},
};
