<script lang="ts">
  import type { QuizSettings } from '$lib/sheets';

  /**
   * The newsroom's own end-of-quiz call to action, defined in the Sheet's
   * Settings tab (a newsletter signup, a coverage hub, a donate page — whatever
   * they choose). Structured fields, not raw HTML, so there is nothing to
   * sanitise and nothing that can break the results layout. The button URL is
   * already validated as http/https in sheets.ts.
   */
  export let settings: QuizSettings | undefined = undefined;

  $: headline = settings?.completionHeadline?.trim();
  $: body = settings?.completionBody?.trim();
  $: buttonUrl = settings?.completionButtonUrl;
  $: buttonLabel = settings?.completionButtonLabel?.trim() || 'Learn more';

  // Nothing worth showing unless there is at least a headline, a body, or a
  // working button.
  $: hasContent = Boolean(headline || body || buttonUrl);
</script>

{#if hasContent}
  <div class="mt-8 rounded-lg border border-brand-200 bg-brand-50 p-5 text-center">
    {#if headline}
      <h2 class="font-display text-lg sm:text-xl font-bold text-ink-900">{headline}</h2>
    {/if}
    {#if body}
      <p class="mt-2 text-sm sm:text-base text-ink-700">{body}</p>
    {/if}
    {#if buttonUrl}
      <a
        href={buttonUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="mt-4 inline-block bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-6 rounded-pill text-sm sm:text-base transition-colors"
      >
        {buttonLabel}
      </a>
    {/if}
  </div>
{/if}
