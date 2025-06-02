<script lang="ts">
  // No script logic needed for this static page
</script>

<div class="container mx-auto px-4 py-8 max-w-3xl">
  <h1 class="text-3xl font-bold mb-6">How We Match You to Candidates</h1>
  
  <div class="prose max-w-none">
    <h2 class="text-2xl font-semibold mt-8 mb-4">Our Methodology</h2>
    
    <p>
      The Election Quiz is designed to match you with candidates based on how closely your views align with theirs on key issues.
      Here's how it works:
    </p>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">1. Question Selection</h3>
    <p>
      Our editorial team carefully selects questions that represent important issues in this election. 
      We strive to present these questions in a neutral way that doesn't favor any particular candidate or ideology.
      Each question is reviewed by multiple team members to ensure neutrality.
    </p>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">2. Candidate Positions</h3>
    <p>
      We determine each candidate's position by:
    </p>
    <ul class="list-disc ml-8 mb-4">
      <li>Reviewing their official campaign statements</li>
      <li>Examining their voting records (if applicable)</li>
      <li>Analyzing their public speeches and debate responses</li>
      <li>Considering position papers published on their websites</li>
    </ul>
    <p>
      Each candidate is assigned a value from 1 (strongly disagree) to 5 (strongly agree) for each question.
      When candidates have unclear or mixed positions, we make our best assessment based on available information.
    </p>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">3. Matching Algorithm</h3>
    <p>
      When you complete the quiz, we use a mathematical technique called "cosine similarity" to compare your answers to each candidate's positions:
    </p>
    
    <ol class="list-decimal ml-8 mb-4">
      <li>Your responses create a vector of numbers (your position on each issue)</li>
      <li>Each candidate has their own vector of positions</li>
      <li>The algorithm calculates how similar these vectors are</li>
      <li>Results are converted to percentages (100% = perfect match)</li>
    </ol>
    
    <p>
      This approach measures the "angle" between your pattern of responses and each candidate's pattern, rather than just counting how many times you agree. This means:
    </p>
    <ul class="list-disc ml-8 mb-4">
      <li>Issues where you have strong opinions (choosing 1 or 5) are weighted more heavily than issues where your opinion is moderate</li>
      <li>The overall pattern of your responses matters more than agreement on any single issue</li>
    </ul>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">4. Privacy</h3>
    <p>
      Your responses remain on your device and are not stored on any server. We do not track individual users or share your data with any third parties.
    </p>
    
    <h2 class="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
    <p>
      While we strive for accuracy, this quiz has some inherent limitations:
    </p>
    <ul class="list-disc ml-8 mb-4">
      <li>It cannot capture every nuance of a candidate's position</li>
      <li>Candidates may change their positions over time</li>
      <li>The quiz covers major issues but cannot include every policy area</li>
      <li>The match percentages are a starting point for your research, not a voting recommendation</li>
    </ul>
    
    <h2 class="text-2xl font-semibold mt-8 mb-4">Transparency</h2>
    <p>
      The quiz is open-source under an MIT license. You can review the code, including the matching algorithm, on 
      <a href="https://github.com/your-org/election-quiz" class="text-blue-600 hover:underline">GitHub</a>.
    </p>
    
    <div class="mt-8 border-t pt-4">
      <a href="/" class="text-blue-600 hover:underline">&larr; Back to Quiz</a>
    </div>
  </div>
</div> 