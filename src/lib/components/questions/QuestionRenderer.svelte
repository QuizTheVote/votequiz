<script lang="ts">
  import type { QuestionSVO } from '$lib/sheets';
  import QuestionScale from './QuestionScale.svelte';
  import QuestionChoice from './QuestionChoice.svelte';
  import QuestionMultiple from './QuestionMultiple.svelte';

  export let question: QuestionSVO;
  export let currentAnswer: number | string | null = null;
  export let onAnswer: (questionId: string, value: number | string) => void;

  // Determine which component to use based on question type
  function getQuestionComponent(type: string) {
    switch (type) {
      case 'agree_5':
      case 'support_3':
        return QuestionScale;
      case 'pick_1_3':
      case 'pick_1_4':
      case 'pick_1_5':
      case 'binary_choice':
        return QuestionChoice;
      case 'multiple_choice':
        return QuestionMultiple;
      default:
        return QuestionScale; // Fallback to scale
    }
  }

  $: QuestionComponent = getQuestionComponent(question.type);
</script>

<svelte:component 
  this={QuestionComponent} 
  {question} 
  {currentAnswer} 
  {onAnswer} 
/> 