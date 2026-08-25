<script lang="ts">
  import { base } from '$app/paths';
  import SiteNav from '$lib/components/SiteNav.svelte';
</script>

<svelte:head>
  <title>Methodology - Quiz The Vote</title>
  <meta name="description" content="How Quiz The Vote scores each question and turns those scores into a candidate match percentage.">
</svelte:head>

<div class="min-h-screen bg-ink-50">
  <SiteNav current="methodology" />

  <main class="max-w-4xl mx-auto px-4 py-12">
    <div class="bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-4xl font-bold text-ink-900 mb-8">Scientific Methodology</h1>
      
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
            <h3 class="font-semibold text-brand-600 mb-2">Prosocial</h3>
            <p class="text-sm">Maximizes collective outcomes and cooperation. Values fairness, equality, and community benefit.</p>
          </div>
          <div class="border rounded-lg p-4">
            <h3 class="font-semibold text-ink-700 mb-2">Individualistic</h3>
            <p class="text-sm">Focuses on personal outcomes and self-reliance. Values independence, personal achievement, and merit-based systems.</p>
          </div>
          <div class="border rounded-lg p-4">
            <h3 class="font-semibold text-sand-700 mb-2">Competitive</h3>
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

        <h2>How the match percentage is calculated</h2>
        <p>
          Each question is scored on its own, from 0 (no match) to 1 (exact match).
          Those per-question scores are averaged. If you ranked topics, that
          average is weighted so higher-ranked topics count more. The result is
          multiplied by 100 and rounded to a whole number. That number is the
          match percentage you see. There is no extra stretching or
          “normalization” step.
        </p>
        <p>
          Only questions that both you and the candidate answered are included.
          Inactive questions are not asked and not scored.
        </p>

        <h3>By question type</h3>
        <div class="bg-ink-50 p-4 rounded-lg my-4">
          <p class="text-sm font-semibold mb-2">Five-point agreement</p>
          <p class="text-sm mb-3">
            Strongly disagree (1) through strongly agree (5). Nearby answers
            only count if they stay on the same side of neutral:
          </p>
          <ul class="space-y-1 text-sm mb-4">
            <li>Same answer: full match</li>
            <li>One step apart on the agree side (4 and 5), or on the disagree side (1 and 2): half match</li>
            <li>One step that crosses neutral (2 and 3, or 3 and 4): no match</li>
            <li>Two or more steps apart: no match</li>
          </ul>

          <p class="text-sm font-semibold mb-2">Three-point support / oppose</p>
          <p class="text-sm mb-3">
            Same answer is a full match. The only partial credit is a quarter
            match when the candidate is Support or Oppose and you chose the
            middle option. Every other combination, including opposite answers,
            is no match.
          </p>

          <p class="text-sm font-semibold mb-2">Single choice</p>
          <p class="text-sm mb-3">
            Pick-one and yes/no questions are exact: the same option is a full
            match, anything else is no match.
          </p>

          <p class="text-sm font-semibold mb-2">Multiple choice</p>
          <p class="text-sm">
            Shared selections divided by the total number of distinct selections
            either of you made (Jaccard similarity). Selecting the same set is a
            full match; overlapping sets are a partial match.
          </p>
        </div>

        <h3>Topic ranking</h3>
        <p>
          If the quiz asks you to rank topics, the list order becomes a weight
          from 10 at the top to 1 at the bottom. Each topic’s average is
          multiplied by its weight, then those weighted averages are combined.
          Topics you ranked that have no questions do not affect the score.
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
          <table class="w-full border-collapse border border-ink-300">
            <thead>
              <tr class="bg-ink-100">
                <th class="border border-ink-300 p-3 text-left">Traditional Quizzes</th>
                <th class="border border-ink-300 p-3 text-left">SVO-Based Approach</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-ink-300 p-3">Policy position matching</td>
                <td class="border border-ink-300 p-3">Fundamental value alignment</td>
              </tr>
              <tr>
                <td class="border border-ink-300 p-3">Partisan language and framing</td>
                <td class="border border-ink-300 p-3">Value-neutral scenarios</td>
              </tr>
              <tr>
                <td class="border border-ink-300 p-3">Surface-level preferences</td>
                <td class="border border-ink-300 p-3">Predictive of actual behavior</td>
              </tr>
              <tr>
                <td class="border border-ink-300 p-3">Culture-specific content</td>
                <td class="border border-ink-300 p-3">Cross-culturally valid</td>
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

        <div class="mt-12 p-6 bg-brand-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">Experience the difference</h3>
          <p class="mb-4">See how SVO-based matching provides deeper insights than traditional political quizzes.</p>
          <div class="space-x-4">
            <a href="{base}/?svo=true&demo=true" class="bg-brand-500 text-white px-6 py-2 rounded-pill font-semibold hover:bg-brand-600">
              Try SVO Demo
            </a>
            <a href="{base}/newsroom" class="border border-brand-500 text-brand-600 px-6 py-2 rounded-pill font-semibold hover:bg-brand-50">
              Create Your Quiz
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>