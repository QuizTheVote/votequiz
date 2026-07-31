<script lang="ts">
  import { onMount } from 'svelte';
  import type { QuizDataSVO, QuestionSVO, Candidate, UserTopicWeight, SheetDiagnostic } from '$lib/sheets';
  import { fetchSheetDataSVO } from '$lib/sheets';
  import { calculateSVOMatches, calculateWeightedSVOMatches, type UserAnswerSVO } from '$lib/scorer';
  import { getSampleDataSVO } from '$lib/sampleDataSVO';
  import TopicImportanceRanker from '$lib/components/TopicImportanceRanker.svelte';
  import EnhancedResults from '$lib/components/EnhancedResults.svelte';
  import QuestionRenderer from '$lib/components/questions/QuestionRenderer.svelte';

  // Configuration variables - now determined by URL parameters
  let sheetId: string | null = null;
  let useSampleData = false;
  let showDiagnostics = false;

  let quizData: QuizDataSVO | null = null;
  let currentQuestionIndex = -1; // -1 for welcome screen, questions.length for topic ranking, questions.length + 1 for results
  let userAnswers: UserAnswerSVO[] = [];
  let userTopicWeights: UserTopicWeight[] = [];
  let candidateMatches: Array<Candidate & { 
    matchPercentage: number,
    topicMatches?: { topicId: string, topicName: string, matchPercentage: number }[],
    participationRate?: number,
    answeredQuestions?: number,
    totalQuestions?: number
  }> = [];
  
  // Separate participating and non-participating candidates.
  // Only the SVO scorers report a participation rate. When it is absent we have
  // no evidence a candidate failed to respond, so they belong in the main list.
  $: participatingCandidates = candidateMatches.filter(
    c => c.participationRate === undefined || c.participationRate >= 0.5
  );
  $: nonParticipatingCandidates = candidateMatches.filter(
    c => c.participationRate !== undefined && c.participationRate < 0.5
  );
  
  // Problems found in the spreadsheet. Errors mean the results are wrong, so
  // they are shown to everyone; notices only to whoever is setting the quiz up.
  $: diagnostics = quizData?.diagnostics ?? [];
  $: sheetErrors = diagnostics.filter((d: SheetDiagnostic) => d.severity === 'error');
  $: visibleDiagnostics = showDiagnostics ? diagnostics : sheetErrors;

  let loading = true;
  let error: string | null = null;
  let expandedCandidateId: string | null = null;
  let devMode = import.meta.env.DEV;

  onMount(async () => {
    try {
      // Read URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      sheetId = urlParams.get('sheet');
      useSampleData = urlParams.get('demo') === 'true' || !sheetId;
      // Sheet problems are shown to everyone when they corrupt results. The rest
      // are advisory and only worth surfacing to whoever is setting the quiz up.
      showDiagnostics = urlParams.get('debug') === 'true' || import.meta.env.DEV;

      // The svo parameter is accepted but no longer meaningful: the SVO
      // structure is the only one there is. Existing embeds all pass it.
      quizData = useSampleData ? await getSampleDataSVO() : await fetchSheetDataSVO(sheetId);
      loading = false;
    } catch (err) {
      console.error('Error fetching data:', err);
      error = 'Failed to load quiz data. Please check that your Google Sheet is properly set up and published to the web.';
      loading = false;
    }
  });

  function startQuiz() {
    // Start with the first active question (index 0 in activeQuestions array)
    currentQuestionIndex = 0;
  }

  function answerQuestion(questionId: string, value: number | string) {
    // Save user's answer
    const existingAnswerIndex = userAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      userAnswers[existingAnswerIndex].value = value;
    } else {
      userAnswers = [...userAnswers, { questionId, value }];
    }
    
    if (currentQuestionIndex < activeQuestions.length - 1) {
      currentQuestionIndex++;
    } else {
      // Go to topic importance ranking screen
      currentQuestionIndex = activeQuestions.length;
    }
  }

  function goBack() {
    if (currentQuestionIndex > 0 && currentQuestionIndex < activeQuestions.length) {
      // Go back to previous active question
      currentQuestionIndex--;
    } else if (currentQuestionIndex === 0) {
      // Go back to welcome screen
      currentQuestionIndex = -1;
    } else if (currentQuestionIndex === activeQuestions.length) {
      // Go back to last active question from topic ranking
      currentQuestionIndex = Math.max(0, activeQuestions.length - 1);
    } else if (currentQuestionIndex === activeQuestions.length + 1) {
      // Go back to topic ranking from results
      currentQuestionIndex = activeQuestions.length;
    }
  }

  function restartQuiz() {
    userAnswers = [];
    userTopicWeights = [];
    candidateMatches = [];
    currentQuestionIndex = -1;
  }

  function handleTopicWeightsChange(event: CustomEvent<{weights: UserTopicWeight[]}>) {
    userTopicWeights = event.detail.weights;
  }

  function calculateAndShowResults() {
    if (quizData) {
      const hasTopicRanking =
        quizData.topics && quizData.topics.length > 0 && userTopicWeights.length > 0;

      candidateMatches = hasTopicRanking
        ? calculateWeightedSVOMatches(
            userAnswers,
            userTopicWeights,
            quizData.candidateAnswers,
            quizData.candidates,
            quizData.questions,
            quizData.topics
          )
        : calculateSVOMatches(
            userAnswers,
            quizData.candidateAnswers,
            quizData.candidates,
            quizData.questions
          );
    }
    
    // Show results screen. Must be indexed off activeQuestions to match the
    // showResults guard below, or inactive questions leave this unrenderable.
    if (quizData) {
      currentQuestionIndex = activeQuestions.length + 1;
    }
  }

  function toggleCandidateDetails(candidateId: string) {
    if (expandedCandidateId === candidateId) {
      expandedCandidateId = null;
    } else {
      expandedCandidateId = candidateId;
    }
  }

  function handleImageError(event: Event) {
    const img = event.currentTarget as HTMLImageElement;
    img.style.display = 'none';
    const fallback = img.nextElementSibling;
    if (fallback instanceof HTMLElement) {
      fallback.classList.remove('hidden');
    }
  }

  // Only active questions are asked. Every step index below counts these, never
  // the full list, or the results step becomes unreachable.
  $: activeQuestions = quizData?.questions.filter(q => q.active) ?? [];

  $: currentQuestion = activeQuestions[currentQuestionIndex];
  $: currentAnswer = currentQuestion 
    ? userAnswers.find(a => a.questionId === currentQuestion.id)?.value 
    : null;
  $: showTopicRanking = quizData && currentQuestionIndex === activeQuestions.length;
  $: showResults = quizData && currentQuestionIndex === activeQuestions.length + 1;
  
  $: currentSVOQuestion = (currentQuestion as QuestionSVO) ?? null;
  
  // Initialize topic weights when topics first become available
  $: if (quizData?.topics && quizData.topics.length > 0 && userTopicWeights.length === 0) {
    userTopicWeights = quizData.topics.map(topic => ({
      topicId: topic.id,
      weight: 5 // Default medium importance
    }));
  }
