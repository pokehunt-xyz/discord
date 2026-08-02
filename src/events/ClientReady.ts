import { ChannelType, Client, Events } from 'discord.js';
import { createWsConnection } from '../utils/api';

export default {
	name: Events.ClientReady,
	once: true,

	async execute(client: Client): Promise<void> {
		createWsConnection(client);

		const shards = client.shard?.ids.join(', ');
		client.user?.setActivity(`www.pokehunt.xyz | Shard: ${shards}`);

		// Log cache sizes every 1 hour
		setInterval(() => {
			console.log(`--- Cache Status ${shards} ---`);
			console.log(`Total users: ${client.users.cache.size}`);
			console.log(`Total channels: ${client.channels.cache.size}`);
			console.log(`Total guilds: ${client.guilds.cache.size}`);

			const { members, memberCount, channels, messages } = client.guilds.cache.reduce(
				(acc, guild) => {
					const messages = guild.channels.cache.reduce((acc, channel) => {
						if (channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum || channel.type === ChannelType.GuildMedia) return acc;
						else return acc + channel.messages.cache.size;
					}, 0);
					return {
						members: acc.members + guild.members.cache.size,
						memberCount: acc.memberCount + guild.memberCount,
						channels: acc.channels + guild.channels.cache.size,
						messages: acc.messages + messages,
					};
				},
				{ members: 0, memberCount: 0, channels: 0, messages: 0 }
			);
			console.log(`Total guildMembers: ${members} (${memberCount})`);
			console.log(`Total guildChannels: ${channels}`);
			console.log(`Total guildMessages: ${messages}`);
			console.log('--- Cache Status -----');
		}, 3_600_000);
	},
};
