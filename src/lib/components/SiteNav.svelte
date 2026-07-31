<script lang="ts">
  import { base } from '$app/paths';
  import BrandMark from './BrandMark.svelte';

  /** Which link to mark as the current page. */
  export let current: 'demo' | 'newsroom' | 'about' | 'methodology' | null = null;
  /** Shown beside the wordmark, as the newsroom page does. */
  export let badge: string | null = null;

  // Every href goes through `base`. The site deploys under /votequiz, so a
  // root-absolute link resolves to the domain root and 404s. These links were
  // also pointing at .html files that this SvelteKit build does not produce.
  const links = [
    { key: 'demo', href: `${base}/`, label: 'Demo' },
    { key: 'newsroom', href: `${base}/newsroom`, label: 'For Newsrooms' },
    { key: 'about', href: `${base}/about`, label: 'About' },
    { key: 'methodology', href: `${base}/methodology`, label: 'Methodology' }
  ] as const;
</script>

<header class="bg-white shadow-sm">
  <div class="max-w-7xl mx-auto px-4 py-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center space-x-4">
        <a href="{base}/" class="flex items-center gap-2 font-display text-2xl font-bold text-ink-900">
          <BrandMark class="h-8 w-auto" />
          Quiz The Vote
        </a>
        {#if badge}
          <span class="bg-brand-50 text-brand-700 px-2 py-1 rounded-full text-sm font-medium">
            {badge}
          </span>
        {/if}
      </div>
      <nav class="flex flex-wrap gap-x-6 gap-y-1">
        {#each links as link}
          <a
            href={link.href}
            class={link.key === current
              ? 'text-brand-600 font-medium'
              : 'text-ink-600 hover:text-ink-900'}
            aria-current={link.key === current ? 'page' : undefined}
          >
            {link.label}
          </a>
        {/each}
      </nav>
    </div>
  </div>
</header>
