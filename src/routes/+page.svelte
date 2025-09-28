<script lang="ts">
  import { onMount } from 'svelte';
  import type { QuizData, QuizDataSVO, Question, QuestionSVO, Candidate, UserTopicWeight } from '$lib/sheets';
  import { fetchSheetData, fetchSheetDataSVO } from '$lib/sheets';
  import { calculateMatches, calculateWeightedMatches, calculateSVOMatches, calculateWeightedSVOMatches, type UserAnswer, type UserAnswerSVO } from '$lib/scorer';
  import { getSampleData } from '$lib/sampleData';
  import { getSampleDataSVO } from '$lib/sampleDataSVO';
  import TopicImportanceRanker from '$lib/components/TopicImportanceRanker.svelte';
  import EnhancedResults from '$lib/components/EnhancedResults.svelte';
  import QuestionRenderer from '$lib/components/questions/QuestionRenderer.svelte';

  // Configuration variables - now determined by URL parameters
  let sheetId: string | null = null;
  let useSampleData = false;
  let useSVOMode = false;
  
  // Support both old and new data structures
  let quizData: QuizData | QuizDataSVO | null = null;
  let currentQuestionIndex = -1; // -1 for welcome screen, questions.length for topic ranking, questions.length + 1 for results
  let userAnswers: UserAnswer[] | UserAnswerSVO[] = [];
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
      // Read URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      sheetId = urlParams.get('sheet');
      useSampleData = urlParams.get('demo') === 'true' || !sheetId;
      useSVOMode = urlParams.get('svo') === 'true';
      
      if (useSampleData) {
        // Use sample data for development or when no sheet ID provided
        if (useSVOMode) {
          quizData = await getSampleDataSVO();
        } else {
          quizData = await getSampleData();
        }
        loading = false;
        return;
      }
      
      if (!sheetId) {
        error = 'No Google Sheet ID provided. Add ?sheet=YOUR_SHEET_ID to the URL, ?demo=true for sample data, or ?svo=true&demo=true for SVO demo.';
        loading = false;
        return;
      }
      
      // Use appropriate parsing function based on mode
      if (useSVOMode) {
        quizData = await fetchSheetDataSVO(sheetId);
      } else {
        quizData = await fetchSheetData(sheetId);
      }
      loading = false;
    } catch (err) {
      console.error('Error fetching data:', err);
      error = 'Failed to load quiz data. Please check that your Google Sheet is properly set up and published to the web.';
      loading = false;
    }
  });

  function startQuiz() {
    // In SVO mode, skip to first active question
    if (useSVOMode) {
      const svoData = quizData as QuizDataSVO;
      const firstActiveIndex = svoData?.questions.findIndex(q => q.active) ?? 0;
      currentQuestionIndex = firstActiveIndex >= 0 ? firstActiveIndex : 0;
    } else {
      currentQuestionIndex = 0;
    }
  }

  function answerQuestion(questionId: string, value: number | string) {
    // Save user's answer
    const existingAnswerIndex = userAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      userAnswers[existingAnswerIndex].value = value;
    } else {
      userAnswers = [...userAnswers, { questionId, value }];
    }
    
    // Move to next question
    if (useSVOMode) {
      // In SVO mode, only navigate through active questions
      const svoData = quizData as QuizDataSVO;
      const currentActiveIndex = svoData?.questions.filter(q => q.active).findIndex(q => q.id === questionId) ?? -1;
      const totalActiveQuestions = svoData?.questions.filter(q => q.active).length ?? 0;
      
      if (currentActiveIndex < totalActiveQuestions - 1) {
        // Find next active question
        const allQuestions = svoData?.questions ?? [];
        const nextActiveQuestion = allQuestions.filter(q => q.active)[currentActiveIndex + 1];
        const nextIndex = allQuestions.findIndex(q => q.id === nextActiveQuestion?.id);
        currentQuestionIndex = nextIndex >= 0 ? nextIndex : currentQuestionIndex + 1;
      } else {
        // Go to topic importance ranking screen
        currentQuestionIndex = (quizData?.questions.length || 0);
      }
    } else {
      // Regular mode: navigate through all questions
      if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
        currentQuestionIndex++;
      } else {
        // Go to topic importance ranking screen
        currentQuestionIndex = quizData?.questions.length || 0;
      }
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
    // Calculate matches with appropriate scoring function based on mode
    if (quizData) {
      if (useSVOMode) {
        // Use SVO scoring functions
        const svoQuizData = quizData as QuizDataSVO;
        const svoUserAnswers = userAnswers as UserAnswerSVO[];
        
        if (svoQuizData.topics && svoQuizData.topics.length > 0 && userTopicWeights.length > 0) {
          candidateMatches = calculateWeightedSVOMatches(
            svoUserAnswers,
            userTopicWeights,
            svoQuizData.candidateAnswers,
            svoQuizData.candidates,
            svoQuizData.questions,
            svoQuizData.topics
          );
        } else {
          candidateMatches = calculateSVOMatches(
            svoUserAnswers,
            svoQuizData.candidateAnswers,
            svoQuizData.candidates,
            svoQuizData.questions
          );
        }
      } else {
        // Use original scoring functions
        const regularQuizData = quizData as QuizData;
        const regularUserAnswers = userAnswers as UserAnswer[];
        
        if (regularQuizData.topics && regularQuizData.topics.length > 0 && userTopicWeights.length > 0) {
          candidateMatches = calculateWeightedMatches(
            regularUserAnswers,
            userTopicWeights,
            regularQuizData.candidateAnswers,
            regularQuizData.candidates,
            regularQuizData.questions,
            regularQuizData.topics
          );
        } else {
          candidateMatches = calculateMatches(
            regularUserAnswers,
            regularQuizData.candidateAnswers,
            regularQuizData.candidates,
            regularQuizData.questions
          );
        }
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
  
  // Type-safe access to SVO questions
  $: currentSVOQuestion = (useSVOMode && currentQuestion) ? currentQuestion as QuestionSVO : null;
  $: activeQuestions = useSVOMode 
    ? (quizData as QuizDataSVO)?.questions.filter(q => q.active) || []
    : quizData?.questions || [];
  
  // Initialize topic weights when topics first become available
  $: if (quizData?.topics && quizData.topics.length > 0 && userTopicWeights.length === 0) {
    userTopicWeights = quizData.topics.map(topic => ({
      topicId: topic.id,
      weight: 5 // Default medium importance
    }));
  }
</script>

<main class="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-3xl">
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
    
    {#if devMode && !useSampleData}
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
          <p class="font-medium mb-2">Developer Mode Active</p>
          <p class="mb-2">
            Current: {useSVOMode ? 'SVO Framework Demo' : 'Traditional Quiz Demo'}
          </p>
          <div class="text-xs space-y-1">
            <p>• Add <code>?sheet=YOUR_SHEET_ID</code> for real Google Sheet data</p>
            <p>• Add <code>?svo=true&demo=true</code> for SVO framework demo</p>
            <p>• Add <code>?demo=true</code> for traditional quiz demo</p>
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
      
      <EnhancedResults 
        candidates={candidateMatches} 
        bind:expandedCandidateId
        {quizData}
        {userAnswers}
      />
      
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
            style="width: {useSVOMode 
              ? (((activeQuestions.filter(q => (q as QuestionSVO).active).findIndex(q => q.id === currentQuestion?.id) + 1) / ((activeQuestions.filter(q => (q as QuestionSVO).active).length || 1) + 2)) * 100)
              : (((currentQuestionIndex + 1) / ((quizData?.questions.length || 1) + 2)) * 100)
            }%"
          ></div>
        </div>
        <p class="text-right text-sm mt-1">
          Step 1 of 3: Question {useSVOMode 
            ? (activeQuestions.filter(q => (q as QuestionSVO).active).findIndex(q => q.id === currentQuestion?.id) + 1)
            : (currentQuestionIndex + 1)
          } of {useSVOMode 
            ? activeQuestions.filter(q => (q as QuestionSVO).active).length
            : quizData?.questions.length
          }
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
      
      {#if useSVOMode && currentSVOQuestion}
        <!-- SVO Mode: Use dynamic question renderer -->
        <QuestionRenderer 
          question={currentSVOQuestion}
          {currentAnswer}
          onAnswer={answerQuestion}
        />
      {:else if currentQuestion}
        <!-- Regular Mode: Use hardcoded 5-point scale -->
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
      {/if}
    </div>
  {/if}
</main>

<style>
  :global(body) {
    @apply bg-gray-50;
  }
</style>
