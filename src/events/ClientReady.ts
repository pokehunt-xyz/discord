import { Client, Events } from 'discord.js';
import { createWsConnection } from '../utils/api';

export default {
	name: Events.ClientReady,
	once: true,

	async execute(client: Client): Promise<void> {
		createWsConnection(client);

		const shards = client.shard?.ids.join(', ');
		client.user?.setActivity(`www.pokehunt.xyz | Shard: ${shards}`);
	},
};
