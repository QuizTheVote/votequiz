<script lang="ts">
  import type { QuestionSVO } from '$lib/sheets';

  export let question: QuestionSVO;
  export let currentAnswer: number | string | null = null;
  export let onAnswer: (questionId: string, value: number | string) => void;

  // Convert current answer to array of selected options
  $: selectedOptions = currentAnswer 
    ? (typeof currentAnswer === 'string' ? currentAnswer.split(',').map(s => s.trim()) : [])
    : [];

  // For multiple choice questions, we use the options array from the question
  $: choiceOptions = question.options || [];

  // Track selections locally without submitting
  let localSelectedOptions: string[] = selectedOptions;

  function toggleOption(option: string) {
    if (localSelectedOptions?.includes(option)) {
      // Remove option
      localSelectedOptions = localSelectedOptions?.filter(o => o !== option) || [];
    } else {
      // Add option
      localSelectedOptions = [...(localSelectedOptions || []), option];
    }
  }

  function submitAnswer() {
    // Convert to comma-separated string and submit
    const answerValue = (localSelectedOptions?.length || 0) > 0 ? localSelectedOptions?.join(',') || '' : '';
    onAnswer(question.id, answerValue);
  }

  function isOptionSelected(option: string): boolean {
    return localSelectedOptions?.includes(option) || false;
  }
</script>

<div class="mb-10 p-6 bg-white rounded-lg shadow-md">
  <!-- Question Type Instructions -->
  <p class="text-sm text-gray-500 mb-2 italic">
    Select all that apply, then click Continue:
  </p>
  
  <h3 class="text-base sm:text-xl font-bold mb-4">{question.text}</h3>
  {#if question.explanation}
    <p class="text-gray-600 mb-6">{question.explanation}</p>
  {/if}
  
  <div class="flex flex-col space-y-3">
    {#each choiceOptions as option, index}
      <button 
        class={`p-2 sm:p-3 rounded-lg border transition-colors text-left text-xs sm:text-base flex items-center ${
          isOptionSelected(option)
            ? 'bg-blue-100 border-blue-500' 
            : 'border-gray-300 hover:bg-gray-50'
        }`}
        on:click={() => toggleOption(option)}
      >
        <div class="flex items-center">
          <span class="inline-block w-6 h-6 border-2 mr-3 flex-shrink-0 flex items-center justify-center text-xs font-semibold
            {isOptionSelected(option) ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'}">
            {isOptionSelected(option) ? '✓' : ''}
          </span>
          <span class="flex-1">{option}</span>
        </div>
      </button>
    {/each}
  </div>

  {#if localSelectedOptions?.length > 0}
    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
      <p class="text-sm text-blue-700">
        Selected: {localSelectedOptions?.join(', ') || ''}
      </p>
    </div>
  {/if}

  <!-- Submit Button -->
  <div class="mt-6 flex justify-end">
    <button 
      class={`px-6 py-3 rounded-lg font-semibold transition-colors ${
        (localSelectedOptions?.length || 0) > 0 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
      on:click={submitAnswer}
      disabled={(localSelectedOptions?.length || 0) === 0}
    >
      Continue
    </button>
  </div>
</div> 