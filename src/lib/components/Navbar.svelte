<script>
  import { page } from '$app/stores';
</script>

<nav class="bg-white shadow">
  <div class="container mx-auto px-4">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-xl font-bold text-blue-600">Candidate Matcher</a>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a 
            href="/" 
            class={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${$page.url.pathname === '/' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Quiz
          </a>
          <a 
            href="/about" 
            class={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${$page.url.pathname === '/about' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            About
          </a>
          <a 
            href="/methodology" 
            class={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${$page.url.pathname === '/methodology' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Methodology
          </a>
        </div>
      </div>
      <div class="-mr-2 flex items-center sm:hidden">
        <button 
          type="button" 
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" 
          aria-controls="mobile-menu" 
          aria-expanded="false"
          on:click={() => {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
              mobileMenu.classList.toggle('hidden');
            }
          }}
        >
          <span class="sr-only">Open main menu</span>
          <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile menu -->
  <div class="hidden sm:hidden" id="mobile-menu">
    <div class="pt-2 pb-3 space-y-1">
      <a 
        href="/" 
        class={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${$page.url.pathname === '/' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}`}
      >
        Quiz
      </a>
      <a 
        href="/about" 
        class={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${$page.url.pathname === '/about' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}`}
      >
        About
      </a>
      <a 
        href="/methodology" 
        class={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${$page.url.pathname === '/methodology' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}`}
      >
        Methodology
      </a>
    </div>
  </div>
</nav> 