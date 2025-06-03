import { Client, Events } from 'discord.js';

export default {
	name: Events.ClientReady,
	once: true,

	async execute(client: Client): Promise<void> {
		if (!client.shard) return console.log(`ERROR: no shard? ${client.shard}`);
		const shardID = client.shard.ids[0];
		client.user?.setActivity(`www.pokehunt.xyz | Shard: ${shardID + 1}`);
	},
};
