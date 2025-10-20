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

  // Use custom labels from Option columns if provided, otherwise use defaults
  $: scaleOptions = (() => {
    // Check if custom options are provided
    if (question.options && question.options.length > 0) {
      if (question.type === 'agree_5' && question.options.length >= 5) {
        // Map Option1-5 to values 5-1 (Option1 = Strongly Agree = 5)
        return [
          { value: 5, label: question.options[0] },
          { value: 4, label: question.options[1] },
          { value: 3, label: question.options[2] },
          { value: 2, label: question.options[3] },
          { value: 1, label: question.options[4] }
        ];
      }
      if (question.type === 'support_3' && question.options.length >= 3) {
        // Map Option1-3 to values 3-1 (Option1 = More Support = 3)
        return [
          { value: 3, label: question.options[0] },
          { value: 2, label: question.options[1] },
          { value: 1, label: question.options[2] }
        ];
      }
    }
    // Fall back to standard labels
    return getScaleOptions(question.type);
  })();
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
  
  <h3 class="text-base sm:text-xl font-bold mb-4">{question.text}</h3>
  {#if question.explanation}
    <p class="text-gray-600 mb-6">{question.explanation}</p>
  {/if}
  
  <div class="flex flex-col space-y-3">
    {#each scaleOptions as option}
      <button 
        class={`p-2 sm:p-3 rounded-lg border transition-colors text-xs sm:text-base flex items-center justify-center ${
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