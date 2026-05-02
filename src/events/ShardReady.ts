import { Events } from 'discord.js';
import { createShardWs } from '../utils/api';

export default {
	name: Events.ShardReady,
	once: true,

	async execute(id: number): Promise<void> {
		console.log(`[SHARD #${id}] ready`);
		createShardWs(id);
	},
};
