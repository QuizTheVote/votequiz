<script>
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import { onMount } from 'svelte';

  let showHeightWarning = false;
  
  // Detect if content is cut off and show warning
  function checkContentFit() {
    if (window.parent && window.parent !== window) {
      const totalHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      
      const viewportHeight = window.innerHeight;
      
      if (totalHeight > viewportHeight + 50) {
        showHeightWarning = true;
        console.warn('Quiz content may be cut off. Recommend increasing iframe height to:', totalHeight + 'px');
      } else {
        showHeightWarning = false;
      }
    }
  }

  onMount(() => {
    // Check content fit after initial load
    setTimeout(checkContentFit, 1000);
  });
</script>

<Navbar />

<!-- Height Warning for Embedded Content -->
{#if showHeightWarning}
  <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm text-yellow-700">
          <strong>Content may be cut off.</strong> If you're embedding this quiz, try increasing the iframe height to show all content.
        </p>
      </div>
    </div>
  </div>
{/if}

<div class="flex flex-col min-h-screen">
  <main class="flex-1">
    <slot />
  </main>
  <footer class="bg-white border-t py-6 mt-8 flex-shrink-0">
    <div class="container mx-auto px-4 text-center text-gray-600 text-sm">
      <p class="mb-2">
        Powered by <a href="https://www.quizthevote.com" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium">QuizTheVote</a>
      </p>
      <p class="text-xs">
        Help voters connect with candidates based on policy, not party | 
        <a href="https://www.quizthevote.com/build-your-quiz/" target="_blank" class="text-blue-600 hover:text-blue-800">Create Your Quiz</a>
      </p>
    </div>
  </footer>
</div>
