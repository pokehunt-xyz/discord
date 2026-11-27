import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Guild } from 'discord.js';

import { getAllowedGuildIDs, isForbiddenGuild, LEAVE_MESSAGE, leaveGuild, resetAllowedGuildIDs } from '../../src/utils/allowedGuilds';

/** A server with only what leaveGuild uses */
const fakeGuild = (id: string): Guild & { leave: jest.Mock } => ({ id, leave: jest.fn(async () => undefined) }) as unknown as Guild & { leave: jest.Mock };

describe('ALLOWED_GUILD_IDS', () => {
	afterEach(() => {
		delete process.env.ALLOWED_GUILD_IDS;
		resetAllowedGuildIDs();
	});

	it('Should not limit anything when not set or empty', () => {
		expect(getAllowedGuildIDs()).toBeNull();
		expect(isForbiddenGuild('1')).toBe(false);

		process.env.ALLOWED_GUILD_IDS = ' , ';
		resetAllowedGuildIDs();
		expect(getAllowedGuildIDs()).toBeNull();
		expect(isForbiddenGuild('1')).toBe(false);
	});

	it('Should only allow DMs and the given servers when set', () => {
		process.env.ALLOWED_GUILD_IDS = '111, 222';
		resetAllowedGuildIDs();

		expect(getAllowedGuildIDs()).toEqual(new Set(['111', '222']));
		expect(isForbiddenGuild('111')).toBe(false);
		expect(isForbiddenGuild('222')).toBe(false);
		expect(isForbiddenGuild('333')).toBe(true);
		expect(isForbiddenGuild(null)).toBe(false); // DM
	});
});

describe('leaveGuild', () => {
	it('Should send the message and leave once', async () => {
		const guild = fakeGuild('leave-once');
		const send = jest.fn(async (content: string) => content);

		await expect(leaveGuild(guild, send)).resolves.toBe(true);
		expect(send).toHaveBeenCalledWith(LEAVE_MESSAGE);
		expect(guild.leave).toHaveBeenCalledTimes(1);

		// A second event of the same server right after: nothing again
		await expect(leaveGuild(guild, send)).resolves.toBe(false);
		expect(send).toHaveBeenCalledTimes(1);
		expect(guild.leave).toHaveBeenCalledTimes(1);
	});

	it('Should still leave when the message can not be sent', async () => {
		const guild = fakeGuild('no-permission');

		await expect(
			leaveGuild(guild, async () => {
				throw new Error('Missing Permissions');
			})
		).resolves.toBe(true);
		expect(guild.leave).toHaveBeenCalledTimes(1);
	});

	it('Should not throw when leaving fails', async () => {
		const guild = fakeGuild('leave-fails');
		guild.leave.mockImplementation(async () => {
			throw new Error('Unknown Guild');
		});
		jest.spyOn(console, 'log').mockImplementation(() => undefined);

		await expect(leaveGuild(guild)).resolves.toBe(true);
	});
});
