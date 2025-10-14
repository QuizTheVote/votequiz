<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Topic, UserTopicWeight } from '$lib/sheets';
  
  export let topics: Topic[] = [];
  export let initialWeights: UserTopicWeight[] = [];
  
  const dispatch = createEventDispatcher<{
    change: { weights: UserTopicWeight[] }
  }>();
  
  // Initialize weights with default values if not provided
  let weights: UserTopicWeight[] = initialWeights.length > 0 
    ? [...initialWeights] 
    : topics.map((topic, index) => ({
        topicId: topic.id,
        weight: calculateWeightFromRank(index, topics.length)
      }));
  
  // Get topic name by ID for display
  function getTopicName(topicId: string): string {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : topicId;
  }
  
  // Get topic description by ID for display
  function getTopicDescription(topicId: string): string {
    const topic = topics.find(t => t.id === topicId);
    return topic?.description || '';
  }
  
  // Calculate weight based on rank position (higher rank = higher weight)
  function calculateWeightFromRank(position: number, totalItems: number): number {
    // Use a scale of 1-10 with 10 being the highest weight (first position)
    return Math.max(1, Math.round(10 - ((position / (totalItems - 1 || 1)) * 9)));
  }
  
  // Recalculate weights based on position (top = most important)
  function recalculateWeights() {
    weights = weights.map((w, i) => ({
      ...w,
      weight: calculateWeightFromRank(i, weights.length)
    }));
    
    notifyChange();
  }
  
  // Notify parent component of weight changes
  function notifyChange() {
    dispatch('change', { weights });
  }
  
  // Move item up or down (for mobile buttons)
  function moveItem(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= weights.length) return;
    
    const newWeights = [...weights];
    const [movedItem] = newWeights.splice(fromIndex, 1);
    newWeights.splice(toIndex, 0, movedItem);
    
    weights = newWeights;
    recalculateWeights();
  }
  
  // Drag and drop functionality
  let draggedItem: number | null = null;
  let draggedOverItem: number | null = null;
  
  function onDragStart(event: DragEvent, index: number) {
    draggedItem = index;
    const element = event.currentTarget as HTMLElement;
    element.classList.add('opacity-50');
    event.dataTransfer?.setData('text/plain', index.toString());
  }
  
  function onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    draggedOverItem = index;
    
    if (draggedItem === null || draggedItem === index) return;
    
    const items = document.querySelectorAll('.topic-item');
    items.forEach(item => item.classList.remove('border-blue-500'));
    
    const targetItem = event.currentTarget as HTMLElement;
    targetItem.classList.add('border-blue-500');
  }
  
  function onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    
    // Update the order
    const itemToMove = weights[draggedItem];
    const remainingItems = weights.filter((_, i) => i !== draggedItem);
    
    weights = [
      ...remainingItems.slice(0, index),
      itemToMove,
      ...remainingItems.slice(index)
    ];
    
    // Reset styles
    const items = document.querySelectorAll('.topic-item');
    items.forEach(item => item.classList.remove('border-blue-500', 'opacity-50'));
    
    recalculateWeights();
    draggedItem = null;
    draggedOverItem = null;
  }
  
  function onDragEnd(event: DragEvent) {
    draggedItem = null;
    draggedOverItem = null;
    
    // Reset styles
    const items = document.querySelectorAll('.topic-item');
    items.forEach(item => item.classList.remove('border-blue-500', 'opacity-50'));
  }
  
  function onDragLeave(event: DragEvent) {
    const targetItem = event.currentTarget as HTMLElement;
    targetItem.classList.remove('border-blue-500');
  }
  
  // Initial calculation of weights if none were provided
  $: if (initialWeights.length === 0 && topics.length > 0) {
    recalculateWeights();
  }
</script>

<div class="topic-importance-ranker">
  <h2 class="text-xl font-bold mb-3">Rank Topics By Importance</h2>
  <p class="text-gray-600 mb-4 text-sm">
    Drag topics to reorder them by importance. Topics at the top will have more influence on your results.
  </p>
  
  <div class="border border-gray-200 rounded-lg overflow-hidden">
    {#each weights as weight, index (weight.topicId)}
      <div 
        class="topic-item bg-white border-b border-gray-200 last:border-0 hover:bg-blue-50 transition-colors"
        role="listitem"
        aria-label="Topic {index + 1}: {getTopicName(weight.topicId)}"
      >
        <!-- Desktop Layout -->
        <div class="hidden sm:flex items-center px-3 py-2 relative cursor-move"
             draggable="true"
             on:dragstart={(e) => onDragStart(e, index)}
             on:dragover={(e) => onDragOver(e, index)}
             on:drop={(e) => onDrop(e, index)}
             on:dragend={onDragEnd}
             on:dragleave={onDragLeave}>
          <div class="absolute left-2 top-1/2 -translate-y-1/2 w-6 text-center text-gray-400 font-bold text-sm">
            {index + 1}
          </div>
          
          <div class="flex-grow flex justify-between items-center pl-10">
            <div class="overflow-hidden">
              <div class="font-medium text-base truncate">{getTopicName(weight.topicId)}</div>
              {#if getTopicDescription(weight.topicId)}
                <div class="text-xs text-gray-500 truncate">{getTopicDescription(weight.topicId)}</div>
              {/if}
            </div>
          </div>
          
          <!-- Desktop: Drag handle -->
          <div class="ml-2 flex-shrink-0 text-gray-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        </div>
        
        <!-- Mobile Layout - Stacked -->
        <div class="sm:hidden">
          <!-- Topic Info -->
          <div class="px-4 py-3">
            <div class="flex items-start">
              <span class="text-gray-400 font-bold text-sm mr-4 mt-0.5 w-6 text-center">{index + 1}.</span>
              <div class="flex-1">
                <div class="font-medium text-sm">{getTopicName(weight.topicId)}</div>
                {#if getTopicDescription(weight.topicId)}
                  <div class="text-xs text-gray-500 mt-1 leading-tight">{getTopicDescription(weight.topicId)}</div>
                {/if}
              </div>
            </div>
          </div>
          
          <!-- Mobile Controls - Centered below -->
          <div class="px-4 pb-3 flex justify-center space-x-4">
            <button 
              class="flex items-center px-3 py-2 bg-gray-100 rounded border text-xs font-medium {index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100 hover:text-blue-600 active:bg-blue-200'}"
              on:click={() => moveItem(index, index - 1)}
              disabled={index === 0}
            >
              <svg class="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
              Move Up
            </button>
            <button 
              class="flex items-center px-3 py-2 bg-gray-100 rounded border text-xs font-medium {index === weights.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100 hover:text-blue-600 active:bg-blue-200'}"
              on:click={() => moveItem(index, index + 1)}
              disabled={index === weights.length - 1}
            >
              <svg class="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              Move Down
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  <div class="mt-4 space-y-2">
    <!-- Mobile Instructions -->
    <div class="sm:hidden bg-gray-50 p-3 rounded-lg text-xs text-gray-700">
      <p><span class="font-semibold">Mobile:</span> Use "Move Up" and "Move Down" buttons to reorder topics.</p>
    </div>
    
    <!-- Desktop Instructions -->
    <div class="hidden sm:block bg-gray-50 p-3 rounded-lg text-xs text-gray-700">
      <p><span class="font-semibold">Desktop:</span> Drag topics to reorder them by importance.</p>
    </div>
    
    <div class="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
      <p><span class="font-semibold">How this affects your results:</span> Topics at the top (weight 10) matter more than those at the bottom (weight 1) when calculating your matches.</p>
    </div>
  </div>
</div> 