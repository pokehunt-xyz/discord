import { Events } from 'discord.js';

export default {
	name: Events.ShardReady,
	once: true,

	async execute(id: number): Promise<void> {
		console.log(`[SHARD #${id}] ready`);
	},
};
