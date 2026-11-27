import { Guild } from 'discord.js';

/** The invite link of the main bot */
export const MAIN_BOT_INVITE_LINK =
	'https://discord.com/api/oauth2/authorize?client_id=716533909818572850&permissions=137976138816&scope=bot%20applications.commands';

export const LEAVE_MESSAGE = `This PokéHunt bot is only for testing and works in its test server only. Add the main bot to this server instead: <${MAIN_BOT_INVITE_LINK}>`;

let allowedGuildIDs: Set<string> | null | undefined;

/**
 * The env variable ALLOWED_GUILD_IDS (e.g. for the beta bot): the bot only works in DMs and in these servers (comma separated), and leaves every other server
 * Not set (or empty): no limit
 */
export function getAllowedGuildIDs(): Set<string> | null {
	if (allowedGuildIDs === undefined) {
		const ids = (process.env.ALLOWED_GUILD_IDS ?? '')
			.split(',')
			.map((id) => id.trim())
			.filter((id) => id !== '');
		allowedGuildIDs = ids.length > 0 ? new Set(ids) : null;
	}
	return allowedGuildIDs;
}

/** For tests: read ALLOWED_GUILD_IDS again */
export function resetAllowedGuildIDs(): void {
	allowedGuildIDs = undefined;
}

/**
 * Whether the bot should not be in this server (ALLOWED_GUILD_IDS is set, and this server is not in it)
 * @param guildID - The server, null for DMs (always allowed)
 */
export function isForbiddenGuild(guildID: string | null): boolean {
	const allowed = getAllowedGuildIDs();
	return allowed !== null && guildID !== null && !allowed.has(guildID);
}

// Servers we left recently, so we only leave (and log) once when multiple events arrive at the same time
const leftGuilds = new Map<string, number>();
const LEFT_GUILD_MEMORY = 60_000; // ms

/**
 * Send the message to add the main bot instead, and leave a server where the bot should not be
 * @param guild - The server
 * @param sendMessage - Sends LEAVE_MESSAGE (e.g. as a reply), only called if we did not leave this server recently
 * @returns Whether we left now (false if we already did recently)
 */
export async function leaveGuild(guild: Guild, sendMessage?: (content: string) => Promise<unknown>): Promise<boolean> {
	const now = Date.now();
	for (const [id, leftAt] of leftGuilds) if (now - leftAt > LEFT_GUILD_MEMORY) leftGuilds.delete(id);
	if (leftGuilds.has(guild.id)) return false;
	leftGuilds.set(guild.id, now);

	try {
		await sendMessage?.(LEAVE_MESSAGE);
	} catch {
		// e.g. no permission to send messages, we still leave
	}

	try {
		await guild.leave();
	} catch (e) {
		console.log(`Could not leave server ${guild.id}:`, e);
	}
	return true;
}
