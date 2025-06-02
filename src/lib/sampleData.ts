import type { QuizData } from './sheets';

/**
 * Sample data for development and testing
 * This can be used instead of fetching from Google Sheets when needed
 */
export const sampleData: QuizData = {
  candidates: [
    {
      id: 'candidate1',
      name: 'Padmé Amidala',
      party: 'Galactic Republic',
      photo: 'https://lumiere-a.akamaihd.net/v1/images/padme-amidala_05d50c8a.jpeg?region=0%2C0%2C1536%2C864',
      bio: 'Former Queen of Naboo and Senator who advocates for diplomatic solutions and democracy, with a focus on education and healthcare.',
      website: 'https://example.com/padme'
    },
    {
      id: 'candidate2',
      name: 'Sheev Palpatine',
      party: 'Imperial Order',
      photo: 'https://lumiere-a.akamaihd.net/v1/images/Emperor-Palpatine_7ac4a10e.jpeg?region=0%2C0%2C1600%2C900',
      bio: 'Former Senator and Chancellor who believes in centralized authority and strong leadership. Advocates for military spending and security.',
      website: 'https://example.com/palpatine'
    },
    {
      id: 'candidate3',
      name: 'Bail Organa',
      party: 'Alliance for Democracy',
      photo: 'https://lumiere-a.akamaihd.net/v1/images/databank_bailorgana_01_169_68aff238.jpeg?region=0%2C0%2C1560%2C878',
      bio: 'Senator from Alderaan committed to justice, equality, and protection of individual rights. Supports robust public services.',
      website: 'https://example.com/bail'
    },
    {
      id: 'candidate4',
      name: 'Nute Gunray',
      party: 'Trade Federation',
      photo: 'https://lumiere-a.akamaihd.net/v1/images/databank_nutegunray_01_169_9d66ded2.jpeg?region=0%2C0%2C1560%2C878',
      bio: 'Viceroy of the Trade Federation primarily concerned with profit, free trade, and reduced regulation of business.',
      website: 'https://example.com/nute'
    },
    {
      id: 'candidate5',
      name: 'Mon Mothma',
      party: 'Rebel Alliance',
      photo: 'https://lumiere-a.akamaihd.net/v1/images/mon-mothma_08c416c7.jpeg?region=0%2C0%2C1600%2C900',
      bio: 'Former Senator and resistance leader who balances pragmatic coalition-building with idealistic goals for a democratic galaxy.',
      website: 'https://example.com/mon'
    }
  ],
  questions: [
    {
      id: 'q1',
      text: 'The government should increase funding for public education.',
      topic: 'education',
      explanation: 'This includes K-12 schools and public universities.',
      type: 'general'
    },
    {
      id: 'q2',
      text: 'There should be stricter environmental regulations on businesses.',
      topic: 'environment',
      explanation: 'This refers to regulations on pollution, carbon emissions, and resource usage.',
      type: 'general'
    },
    {
      id: 'q3',
      text: 'The minimum wage should be increased.',
      topic: 'economy',
      explanation: 'Consider the impact on workers and businesses.',
      type: 'general'
    },
    {
      id: 'q4',
      text: 'Healthcare should be provided by the government as a public service.',
      topic: 'healthcare',
      explanation: 'This would replace or supplement private healthcare options.',
      type: 'general'
    },
    {
      id: 'q5',
      text: 'Tax rates for high-income earners should be increased.',
      topic: 'economy',
      explanation: 'Consider the balance between tax revenue and economic growth.',
      type: 'general'
    },
    {
      id: 'q6',
      text: 'Military spending should be a top budget priority.',
      topic: 'defense',
      explanation: 'This includes funding for armed forces, weapons development, and security.',
      type: 'general'
    },
    {
      id: 'q7',
      text: 'Local governments should have more authority than the central government.',
      topic: 'governance',
      explanation: 'This relates to the balance of power between different levels of government.',
      type: 'general'
    }
  ],
  candidateAnswers: [
    // Padmé Amidala's answers - Progressive-moderate
    { candidateId: 'candidate1', questionId: 'q1', value: 5 }, // Strongly agrees on education funding
    { candidateId: 'candidate1', questionId: 'q2', value: 4 }, // Mostly agrees on environmental regulations
    { candidateId: 'candidate1', questionId: 'q3', value: 4 }, // Mostly agrees on minimum wage
    { candidateId: 'candidate1', questionId: 'q4', value: 5 }, // Strongly agrees on public healthcare
    { candidateId: 'candidate1', questionId: 'q5', value: 4 }, // Mostly agrees on progressive taxation
    { candidateId: 'candidate1', questionId: 'q6', value: 2 }, // Mostly disagrees on military priority
    { candidateId: 'candidate1', questionId: 'q7', value: 3 }, // Neutral on local vs central government
    
    // Sheev Palpatine's answers - Authoritarian conservative
    { candidateId: 'candidate2', questionId: 'q1', value: 2 }, // Mostly disagrees on education funding
    { candidateId: 'candidate2', questionId: 'q2', value: 1 }, // Strongly disagrees on environmental regulations
    { candidateId: 'candidate2', questionId: 'q3', value: 1 }, // Strongly disagrees on minimum wage
    { candidateId: 'candidate2', questionId: 'q4', value: 1 }, // Strongly disagrees on public healthcare
    { candidateId: 'candidate2', questionId: 'q5', value: 1 }, // Strongly disagrees on higher taxes
    { candidateId: 'candidate2', questionId: 'q6', value: 5 }, // Strongly agrees on military priority
    { candidateId: 'candidate2', questionId: 'q7', value: 1 }, // Strongly disagrees on local government power
    
    // Bail Organa's answers - Progressive
    { candidateId: 'candidate3', questionId: 'q1', value: 5 }, // Strongly agrees on education funding
    { candidateId: 'candidate3', questionId: 'q2', value: 5 }, // Strongly agrees on environmental regulations
    { candidateId: 'candidate3', questionId: 'q3', value: 4 }, // Mostly agrees on minimum wage
    { candidateId: 'candidate3', questionId: 'q4', value: 5 }, // Strongly agrees on public healthcare
    { candidateId: 'candidate3', questionId: 'q5', value: 4 }, // Mostly agrees on progressive taxation
    { candidateId: 'candidate3', questionId: 'q6', value: 3 }, // Neutral on military priority
    { candidateId: 'candidate3', questionId: 'q7', value: 4 }, // Mostly agrees on local government power
    
    // Nute Gunray's answers - Libertarian / free market
    { candidateId: 'candidate4', questionId: 'q1', value: 1 }, // Strongly disagrees on education funding
    { candidateId: 'candidate4', questionId: 'q2', value: 1 }, // Strongly disagrees on environmental regulations
    { candidateId: 'candidate4', questionId: 'q3', value: 1 }, // Strongly disagrees on minimum wage
    { candidateId: 'candidate4', questionId: 'q4', value: 1 }, // Strongly disagrees on public healthcare
    { candidateId: 'candidate4', questionId: 'q5', value: 1 }, // Strongly disagrees on higher taxes
    { candidateId: 'candidate4', questionId: 'q6', value: 2 }, // Mostly disagrees on military priority
    { candidateId: 'candidate4', questionId: 'q7', value: 5 }, // Strongly agrees on local government power
    
    // Mon Mothma's answers - Moderate centrist with variations
    { candidateId: 'candidate5', questionId: 'q1', value: 4 }, // Mostly agrees on education funding
    { candidateId: 'candidate5', questionId: 'q2', value: 3 }, // Neutral on environmental regulations
    { candidateId: 'candidate5', questionId: 'q3', value: 3 }, // Neutral on minimum wage
    { candidateId: 'candidate5', questionId: 'q4', value: 2 }, // Mostly disagrees on public healthcare
    { candidateId: 'candidate5', questionId: 'q5', value: 2 }, // Mostly disagrees on higher taxes
    { candidateId: 'candidate5', questionId: 'q6', value: 3 }, // Neutral on military priority
    { candidateId: 'candidate5', questionId: 'q7', value: 4 }  // Mostly agrees on local government power
  ],
  topics: [
    {
      id: 'education',
      name: 'Education',
      description: 'Policies related to schools, universities, and education funding',
      category: 'general'
    },
    {
      id: 'environment',
      name: 'Environment',
      description: 'Climate change, pollution, conservation, and sustainability',
      category: 'general'
    },
    {
      id: 'economy',
      name: 'Economy',
      description: 'Jobs, taxes, wages, and economic policy',
      category: 'general'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Health insurance, medical care, and public health',
      category: 'general'
    },
    {
      id: 'defense',
      name: 'Defense & Security',
      description: 'Military spending, national defense, and security policy',
      category: 'general'
    },
    {
      id: 'governance',
      name: 'Government Structure',
      description: 'Balance of power between local and central authorities',
      category: 'general'
    }
  ],
  topicImportance: [
    // Padmé Amidala's priorities
    { candidateId: 'candidate1', topicId: 'education', weight: 10 },
    { candidateId: 'candidate1', topicId: 'healthcare', weight: 9 },
    { candidateId: 'candidate1', topicId: 'environment', weight: 7 },
    { candidateId: 'candidate1', topicId: 'economy', weight: 6 },
    { candidateId: 'candidate1', topicId: 'governance', weight: 5 },
    { candidateId: 'candidate1', topicId: 'defense', weight: 3 },
    
    // Sheev Palpatine's priorities
    { candidateId: 'candidate2', topicId: 'defense', weight: 10 },
    { candidateId: 'candidate2', topicId: 'governance', weight: 9 },
    { candidateId: 'candidate2', topicId: 'economy', weight: 6 },
    { candidateId: 'candidate2', topicId: 'education', weight: 4 },
    { candidateId: 'candidate2', topicId: 'healthcare', weight: 3 },
    { candidateId: 'candidate2', topicId: 'environment', weight: 1 },
    
    // Bail Organa's priorities
    { candidateId: 'candidate3', topicId: 'healthcare', weight: 10 },
    { candidateId: 'candidate3', topicId: 'education', weight: 9 },
    { candidateId: 'candidate3', topicId: 'environment', weight: 8 },
    { candidateId: 'candidate3', topicId: 'governance', weight: 7 },
    { candidateId: 'candidate3', topicId: 'economy', weight: 6 },
    { candidateId: 'candidate3', topicId: 'defense', weight: 3 },
    
    // Nute Gunray's priorities
    { candidateId: 'candidate4', topicId: 'economy', weight: 10 },
    { candidateId: 'candidate4', topicId: 'governance', weight: 8 },
    { candidateId: 'candidate4', topicId: 'defense', weight: 5 },
    { candidateId: 'candidate4', topicId: 'healthcare', weight: 3 },
    { candidateId: 'candidate4', topicId: 'education', weight: 2 },
    { candidateId: 'candidate4', topicId: 'environment', weight: 1 },
    
    // Mon Mothma's priorities
    { candidateId: 'candidate5', topicId: 'governance', weight: 10 },
    { candidateId: 'candidate5', topicId: 'education', weight: 8 },
    { candidateId: 'candidate5', topicId: 'economy', weight: 7 },
    { candidateId: 'candidate5', topicId: 'healthcare', weight: 6 },
    { candidateId: 'candidate5', topicId: 'environment', weight: 5 },
    { candidateId: 'candidate5', topicId: 'defense', weight: 4 }
  ]
};

/**
 * Helper function to use sample data for development instead of fetching from Google Sheets
 */
export function getSampleData(): Promise<QuizData> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(sampleData);
    }, 1000);
  });
} 