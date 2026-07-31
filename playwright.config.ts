import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
	testDir: 'tests',
	// Every failure here has previously shipped to production, so a flaky pass is
	// worse than a slow run. No retries: a test that only passes sometimes is a
	// test to fix, not to paper over.
	retries: 0,
	// A full quiz run is 5 to 9 question steps, and the first test to arrive pays
	// for Vite compiling the route on demand.
	timeout: 60_000,
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? [['github'], ['list']] : [['list']],
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'retain-on-failure'
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		// Pixel 5 rather than an iPhone so CI only needs Chromium. Most voters
		// arrive on a phone, and the ranking screen has a separate mobile layout.
		{ name: 'mobile', use: { ...devices['Pixel 5'] } }
	],
	webServer: {
		// dev rather than preview: adapter-static applies the /votequiz base path
		// in production builds, and these tests are about app behaviour, not paths.
		command: `npm run dev -- --port ${PORT} --strictPort`,
		// Wait on the route, not just the open port. Vite compiles on first
		// request, so waiting for the port alone hands the cold-start cost to
		// whichever test happens to run first.
		url: `http://localhost:${PORT}/`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
