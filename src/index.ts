import { Shard, ShardingManager } from 'discord.js';

import { createWsConnection, guildChange, userSendMessage } from './utils/api';

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) throw new Error('Missing environment variable DISCORD_BOT_TOKEN');

const shards: number | 'auto' = parseInt(process.env.DISCORD_BOT_SHARDS || '') || 'auto';
if (shards !== 'auto' && isNaN(shards)) throw new Error('Invalid environment variable DISCORD_BOT_SHARDS');

const manager = new ShardingManager('./dist/client.js', {
	token: token,
	totalShards: shards,
});

manager.on('shardCreate', async (shard: Shard) => {
	console.log(`[SHARD #${shard.id}] create`);
});

manager.spawn().then((shards) => {
	createWsConnection(manager);
	manager.fetchClientValues('guilds.cache').then((values) => {
		const total = values.flat().length;
		guildChange('added', '735436966300090419', 'FORCE SYNC OF COUNT TO MAKE SURE BOTINFO IS CORRECT', total);
	});

	shards.forEach((shard) => {
		shard.on('message', (message) => {
			if (!message.function) return;
			if (message.function === 'guildChange') {
				if (!message.event || (message.event !== 'added' && message.event !== 'removed')) return;
				if (!message.guildID || !message.guildName) return;

				manager.fetchClientValues('guilds.cache').then((values) => {
					const total = values.flat().length;
					guildChange(message.event, message.guildID, message.guildName, total);
				});
			} else if (message.function === 'userSendMessage') {
				const { userID, userName, channelID, guildID, guildName } = message;
				if (!userID || !userName || !channelID || (guildID !== null && !guildID) || (guildName !== null && !guildName)) return;

				userSendMessage(userID, userName, channelID, guildID, guildName);
			} else console.log(`Shard ${shard.id} got message ${JSON.stringify(message)}`);
		});
	});
});