</script>

<main class="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-3xl">
  {#if visibleDiagnostics.length > 0}
    <!-- Deliberately visible to voters when severity is error: a misconfigured
         sheet otherwise produces a plausible-looking but incorrect quiz. -->
    <div class="mb-6 rounded border border-amber-400 bg-amber-50 px-4 py-3 text-amber-900">
      <p class="font-bold">
        {sheetErrors.length > 0
          ? 'This quiz has a spreadsheet problem that affects its results'
          : 'Spreadsheet advisories'}
      </p>
      <ul class="mt-2 ml-5 list-disc space-y-1 text-sm">
        {#each visibleDiagnostics as diagnostic}
          <li>{diagnostic.message}</li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if loading}
    <div class="flex flex-col items-center justify-center py-20">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Loading Quiz...</h1>
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      <p class="font-bold">Error</p>
      <p>{error}</p>
    </div>
    
    {#if !useSampleData}
      <div class="bg-blue-50 border border-blue-300 text-blue-900 px-4 py-3 rounded">
        <p class="font-bold">Checklist for setting up a sheet</p>
        <ol class="list-decimal ml-6 mt-2 space-y-2">
          <li>Start from the Quiz The Vote base template rather than a blank sheet.</li>
          <li><strong>Quiz_Data</strong> tab: one row per question, with columns Question, Topic, Type, Priority, Active, Option1 to Option5, and one column per candidate whose header is exactly that candidate's name.</li>
          <li><strong>Candidates</strong> tab: id, name, party, photo, bio, link_url, link_text.</li>
          <li><strong>Topics</strong> tab: id, name, description. Every id must be used by at least one question.</li>
          <li>Share the sheet so anyone with the link can view it.</li>
          <li>Use the ID from the address bar, the part between <code>/d/</code> and <code>/edit</code>, not the "Publish to web" URL.</li>
        </ol>
      </div>
    {/if}
  {:else if currentQuestionIndex === -1}
    <!-- Welcome Screen -->
    <div class="text-center">
      <p class="mb-8 text-base sm:text-lg text-gray-700">
        Discover which candidates align with your values and priorities.
        Answer questions to see your personalized matches.
      </p>
      
      <button 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-base sm:text-lg"
        on:click={startQuiz}
      >
        Start Quiz
      </button>
      
      {#if useSampleData && devMode}
        <div class="mt-8 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
          <p class="font-medium mb-2">Sample data</p>
          <div class="text-xs space-y-1">
            <p>• Add <code>?sheet=YOUR_SHEET_ID</code> to load a real Google Sheet</p>
            <p>• Add <code>?debug=true</code> to see sheet advisories as well as errors</p>
          </div>
        </div>
      {/if}
    </div>
  {:else if showTopicRanking && quizData?.topics && quizData.topics.length > 0}
    <!-- Topic Importance Ranking Screen -->
    <div>
      <div class="mb-6">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-blue-600 h-2.5 rounded-full" 
            style="width: 90%"
          ></div>
        </div>
        <p class="text-right text-sm mt-1">
          Step 2 of 3: Rank Topics
        </p>
      </div>
      
      <!-- Mobile-First Header -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <button 
            class="text-blue-500 hover:text-blue-700 text-sm sm:text-base"
            on:click={goBack}
          >
            &larr; Back
          </button>
          <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded text-sm sm:text-base"
            on:click={calculateAndShowResults}
          >
            <span class="hidden sm:inline">See Results &rarr;</span>
            <span class="sm:hidden">Results &rarr;</span>
          </button>
        </div>
        
        <div class="text-center">
          <h2 class="text-lg sm:text-2xl font-bold mb-3">Rank Topics</h2>
          <p class="text-sm sm:text-base text-gray-600">
            Which topics matter most to you? Rank them to get more accurate results.
          </p>
        </div>
      </div>
      
      <TopicImportanceRanker 
        topics={quizData.topics} 
        initialWeights={userTopicWeights}
        on:change={handleTopicWeightsChange}
      />
    </div>
  {:else if showResults}
    <!-- Enhanced Results Screen -->
    <div>
      <div class="mb-6">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-blue-600 h-2.5 rounded-full" 
            style="width: 100%"
          ></div>
        </div>
        <p class="text-right text-sm mt-1">
          Step 3 of 3: Results
        </p>
      </div>
      
      <div class="mb-8 flex justify-between items-center">
        <button 
          class="text-blue-500 hover:text-blue-700 text-sm sm:text-base"
          on:click={goBack}
        >
          &larr; Back
        </button>
        <button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded text-sm sm:text-base"
          on:click={restartQuiz}
        >
          Restart
        </button>
      </div>
      
      <!-- Participating Candidates -->
      {#if participatingCandidates.length > 0}
        <EnhancedResults 
          candidates={participatingCandidates} 
          bind:expandedCandidateId
          {quizData}
          {userAnswers}
        />
      {/if}
      
      <!-- Non-Participating Candidates -->
      {#if nonParticipatingCandidates.length > 0}
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h2 class="text-lg font-semibold mb-4 text-gray-700">Additional Candidates</h2>
          <p class="text-sm text-gray-600 mb-4">These candidates did not provide sufficient responses for matching.</p>
          
          <div class="space-y-3">
            {#each nonParticipatingCandidates as candidate}
              <div class="border rounded-lg p-4 bg-gray-50">
                <div class="flex items-center">
                  <div class="relative w-12 h-12 mr-3">
                    {#if candidate.photo}
                      <img 
                        src={candidate.photo} 
                        alt={candidate.name}
                        class="absolute w-12 h-12 rounded-full object-cover"
                        on:error={handleImageError}
                        loading="lazy"
                      />
                      <div class="hidden absolute w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-500 text-sm">{candidate.name.charAt(0)}</span>
                      </div>
                    {:else}
                      <div class="absolute w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-500 text-sm">{candidate.name.charAt(0)}</span>
                      </div>
                    {/if}
                  </div>
                  <div class="flex-1">
                    <h3 class="text-base font-semibold">{candidate.name}</h3>
                    <p class="text-sm text-gray-600">{candidate.party}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      {#if (candidate.answeredQuestions || 0) === 0}
                        Did not respond to survey
                      {:else}
                        Responded to {candidate.answeredQuestions} of {candidate.totalQuestions} questions
                      {/if}
                    </p>
                  </div>
                  {#if candidate.link_url}
                    <a 
                      href={candidate.link_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      class="ml-3 text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      {candidate.link_text || 'Visit Website'}
                    </a>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Attribution -->
      <div class="text-center mt-8 pt-6 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          Powered by <a href="https://www.quizthevote.com" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium">QuizTheVote</a>
        </p>
      </div>
    </div>
  {:else if currentQuestion}
    <!-- Question Screen -->
    <div>
      <div class="mb-6">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-blue-600 h-2.5 rounded-full" 
            style="width: {((currentQuestionIndex + 1) / (activeQuestions.length + 2)) * 100}%"
          ></div>
        </div>
        <p class="text-right text-sm mt-1">
          Step 1 of 3: Question {currentQuestionIndex + 1} of {activeQuestions.length}
        </p>
      </div>
      
      <div class="mb-6 flex justify-between items-center">
        <button 
          class="text-blue-500 hover:text-blue-700"
          on:click={goBack}
        >
          &larr; Back
        </button>
        <h2 class="text-xl font-medium text-center">
          {#if currentQuestion.topic && quizData?.topics}
            {#if quizData.topics.find(t => t.id === currentQuestion.topic)}
              <span class="text-sm font-normal text-blue-600">
                {quizData.topics.find(t => t.id === currentQuestion.topic)?.name}
              </span>
            {/if}
          {/if}
        </h2>
        <div class="w-16"></div> <!-- Spacer to maintain centering -->
      </div>
      
      {#if currentSVOQuestion}
        <QuestionRenderer 
          question={currentSVOQuestion}
          {currentAnswer}
          onAnswer={answerQuestion}
        />
      {/if}
    </div>
  {/if}
</main>

<style>
  :global(body) {
    @apply bg-gray-50;
  }
</style>
