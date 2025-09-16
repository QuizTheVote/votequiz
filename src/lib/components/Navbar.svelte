<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
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
      <div class="flex items-center">
        <span class="text-xl font-bold text-blue-600">
          {#if customTitle === 'Quiz The Vote'}🗳️ {/if}{customTitle}
        </span>
      </div>
    </div>
  </div>
</nav>
{/if} 