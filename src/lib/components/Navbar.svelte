<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import BrandMark from './BrandMark.svelte';
  
  let customTitle = '';
  let showHeader = true;
  
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    customTitle = urlParams.get('title') || 'Quiz The Vote';
    
    // Option to hide header entirely
    if (urlParams.get('header') === 'false') {
      showHeader = false;
    }
  });
</script>

{#if showHeader}
<nav class="bg-white shadow">
  <div class="container mx-auto px-4">
    <div class="flex justify-center h-16">
      <div class="flex items-center gap-2">
        {#if customTitle === 'Quiz The Vote'}
          <BrandMark class="h-7 w-auto" />
        {/if}
        <span class="font-display text-xl font-bold text-ink-900">{customTitle}</span>
      </div>
    </div>
  </div>
</nav>
{/if} 