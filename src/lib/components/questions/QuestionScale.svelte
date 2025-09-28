<script lang="ts">
  import type { QuestionSVO } from '$lib/sheets';

  export let question: QuestionSVO;
  export let currentAnswer: number | string | null = null;
  export let onAnswer: (questionId: string, value: number | string) => void;

  // Define scale options based on question type
  function getScaleOptions(type: string) {
    switch (type) {
      case 'agree_5':
        return [
          { value: 5, label: 'Strongly Agree' },
          { value: 4, label: 'Somewhat Agree' },
          { value: 3, label: 'Neutral' },
          { value: 2, label: 'Somewhat Disagree' },
          { value: 1, label: 'Strongly Disagree' }
        ];
      case 'support_3':
        return [
          { value: 3, label: 'More Support' },
          { value: 2, label: 'Same Level' },
          { value: 1, label: 'Less Support' }
        ];
      default:
        return [];
    }
  }

  $: scaleOptions = getScaleOptions(question.type);
</script>

<div class="mb-10 p-6 bg-white rounded-lg shadow-md">
  <!-- Question Type Instructions -->
  <p class="text-sm text-gray-500 mb-2 italic">
    {#if question.type === 'agree_5'}
      Rate your agreement with this statement:
    {:else if question.type === 'support_3'}
      Select your level of support:
    {/if}
  </p>
  
  <h3 class="text-xl font-bold mb-4">{question.text}</h3>
  {#if question.explanation}
    <p class="text-gray-600 mb-6">{question.explanation}</p>
  {/if}
  
  <div class="flex flex-col space-y-3">
    {#each scaleOptions as option}
      <button 
        class={`p-3 rounded-lg border transition-colors ${
          currentAnswer === option.value 
            ? 'bg-blue-100 border-blue-500' 
            : 'border-gray-300 hover:bg-gray-50'
        }`}
        on:click={() => onAnswer(question.id, option.value)}
      >
        {option.label}
      </button>
    {/each}
  </div>
</div> 