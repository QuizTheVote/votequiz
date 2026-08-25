<script lang="ts">
  /**
   * Lets a voter share their result. Links point at the newsroom page the quiz
   * lives on (Settings.share_url); when that is unset we fall back to the
   * QuizTheVote homepage so a share is never broken.
   *
   * Instagram is deliberately absent: it has no web share-intent that accepts
   * prefilled text or a link, so a button for it could only open a blank
   * composer. The native "Share…" option below covers Instagram on phones that
   * have the app installed.
   */
  export let shareUrl: string | undefined = undefined;
  export let topName: string | null = null;
  export let topPercentage: number | null = null;
  export let quizTitle: string | null = null;

  const FALLBACK_URL = 'https://www.quizthevote.com';

  let open = false;
  let copied = false;
  let canNativeShare = false;

  $: url = shareUrl || FALLBACK_URL;

  // The sentence a voter would actually want to post. Leads with their match so
  // it reads as a personal result, not an ad.
  $: shareText = (() => {
    const race = quizTitle ? ` in the ${quizTitle}` : '';
    if (topName && topPercentage !== null) {
      return `I'm a ${topPercentage}% match with ${topName}${race}. See which candidate matches your views:`;
    }
    return `I just found my candidate matches${race}. See which candidate matches your views:`;
  })();

  $: encodedUrl = encodeURIComponent(url);
  $: encodedText = encodeURIComponent(shareText);

  // Facebook's sharer ignores prefilled text for most users, so it gets the URL
  // only; the others accept text + link.
  $: targets = [
    {
      id: 'x',
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    },
    {
      id: 'facebook',
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      id: 'bluesky',
      label: 'Bluesky',
      href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${shareText} ${url}`)}`
    }
  ];

  import { onMount } from 'svelte';
  onMount(() => {
    canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  });

  function toggle() {
    open = !open;
    copied = false;
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: quizTitle || 'Quiz The Vote', text: shareText, url });
      open = false;
    } catch {
      // The user dismissed the sheet; leave our panel as it was.
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      copied = false;
    }
  }
</script>

<div class="relative inline-block">
  <button
    type="button"
    class="flex items-center gap-2 bg-brand-500 hover:bg-brand-700 text-white font-bold py-2 px-3 sm:px-4 rounded-pill text-sm sm:text-base"
    on:click={toggle}
    aria-haspopup="dialog"
    aria-expanded={open}
  >
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
    Share
  </button>

  {#if open}
    <!-- Click-away backdrop -->
    <button
      type="button"
      class="fixed inset-0 z-10 cursor-default"
      aria-label="Close share menu"
      on:click={() => (open = false)}
    ></button>

    <div
      class="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-ink-200 bg-white p-3 shadow-lg"
      role="dialog"
      aria-label="Share your results"
    >
      <p class="mb-2 text-sm font-semibold text-ink-800">Share your results</p>

      <div class="grid grid-cols-2 gap-2">
        {#each targets as target}
          <a
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            class="rounded border border-ink-200 px-3 py-2 text-center text-sm font-medium text-ink-800 hover:bg-brand-50 hover:text-brand-700"
          >
            {target.label}
          </a>
        {/each}
      </div>

      <button
        type="button"
        class="mt-2 w-full rounded border border-ink-200 px-3 py-2 text-sm font-medium text-ink-800 hover:bg-brand-50 hover:text-brand-700"
        on:click={copyLink}
      >
        {copied ? 'Link copied' : 'Copy link'}
      </button>

      {#if canNativeShare}
        <button
          type="button"
          class="mt-2 w-full rounded border border-ink-200 px-3 py-2 text-sm font-medium text-ink-800 hover:bg-brand-50 hover:text-brand-700"
          on:click={nativeShare}
        >
          Share via device…
        </button>
      {/if}
    </div>
  {/if}
</div>
