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
    <p>© {new Date().getFullYear()} Candidate Matcher | <a href="https://github.com/your-org/election-quiz" class="hover:underline">Open Source</a> under MIT License</p>
  </div>
</footer>
