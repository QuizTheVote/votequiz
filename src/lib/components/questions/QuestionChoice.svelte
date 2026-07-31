<script lang="ts">
  import type { QuestionSVO } from '$lib/sheets';

  export let question: QuestionSVO;
  export let currentAnswer: number | string | null = null;
  export let onAnswer: (questionId: string, value: number | string) => void;

  // For choice questions, we use the options array from the question
  $: choiceOptions = question.options || [];
</script>

<div class="mb-10 p-6 bg-white rounded-lg shadow-md">
  <!-- Question Type Instructions -->
  <p class="text-sm text-ink-500 mb-2 italic">
    {#if question.type === 'binary_choice'}
      Choose your position on this issue:
    {:else if question.type.startsWith('pick_1_')}
      Choose the option that best represents your position:
    {/if}
  </p>
  
  <h3 class="text-base sm:text-xl font-bold mb-4">{question.text}</h3>
  {#if question.explanation}
    <p class="text-ink-600 mb-6">{question.explanation}</p>
  {/if}
  
  <div class="flex flex-col space-y-3">
    {#each choiceOptions as option, index}
      <button 
        class={`p-2 sm:p-3 rounded-lg border transition-colors text-left text-xs sm:text-base flex items-center ${
          currentAnswer === option 
            ? 'bg-brand-100 border-brand-500' 
            : 'border-ink-300 hover:bg-ink-50'
        }`}
        on:click={() => onAnswer(question.id, option)}
      >
        <div class="flex items-center">
          <span class="inline-block w-6 h-6 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center text-xs font-semibold
            {currentAnswer === option ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-300'}">
            {String.fromCharCode(65 + index)}
          </span>
          <span class="flex-1">{option}</span>
        </div>
      </button>
    {/each}
  </div>
</div> 