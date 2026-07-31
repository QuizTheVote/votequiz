import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// Static site generation for GitHub Pages
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: false
		}),
		
		// Configure base path for GitHub Pages
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/votequiz' : ''
		},

		// Prerender all pages for static site generation
		prerender: {
			// 'fail', not 'warn': four nav links pointed at .html files without the
			// base path and 404ed in production for months while the build kept
			// reporting it as a warning nobody read.
			handleHttpError: 'fail',
			handleMissingId: 'fail',
			entries: ['/', '/about', '/methodology', '/newsroom']
		},
		
		// Enable SPA mode for static site hosting
		alias: {
			$lib: './src/lib'
		},
		
		// Added for production optimization
		version: {
			pollInterval: 60000, // Check for changes every minute in dev
			name: Date.now().toString() // Use timestamp for cache busting
		}
	}
};

export default config;
