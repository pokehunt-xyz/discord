const KUMA_PUSH_URL = process.env.KUMA_PUSH_URL;

export function uptime_kuma_ping(): void {
	if (!KUMA_PUSH_URL) return;

	setInterval(
		async () => {
			try {
				await fetch(KUMA_PUSH_URL);
			} catch (err) {
				console.error('Failed to ping Uptime Kuma:', err);
			}
			// Every 5 minutes
		},
		5 * 60 * 1000
	);
}
