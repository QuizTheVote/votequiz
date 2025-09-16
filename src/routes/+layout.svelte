<script>
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar />

<div>
  <slot />
</div>

<footer class="bg-white border-t py-4 mt-6">
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
