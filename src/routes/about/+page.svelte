<svelte:head>
  <title>About - Quiz The Vote</title>
  <meta name="description" content="Learn about the science and team behind Quiz The Vote voter-candidate matching platform.">
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <a href="/" class="text-2xl font-bold text-gray-900">🗳️ Quiz The Vote</a>
        </div>
        <nav class="flex space-x-6">
          <a href="/" class="text-gray-600 hover:text-gray-900">Demo</a>
          <a href="/newsroom.html" class="text-gray-600 hover:text-gray-900">For Newsrooms</a>
          <a href="/about.html" class="text-blue-600 font-medium">About</a>
          <a href="/methodology.html" class="text-gray-600 hover:text-gray-900">Methodology</a>
        </nav>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-12">
    <div class="bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">About Quiz The Vote</h1>
      
      <div class="prose prose-lg max-w-none">
        <h2>The Vision</h2>
        <p>
          Quiz The Vote represents a breakthrough in political engagement tools for newsrooms. Unlike traditional political quizzes 
          that focus on surface-level policy positions, our platform helps voters connect with candidates based on 
          substantive policy positions and local issues that matter to their community.
        </p>

        <h2>Why SVO Matters</h2>
        <p>
          After 40+ years of psychological research, we know that people's political preferences stem from deeper 
          social orientations rather than just policy knowledge. Our questions reveal whether someone is:
        </p>
        <ul>
          <li><strong>Prosocial/Cooperative:</strong> Values collective benefit and collaboration</li>
          <li><strong>Individualistic:</strong> Focuses on personal outcomes and self-reliance</li>
          <li><strong>Competitive:</strong> Motivated by relative advantage and winning</li>
        </ul>

        <h2>For Newsrooms</h2>
        <p>
          We've designed this platform specifically for journalists and civic organizations who want to engage 
          their audiences with more meaningful political content. No coding required - just copy our template, 
          add your local candidates, and embed the quiz on your website.
        </p>

        <h2>Technical Innovation</h2>
        <p>
          Our platform supports multiple question types and advanced matching algorithms:
        </p>
        <ul>
          <li>Scale-based questions (5-point agreement, 3-point support)</li>
          <li>Multiple choice and categorical questions</li>
          <li>Jaccard similarity for complex preference matching</li>
          <li>Weighted topic importance based on user priorities</li>
        </ul>

        <h2>Open Source</h2>
        <p>
          This project is open source and built with modern web technologies including SvelteKit, 
          TypeScript, and Tailwind CSS. We believe in transparency and continuous improvement through 
          community contributions.
        </p>

        <div class="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">Ready to get started?</h3>
          <div class="space-x-4">
            <a href="/newsroom.html" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
              Create Your Quiz
            </a>
            <a href="/?svo=true&demo=true" class="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50">
              Try the Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>