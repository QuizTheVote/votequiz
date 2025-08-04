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

  function toggleOption(option: string) {
    let newSelection;
    if (selectedOptions.includes(option)) {
      // Remove option
      newSelection = selectedOptions.filter(o => o !== option);
    } else {
      // Add option
      newSelection = [...selectedOptions, option];
    }
    
    // Convert back to comma-separated string
    const answerValue = newSelection.length > 0 ? newSelection.join(',') : '';
    onAnswer(question.id, answerValue);
  }

  function isOptionSelected(option: string): boolean {
    return selectedOptions.includes(option);
  }
</script>

<div class="mb-10 p-6 bg-white rounded-lg shadow-md">
  <h3 class="text-xl font-bold mb-4">{question.text}</h3>
  {#if question.explanation}
    <p class="text-gray-600 mb-6">{question.explanation}</p>
  {/if}
  
  <p class="text-sm text-gray-500 mb-4 italic">Select all that apply</p>
  
  <div class="flex flex-col space-y-3">
    {#each choiceOptions as option, index}
      <button 
        class={`p-3 rounded-lg border transition-colors text-left ${
          isOptionSelected(option)
            ? 'bg-blue-100 border-blue-500' 
            : 'border-gray-300 hover:bg-gray-50'
        }`}
        on:click={() => toggleOption(option)}
      >
        <div class="flex items-start">
          <span class="inline-block w-6 h-6 border-2 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center text-xs font-semibold
            {isOptionSelected(option) ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'}">
            {isOptionSelected(option) ? '✓' : ''}
          </span>
          <span class="flex-1">{option}</span>
        </div>
      </button>
    {/each}
  </div>

  {#if selectedOptions.length > 0}
    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
      <p class="text-sm text-blue-700">
        Selected: {selectedOptions.join(', ')}
      </p>
    </div>
  {/if}
</div> 