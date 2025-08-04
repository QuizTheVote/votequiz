<script lang="ts">
  import { onMount } from 'svelte';
  
  let sheetUrl = '';
  let embedCode = '';
  let previewUrl = '';
  let showPreview = false;
  let step = 1; // Track which step user is on
  
  // Extract sheet ID from various Google Sheets URL formats
  function extractSheetId(url: string): string | null {
    const patterns = [
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
      /spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
      /docs\.google\.com.*[?&]id=([a-zA-Z0-9-_]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }
  
  // Generate embed code when user enters sheet URL
  function generateEmbedCode() {
    if (!sheetUrl.trim()) return;
    
    const sheetId = extractSheetId(sheetUrl);
    if (!sheetId) {
      alert('Please enter a valid Google Sheets URL');
      return;
    }
    
    // Generate the embed URL
    const baseUrl = window.location.origin + window.location.pathname.replace('/newsroom', '');
    previewUrl = `${baseUrl}?sheet=${sheetId}&svo=true`;
    
    // Generate iframe embed code
    embedCode = `<iframe src="${previewUrl}" width="100%" height="600" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`;
    
    showPreview = true;
    step = 3;
  }
  
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }
  
  function copyTemplate() {
    // For now, open the template in a new tab
    // TODO: Implement Google Sheets API to actually copy the sheet
    window.open('https://docs.google.com/spreadsheets/d/1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE/copy', '_blank');
    step = 2;
  }
</script>

<svelte:head>
  <title>Candidate Matcher for Newsrooms - Easy Political Quiz Tool</title>
  <meta name="description" content="Create scientifically-grounded political candidate matching quizzes for your newsroom. No coding required - just copy our template and embed.">
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <!-- Header -->
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">🗳️ Candidate Matcher</h1>
          <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">For Newsrooms</span>
        </div>
        <nav class="flex space-x-6">
          <a href="/" class="text-gray-600 hover:text-gray-900">Demo</a>
          <a href="/about" class="text-gray-600 hover:text-gray-900">About</a>
          <a href="/methodology" class="text-gray-600 hover:text-gray-900">Methodology</a>
        </nav>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        Political Quizzes Made Simple
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Create scientifically-grounded candidate matching quizzes for your newsroom. 
        Based on 40+ years of Social Value Orientation research, not surface-level policy questions.
      </p>
      <div class="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
        <h3 class="text-lg font-semibold mb-4">Why Choose Our Platform?</h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-start space-x-2">
            <span class="text-green-500">✓</span>
            <span>Psychology-based questions</span>
          </div>
          <div class="flex items-start space-x-2">
            <span class="text-green-500">✓</span>
            <span>No coding required</span>
          </div>
          <div class="flex items-start space-x-2">
            <span class="text-green-500">✓</span>
            <span>Easy Google Sheets setup</span>
          </div>
          <div class="flex items-start space-x-2">
            <span class="text-green-500">✓</span>
            <span>Instant embed code</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Process Steps -->
    <div class="space-y-12">
      <!-- Step 1: Copy Template -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="flex items-center mb-6">
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">1</div>
          <h2 class="text-2xl font-bold">Copy Our Template</h2>
          {#if step >= 2}
            <span class="ml-4 text-green-500">✓ Complete</span>
          {/if}
        </div>
        
        <p class="text-gray-600 mb-6">
          Start with our pre-built Google Sheet template containing scientifically-designed SVO questions 
          and sample political candidates. You can customize questions and add your local candidates.
        </p>
        
        <div class="bg-blue-50 rounded-lg p-6 mb-6">
          <h4 class="font-semibold mb-3">Template includes:</h4>
          <ul class="space-y-2 text-sm">
            <li>• 5 Essential SVO questions (2-3 minute quiz)</li>
            <li>• 5 Additional questions for deeper analysis</li>
            <li>• 6 sample political candidates with diverse positions</li>
            <li>• Active/Priority columns for easy customization</li>
            <li>• Multiple question types (scales, choices, multiple choice)</li>
          </ul>
        </div>
        
        <button 
          on:click={copyTemplate}
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
        >
          📋 Copy Template to Your Google Drive
        </button>
      </div>

      <!-- Step 2: Customize & Publish -->
      <div class="bg-white rounded-xl shadow-lg p-8" class:opacity-50={step < 2}>
        <div class="flex items-center mb-6">
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">2</div>
          <h2 class="text-2xl font-bold">Customize & Publish Your Sheet</h2>
          {#if step >= 3}
            <span class="ml-4 text-green-500">✓ Complete</span>
          {/if}
        </div>
        
        <div class="space-y-4 text-gray-600">
          <p><strong>Customize your quiz:</strong></p>
          <ul class="list-disc list-inside space-y-1 ml-4">
            <li>Replace sample candidates with your local candidates</li>
            <li>Fill in candidate positions for each question</li>
            <li>Enable/disable questions using the "Active" column</li>
            <li>Modify question text to fit your election context</li>
          </ul>
          
          <p><strong>Publish to web:</strong></p>
          <ol class="list-decimal list-inside space-y-1 ml-4">
            <li>In Google Sheets: File → Share → Publish to web</li>
            <li>Select "Entire Document" and click "Publish"</li>
            <li>Copy the sheet URL from your browser</li>
          </ol>
        </div>
      </div>

      <!-- Step 3: Generate Embed Code -->
      <div class="bg-white rounded-xl shadow-lg p-8" class:opacity-50={step < 2}>
        <div class="flex items-center mb-6">
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">3</div>
          <h2 class="text-2xl font-bold">Generate Your Embed Code</h2>
        </div>
        
        <p class="text-gray-600 mb-6">
          Paste your published Google Sheet URL below to generate the embed code for your website.
        </p>
        
        <div class="space-y-4">
          <div>
            <label for="sheet-url" class="block text-sm font-medium text-gray-700 mb-2">
              Google Sheet URL (after publishing to web)
            </label>
            <input 
              id="sheet-url"
              type="url" 
              bind:value={sheetUrl}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button 
            on:click={generateEmbedCode}
            disabled={!sheetUrl.trim()}
            class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            🚀 Generate Embed Code
          </button>
        </div>
      </div>

      <!-- Step 4: Embed Results -->
      {#if showPreview}
        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="flex items-center mb-6">
            <div class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">✓</div>
            <h2 class="text-2xl font-bold">Your Quiz is Ready!</h2>
          </div>
          
          <!-- Direct Link -->
          <div class="mb-6">
            <h3 class="font-semibold mb-2">Direct Link:</h3>
            <div class="flex items-center space-x-2">
              <input 
                type="text" 
                value={previewUrl}
                readonly
                class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm"
              />
              <button 
                on:click={() => copyToClipboard(previewUrl)}
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Copy
              </button>
              <a 
                href={previewUrl} 
                target="_blank"
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Test
              </a>
            </div>
          </div>
          
          <!-- Embed Code -->
          <div class="mb-6">
            <h3 class="font-semibold mb-2">Embed Code for Your Website:</h3>
            <div class="flex items-start space-x-2">
              <textarea 
                value={embedCode}
                readonly
                rows="3"
                class="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm font-mono"
              ></textarea>
              <button 
                on:click={() => copyToClipboard(embedCode)}
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Copy
              </button>
            </div>
          </div>
          
          <!-- Live Preview -->
          <div>
            <h3 class="font-semibold mb-2">Live Preview:</h3>
            <div class="border rounded-lg overflow-hidden">
              <iframe 
                src={previewUrl} 
                width="100%" 
                height="600" 
                frameborder="0"
                title="Quiz Preview"
                class="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Footer CTA -->
    <div class="text-center mt-16 p-8 bg-blue-600 text-white rounded-xl">
      <h2 class="text-2xl font-bold mb-4">Questions? Need Help?</h2>
      <p class="mb-6">We're here to help you create engaging political content for your audience.</p>
      <div class="space-x-4">
        <a href="/methodology" class="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
          Learn About Our Methodology
        </a>
        <a href="/?svo=true&demo=true" class="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
          Try the Demo
        </a>
      </div>
    </div>
  </main>
</div>

<style>
  .opacity-50 {
    opacity: 0.5;
  }
</style>