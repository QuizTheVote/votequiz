<script lang="ts">
  import { onMount } from 'svelte';
  import type { QuizData, Question, Candidate, UserTopicWeight } from '$lib/sheets';
  import { fetchSheetData } from '$lib/sheets';
  import { calculateMatches, calculateWeightedMatches, type UserAnswer } from '$lib/scorer';
  import { getSampleData } from '$lib/sampleData';
  import TopicImportanceRanker from '$lib/components/TopicImportanceRanker.svelte';
  import EnhancedResults from '$lib/components/EnhancedResults.svelte';

  // Demo Sheet ID - replace with your actual Google Sheet ID
  const SHEET_ID = '1ayBgqVYpBirba1Scg8zgYlrmk4K61HrxgvrsYJO7G7Y';
  
  // Set to true to use sample data instead of fetching from Google Sheets
  const USE_SAMPLE_DATA = true;
  
  let quizData: QuizData | null = null;
  let currentQuestionIndex = -1; // -1 for welcome screen, questions.length for topic ranking, questions.length + 1 for results
  let userAnswers: UserAnswer[] = [];
  let userTopicWeights: UserTopicWeight[] = [];
  let candidateMatches: Array<Candidate & { 
    matchPercentage: number,
    topicMatches?: { topicId: string, topicName: string, matchPercentage: number }[] 
  }> = [];
  let loading = true;
  let error: string | null = null;
  let expandedCandidateId: string | null = null;
  let devMode = import.meta.env.DEV;

  onMount(async () => {
    try {
      if (USE_SAMPLE_DATA) {
        // Use sample data for development
        quizData = await getSampleData();
        loading = false;
        return;
      }
      
      // Check if we're using the example sheet ID
      if (SHEET_ID === '1ayBgqVYpBirba1Scg8zgYlrmk4K61HrxgvrsYJO7G7Y' && false) {
        error = 'Please replace the example Sheet ID with your actual Google Sheet ID';
        loading = false;
        return;
      }
      
      quizData = await fetchSheetData(SHEET_ID);
      loading = false;
    } catch (err) {
      console.error('Error fetching data:', err);
      error = 'Failed to load quiz data. Please check that your Google Sheet is properly set up and published to the web.';
      loading = false;
    }
  });

  function startQuiz() {
    currentQuestionIndex = 0;
  }

  function answerQuestion(questionId: string, value: number) {
    // Save user's answer
    const existingAnswerIndex = userAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      userAnswers[existingAnswerIndex].value = value;
    } else {
      userAnswers = [...userAnswers, { questionId, value }];
    }
    
    // Move to next question
    if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
      currentQuestionIndex++;
    } else {
      // Go to topic importance ranking screen
      currentQuestionIndex = quizData?.questions.length || 0;
    }
  }

  function goBack() {
    if (currentQuestionIndex > 0 && currentQuestionIndex < (quizData?.questions.length || 0)) {
      // Go back to previous question
      currentQuestionIndex--;
    } else if (currentQuestionIndex === 0) {
      // Go back to welcome screen
      currentQuestionIndex = -1;
    } else if (currentQuestionIndex === (quizData?.questions.length || 0)) {
      // Go back to last question from topic ranking
      currentQuestionIndex = (quizData?.questions.length || 0) - 1;
    } else if (currentQuestionIndex === (quizData?.questions.length || 0) + 1) {
      // Go back to topic ranking from results
      currentQuestionIndex = quizData?.questions.length || 0;
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
    // Calculate matches with topic importance weighting if topics are available
    if (quizData) {
      if (quizData.topics && quizData.topics.length > 0 && userTopicWeights.length > 0) {
        candidateMatches = calculateWeightedMatches(
          userAnswers,
          userTopicWeights,
          quizData.candidateAnswers,
          quizData.candidates,
          quizData.questions,
          quizData.topics
        );
      } else {
        // Fallback to basic matching if topics not available or weighted
        candidateMatches = calculateMatches(
          userAnswers,
          quizData.candidateAnswers,
          quizData.candidates,
          quizData.questions
        );
      }
    }
    
    // Show results screen
    if (quizData) {
      currentQuestionIndex = quizData.questions.length + 1;
    }
  }

  function toggleCandidateDetails(candidateId: string) {
    if (expandedCandidateId === candidateId) {
      expandedCandidateId = null;
    } else {
      expandedCandidateId = candidateId;
    }
  }

  $: currentQuestion = quizData?.questions[currentQuestionIndex];
  $: currentAnswer = currentQuestion 
    ? userAnswers.find(a => a.questionId === currentQuestion.id)?.value 
    : null;
  $: showTopicRanking = quizData && currentQuestionIndex === (quizData.questions.length || 0);
  $: showResults = quizData && currentQuestionIndex === (quizData.questions.length + 1);
  
  // Initialize topic weights when topics first become available
  $: if (quizData?.topics && quizData.topics.length > 0 && userTopicWeights.length === 0) {
    userTopicWeights = quizData.topics.map(topic => ({
      topicId: topic.id,
      weight: 5 // Default medium importance
    }));
  }
</script>

<main class="container mx-auto px-4 py-8 max-w-3xl">
  {#if loading}
    <div class="flex flex-col items-center justify-center min-h-screen">
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
    
    {#if devMode && SHEET_ID === '1ayBgqVYpBirba1Scg8zgYlrmk4K61HrxgvrsYJO7G7Y' && false}
      <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        <p class="font-bold">Developer Setup Instructions</p>
        <ol class="list-decimal ml-6 mt-2 space-y-2">
          <li>Create a Google Sheet with the following tabs: "Candidates", "Questions", "CandidateAnswers", and "Topics" (optional)</li>
          <li>In the Candidates tab, add columns: id, name, party, photo, bio, website</li>
          <li>In the Questions tab, add columns: id, text, topic, explanation</li>
          <li>In the CandidateAnswers tab, add columns: candidateId, questionId, value (1-5)</li>
          <li>In the Topics tab, add columns: id, name, description</li>
          <li>Make your sheet public: File → Share → Publish to Web</li>
          <li>Copy the Sheet ID from your URL: <code>https://docs.google.com/spreadsheets/d/<strong>YOUR_SHEET_ID_HERE</strong>/edit</code></li>
          <li>Update the SHEET_ID constant in this file with your actual ID</li>
        </ol>
        <p class="mt-4">Alternatively, you can set <code>USE_SAMPLE_DATA = true</code> to use the included sample data.</p>
      </div>
    {/if}
  {:else if currentQuestionIndex === -1}
    <!-- Welcome Screen -->
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-6">Candidate Matcher Quiz</h1>
      <p class="mb-8 text-lg">
        Find out which candidates align with your views on key issues.
        Answer a few questions to see your personalized matches.
      </p>
      <button 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
        on:click={startQuiz}
      >
        Start Quiz
      </button>
      
      {#if USE_SAMPLE_DATA && devMode}
        <div class="mt-8 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
          Using sample data for development. Set <code>USE_SAMPLE_DATA = false</code> to use real Google Sheet data.
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
      
      <div class="mb-6 flex justify-between items-center">
        <button 
          class="text-blue-500 hover:text-blue-700"
          on:click={goBack}
        >
          &larr; Back
        </button>
        <h2 class="text-2xl font-bold text-center">Topic Importance</h2>
        <button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          on:click={calculateAndShowResults}
        >
          See Results &rarr;
        </button>
      </div>
      
      <p class="mb-6 text-center">
        Which topics matter most to you? Rank or adjust the importance of each topic to get more accurate results.
      </p>
      
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
      
      <div class="mb-6 flex justify-between items-center">
        <button 
          class="text-blue-500 hover:text-blue-700"
          on:click={goBack}
        >
          &larr; Back
        </button>
        <h1 class="text-2xl font-bold text-center">Your Candidate Matches</h1>
        <button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          on:click={restartQuiz}
        >
          Restart
        </button>
      </div>
      
      <p class="mb-8 text-center">
        Based on your responses, here are your candidate matches:
      </p>
      
      <EnhancedResults 
        candidates={candidateMatches} 
        topics={quizData?.topics || []}
        bind:expandedCandidateId
      />
    </div>
  {:else if currentQuestion}
    <!-- Question Screen -->
    <div>
      <div class="mb-6">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-blue-600 h-2.5 rounded-full" 
            style="width: {((currentQuestionIndex + 1) / ((quizData?.questions.length || 1) + 2)) * 100}%"
          ></div>
        </div>
        <p class="text-right text-sm mt-1">
          Step 1 of 3: Question {currentQuestionIndex + 1} of {quizData?.questions.length}
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
      
      <div class="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4">{currentQuestion.text}</h3>
        {#if currentQuestion.explanation}
          <p class="text-gray-600 mb-6">{currentQuestion.explanation}</p>
        {/if}
        
        <div class="flex flex-col space-y-3">
          <button 
            class={`p-3 rounded-lg border ${currentAnswer === 5 ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
            on:click={() => answerQuestion(currentQuestion.id, 5)}
          >
            Strongly Agree
          </button>
          <button 
            class={`p-3 rounded-lg border ${currentAnswer === 4 ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
            on:click={() => answerQuestion(currentQuestion.id, 4)}
          >
            Somewhat Agree
          </button>
          <button 
            class={`p-3 rounded-lg border ${currentAnswer === 3 ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
            on:click={() => answerQuestion(currentQuestion.id, 3)}
          >
            Neutral
          </button>
          <button 
            class={`p-3 rounded-lg border ${currentAnswer === 2 ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
            on:click={() => answerQuestion(currentQuestion.id, 2)}
          >
            Somewhat Disagree
          </button>
          <button 
            class={`p-3 rounded-lg border ${currentAnswer === 1 ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
            on:click={() => answerQuestion(currentQuestion.id, 1)}
          >
            Strongly Disagree
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    @apply bg-gray-50;
  }
</style>
