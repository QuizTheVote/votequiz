<script>
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import { onMount } from 'svelte';
  
  // Auto-resize functionality for iframe embedding
  onMount(() => {
    function sendResizeMessage() {
      if (window.parent !== window) {
        // We're in an iframe, send height to parent
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({
          type: 'resize',
          height: height
        }, '*');
      }
    }
    
    // Send initial resize
    sendResizeMessage();
    
    // Listen for resize requests from parent
    window.addEventListener('message', function(event) {
      if (event.data.type === 'requestResize') {
        sendResizeMessage();
      }
    });
    
    // Send resize when content changes
    const observer = new MutationObserver(sendResizeMessage);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true 
    });
    
    // Send resize on window resize
    window.addEventListener('resize', sendResizeMessage);
    
    // Send resize periodically for dynamic content
    const interval = setInterval(sendResizeMessage, 1000);
    
    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  });
</script>

<Navbar />

<div class="min-h-screen">
  <slot />
</div>

<footer class="bg-white border-t py-8 mt-12">
  <div class="container mx-auto px-4 text-center text-gray-600 text-sm">
    <p class="mb-2">
      Powered by <a href="https://www.quizthevote.com" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium">QuizTheVote</a>
    </p>
    <p class="text-xs">
      Help voters connect with candidates based on policy, not party | 
      <a href="https://www.quizthevote.com/get-started" target="_blank" class="text-blue-600 hover:text-blue-800">Create Your Quiz</a>
    </p>
  </div>
</footer>
