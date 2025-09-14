<script>
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
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
