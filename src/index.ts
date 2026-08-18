import { Shard, ShardingManager } from 'discord.js';

import { guildChange } from './utils/api';
import { uptime_kuma_ping } from './utils/kuma';

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
	manager.fetchClientValues('guilds.cache').then((values) => {
		const total = values.flat().length;
		guildChange('added', '735436966300090419', 'FORCE SYNC OF COUNT TO MAKE SURE BOTINFO IS CORRECT', total);
	});

	uptime_kuma_ping();

	shards.forEach((shard) => {
		shard.on('message', (message) => {
			if (!message.function) return;
			console.log(`Shard ${shard.id} got message ${JSON.stringify(message)}`);
		});
	});
});
