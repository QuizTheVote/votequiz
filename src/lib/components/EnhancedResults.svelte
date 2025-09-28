<script lang="ts">
  import type { Candidate } from '$lib/sheets';
  
  export let candidates: Array<Candidate & { 
    matchPercentage: number, 
    topicMatches?: { topicId: string, topicName: string, matchPercentage: number }[] 
  }>;
  export let expandedCandidateId: string | null = null;
  
  // State for showing detailed answers
  let showingAnswers: { [key: string]: boolean } = {};
  
  // Toggle topic answer details
  function toggleTopicAnswers(candidateId: string, topicId: string) {
    const key = `${candidateId}-${topicId}`;
    showingAnswers[key] = !showingAnswers[key];
  }
  
  // Placeholder functions - would need actual quiz data to implement
  function getTopicQuestions(topicId: string) {
    // This would need access to the quiz questions data
    // For now, return placeholder
    return [
      { id: 'q1', text: 'Sample question for ' + topicId },
      { id: 'q2', text: 'Another sample question for ' + topicId }
    ];
  }
  
  function getUserAnswer(questionId: string) {
    // This would need access to user's answers
    return 'Your answer here';
  }
  
  function getCandidateAnswer(candidateId: string, questionId: string) {
    // This would need access to candidate answers
    return 'Candidate answer here';
  }
  
  function toggleCandidateDetails(candidateId: string) {
    if (expandedCandidateId === candidateId) {
      expandedCandidateId = null;
    } else {
      expandedCandidateId = candidateId;
    }
  }
  
  // Helper to sort topic matches by match percentage (descending)
  function sortedTopicMatches(candidate: typeof candidates[0]) {
    if (!candidate.topicMatches) return [];
    return [...candidate.topicMatches].sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
  
  // Calculate color for match percentage
  function getMatchColor(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-green-400';
    if (percentage >= 40) return 'bg-yellow-400';
    if (percentage >= 20) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  // Handle image loading errors
  function handleImageError(event: Event, candidateName: string) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
    const fallbackElement = imgElement.nextElementSibling;
    if (fallbackElement) {
      fallbackElement.classList.remove('hidden');
    }
  }
</script>

<div class="space-y-4">
  {#each candidates as candidate}
    <div class="border rounded-lg overflow-hidden">
      <div 
        role="button"
        tabindex="0"
        class="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        on:click={() => toggleCandidateDetails(candidate.id)}
        on:keydown={(e) => e.key === 'Enter' && toggleCandidateDetails(candidate.id)}
        aria-expanded={expandedCandidateId === candidate.id}
        aria-controls={`candidate-details-${candidate.id}`}
      >
        <div class="flex items-center">
          <div class="relative w-16 h-16 mr-4">
            {#if candidate.photo}
              <img 
                src={candidate.photo} 
                alt={candidate.name}
                class="absolute w-16 h-16 rounded-full object-cover"
                on:error={(e) => handleImageError(e, candidate.name)}
                loading="lazy"
              />
              <div class="hidden absolute w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500 text-xl">{candidate.name.charAt(0)}</span>
              </div>
            {:else}
              <div class="absolute w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500 text-xl">{candidate.name.charAt(0)}</span>
              </div>
            {/if}
          </div>
          <div>
            <h3 class="text-xl font-semibold">{candidate.name}</h3>
            <p class="text-gray-600">{candidate.party}</p>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex items-center">
            <div class="flex h-7 w-16 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class={`${getMatchColor(candidate.matchPercentage)} h-full`} 
                style={`width: ${candidate.matchPercentage}%`}
              ></div>
            </div>
            <span class="ml-2 text-2xl font-bold">{candidate.matchPercentage}%</span>
          </div>
          <div class="mt-1">
            <svg 
              class={`w-6 h-6 transition-transform ${expandedCandidateId === candidate.id ? 'transform rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {#if expandedCandidateId === candidate.id}
        <div id={`candidate-details-${candidate.id}`} class="p-4 bg-gray-50 border-t">
          <!-- Basic Candidate Info -->
          <p class="mb-4">{candidate.bio}</p>
          
          <!-- Topic-specific match breakdown -->
          {#if candidate.topicMatches && candidate.topicMatches.length > 0}
            <div class="mt-6">
              <h4 class="text-lg font-semibold mb-3">Topic Matches</h4>
              <div class="space-y-3">
                {#each sortedTopicMatches(candidate) as topicMatch}
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <div class="w-1/3 font-medium">{topicMatch.topicName}</div>
                      <div class="w-2/3 flex items-center">
                        <div class="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            class={`${getMatchColor(topicMatch.matchPercentage)} h-full`} 
                            style={`width: ${topicMatch.matchPercentage}%`}
                          ></div>
                        </div>
                        <span class="ml-2 w-10 text-right font-bold">{topicMatch.matchPercentage}%</span>
                        <button 
                          class="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                          on:click={() => toggleTopicAnswers(candidate.id, topicMatch.topicId)}
                        >
                          View Answers
                        </button>
                      </div>
                    </div>
                    
                    <!-- Topic Answer Details -->
                    {#if showingAnswers[`${candidate.id}-${topicMatch.topicId}`]}
                      <div class="ml-4 p-3 bg-blue-50 rounded-lg text-sm">
                        <p class="font-medium text-blue-800 mb-2">Questions & Answers:</p>
                        {#each getTopicQuestions(topicMatch.topicId) as question}
                          <div class="mb-2 pb-2 border-b border-blue-200 last:border-b-0">
                            <p class="font-medium text-gray-700">{question.text}</p>
                            <div class="mt-1 flex items-center gap-4">
                              <span class="text-gray-600">Your answer: <strong>{getUserAnswer(question.id)}</strong></span>
                              <span class="text-blue-700">{candidate.name}: <strong>{getCandidateAnswer(candidate.id, question.id)}</strong></span>
                              <span class="text-xs">
                                {#if getUserAnswer(question.id) === getCandidateAnswer(candidate.id, question.id)}
                                  <span class="text-green-600">✓ Match</span>
                                {:else}
                                  <span class="text-red-600">✗ Different</span>
                                {/if}
                              </span>
                            </div>
                          </div>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- External links -->
          {#if candidate.website}
            <div class="mt-6">
              <a 
                href={candidate.website} 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Visit Website
                <svg class="ml-2 -mr-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div> 