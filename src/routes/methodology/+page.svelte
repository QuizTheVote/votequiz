<svelte:head>
  <title>Methodology - Candidate Matcher</title>
  <meta name="description" content="Scientific methodology behind the Social Value Orientation framework used in our political candidate matching algorithm.">
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <a href="/" class="text-2xl font-bold text-gray-900">🗳️ Candidate Matcher</a>
        </div>
        <nav class="flex space-x-6">
          <a href="/" class="text-gray-600 hover:text-gray-900">Demo</a>
          <a href="/newsroom" class="text-gray-600 hover:text-gray-900">For Newsrooms</a>
          <a href="/about" class="text-gray-600 hover:text-gray-900">About</a>
          <a href="/methodology" class="text-blue-600 font-medium">Methodology</a>
        </nav>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-12">
    <div class="bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Scientific Methodology</h1>
      
      <div class="prose prose-lg max-w-none">
        <h2>Social Value Orientation (SVO) Framework</h2>
        <p>
          Our candidate matching algorithm is based on Social Value Orientation research, a validated psychological 
          framework that has been studied for over four decades. Unlike surface-level political surveys, SVO measures 
          fundamental social preferences that predict behavior across diverse contexts.
        </p>

        <h2>Core SVO Dimensions</h2>
        
        <div class="grid md:grid-cols-3 gap-6 my-8">
          <div class="border rounded-lg p-4">
            <h3 class="font-semibold text-blue-600 mb-2">Prosocial</h3>
            <p class="text-sm">Maximizes collective outcomes and cooperation. Values fairness, equality, and community benefit.</p>
          </div>
          <div class="border rounded-lg p-4">
            <h3 class="font-semibold text-green-600 mb-2">Individualistic</h3>
            <p class="text-sm">Focuses on personal outcomes and self-reliance. Values independence, personal achievement, and merit-based systems.</p>
          </div>
          <div class="border rounded-lg p-4">
            <h3 class="font-semibold text-red-600 mb-2">Competitive</h3>
            <p class="text-sm">Seeks relative advantage over others. Values winning, dominance, and zero-sum thinking.</p>
          </div>
        </div>

        <h2>Question Design Principles</h2>
        <p>
          Our questions are designed as resource allocation scenarios that reveal underlying social preferences 
          without partisan political framing:
        </p>
        <ul>
          <li><strong>Value-neutral scenarios:</strong> Focus on community decisions rather than partisan issues</li>
          <li><strong>Cross-cultural validity:</strong> Questions work across different political systems</li>
          <li><strong>Behavioral prediction:</strong> Measure preferences that correlate with actual voting behavior</li>
          <li><strong>Scientific rigor:</strong> Based on peer-reviewed psychological research</li>
        </ul>

        <h2>Matching Algorithm</h2>
        <p>
          Our algorithm uses advanced mathematical approaches to calculate candidate similarity:
        </p>

        <h3>Multi-Type Question Support</h3>
        <div class="bg-gray-50 p-4 rounded-lg my-4">
          <ul class="space-y-2 text-sm">
            <li><strong>Scale Questions:</strong> Cosine similarity for ordinal responses (1-5 agreement scales)</li>
            <li><strong>Categorical Questions:</strong> Exact matching for single-choice responses</li>
            <li><strong>Multiple Choice:</strong> Jaccard similarity (intersection ÷ union) for set comparisons</li>
          </ul>
        </div>

        <h3>Weighted Topic Importance</h3>
        <p>
          Users can rank topics by importance, and the algorithm applies these weights to final similarity scores. 
          This ensures that matches reflect both value alignment and priority preferences.
        </p>

        <h3>Score Normalization</h3>
        <p>
          Raw similarity scores are transformed to percentages using research-validated functions that spread 
          results across a meaningful 20-100% range, avoiding clustered results that provide little differentiation.
        </p>

        <h2>Research Foundation</h2>
        <p>
          SVO research has been validated in hundreds of studies showing strong correlations with:
        </p>
        <ul>
          <li>Political party affiliation and voting behavior</li>
          <li>Policy preferences across economic and social issues</li>
          <li>Attitudes toward government role and regulation</li>
          <li>International relations and trade preferences</li>
        </ul>

        <h2>Advantages Over Traditional Political Quizzes</h2>
        
        <div class="overflow-x-auto my-8">
          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-300 p-3 text-left">Traditional Quizzes</th>
                <th class="border border-gray-300 p-3 text-left">SVO-Based Approach</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 p-3">Policy position matching</td>
                <td class="border border-gray-300 p-3">Fundamental value alignment</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-3">Partisan language and framing</td>
                <td class="border border-gray-300 p-3">Value-neutral scenarios</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-3">Surface-level preferences</td>
                <td class="border border-gray-300 p-3">Predictive of actual behavior</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-3">Culture-specific content</td>
                <td class="border border-gray-300 p-3">Cross-culturally valid</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Continuous Improvement</h2>
        <p>
          Our methodology continues to evolve based on user feedback and new research. We regularly review 
          question effectiveness and algorithm performance to ensure the most accurate and meaningful candidate 
          matching experience.
        </p>

        <div class="mt-12 p-6 bg-green-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">Experience the difference</h3>
          <p class="mb-4">See how SVO-based matching provides deeper insights than traditional political quizzes.</p>
          <div class="space-x-4">
            <a href="/?svo=true&demo=true" class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
              Try SVO Demo
            </a>
            <a href="/newsroom" class="border border-green-600 text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50">
              Create Your Quiz
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>