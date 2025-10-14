import type { QuizData } from './sheets';

/**
 * Sample data for development and testing
 * This can be used instead of fetching from Google Sheets when needed
 */
export const sampleData: QuizData = {
  candidates: [
    {
      id: 'candidate1',
      name: 'Ronald the Radical',
      party: 'Progressive Alliance',
      photo: 'https://lh3.googleusercontent.com/d/1vpiozHoC6UudPBAMK72mR_xF5ef2CyvS=w400',
      bio: 'Advocates for transformative change through bold progressive policies, including wealth redistribution and expanded government programs.',
      link_url: 'https://example.com/ronald',
      link_text: 'Visit Website'
    },
    {
      id: 'candidate2',
      name: 'Pria the Progressive',
      party: 'Democratic Coalition',
      photo: 'https://lh3.googleusercontent.com/d/1FKVSWpI4R7zeexj50mrpYMTHWThAadhA=w400',
      bio: 'Supports progressive reforms with practical implementation, focusing on social justice, environmental protection, and expanded public services.',
      link_url: 'https://example.com/pria',
      link_text: 'Visit Website'
    },
    {
      id: 'candidate3',
      name: 'Marcus the Moderate',
      party: 'Centrist Coalition',
      photo: 'https://lh3.googleusercontent.com/d/1pgz3uGi4INKsuSEtqWKE3teT2iZuyMRu=w400',
      bio: 'Seeks balanced solutions that bridge partisan divides, emphasizing pragmatic approaches to complex policy challenges.',
      link_url: 'https://example.com/marcus',
      link_text: 'Visit Website'
    },
    {
      id: 'candidate4',
      name: 'Linda the Libertarian',
      party: 'Freedom Party',
      photo: 'https://lh3.googleusercontent.com/d/1rG_Io2hnu5dhTkBb9SeT-8RNovQygRYw=w400',
      bio: 'Champions individual liberty and minimal government intervention, supporting free markets and personal responsibility.',
      link_url: 'https://example.com/linda',
      link_text: 'Visit Website'
    },
    {
      id: 'candidate5',
      name: 'Carla the Conservative',
      party: 'Traditional Values Party',
      photo: 'https://lh3.googleusercontent.com/d/1YJRegnhDJ0TZwLJDVypaYk6J6MQQEocJ=w400',
      bio: 'Defends traditional values and fiscal responsibility, advocating for strong defense, law and order, and limited government spending.',
      link_url: 'https://example.com/carla',
      link_text: 'Visit Website'
    },
    {
      id: 'candidate6',
      name: 'Incoherent Ian',
      party: 'Contradictory Coalition',
      photo: 'https://lh3.googleusercontent.com/d/1a6L3PJXc-u8tMan-uPBP2S9PT-RcEskM=w400',
      bio: 'Takes unpredictable positions across the political spectrum, somehow managing to contradict himself on most major issues.',
      link_url: 'https://example.com/ian',
      link_text: 'Visit Website'
    }
  ],
  questions: [
    {
      id: 'q1',
      text: 'The government should use rent control to address housing affordability.',
      topic: 'housing',
      explanation: 'Rent control limits how much landlords can charge tenants, aimed at keeping housing affordable.',
      type: 'general'
    },
    {
      id: 'q2',
      text: 'The state should provide vouchers for students to attend private schools.',
      topic: 'education',
      explanation: 'School voucher programs use public funds to help families pay for private school tuition.',
      type: 'general'
    },
    {
      id: 'q3',
      text: 'The best approach to homelessness is to provide housing first, then address underlying issues.',
      topic: 'homelessness',
      explanation: 'Housing First prioritizes getting people into permanent housing without preconditions like sobriety or employment.',
      type: 'general'
    },
    {
      id: 'q4',
      text: 'State and local law enforcement should cooperate with ICE to deport undocumented migrants.',
      topic: 'immigration',
      explanation: 'This involves local police working with federal immigration enforcement to identify and detain undocumented individuals.',
      type: 'general'
    },
    {
      id: 'q5',
      text: 'The state should implement a graduated income tax where wealthy people pay a higher rate.',
      topic: 'economy',
      explanation: 'Progressive taxation means tax rates increase as income levels rise, with the wealthy paying a larger percentage.',
      type: 'general'
    },
    {
      id: 'q6',
      text: 'Increasing penalties for crime is the best way to improve public safety.',
      topic: 'safety',
      explanation: 'This approach emphasizes deterrence through tougher sentences and stricter enforcement.',
      type: 'general'
    },
    {
      id: 'q7',
      text: 'There should be stricter environmental regulations on businesses.',
      topic: 'environment',
      explanation: 'This includes regulations on pollution, carbon emissions, and resource usage to protect the environment.',
      type: 'general'
    },
    {
      id: 'q8',
      text: 'Healthcare should be provided by the government as a public service.',
      topic: 'healthcare',
      explanation: 'This would create a government-run healthcare system, replacing or supplementing private insurance.',
      type: 'general'
    },
    {
      id: 'q9',
      text: 'Military spending should be a top budget priority.',
      topic: 'defense',
      explanation: 'This includes funding for armed forces, weapons development, and national security programs.',
      type: 'general'
    }
  ],
  candidateAnswers: [
    // Ronald the Radical - Far-left positions
    { candidateId: 'candidate1', questionId: 'q1', value: 5 }, // Strongly supports rent control
    { candidateId: 'candidate1', questionId: 'q2', value: 1 }, // Strongly opposes private school vouchers
    { candidateId: 'candidate1', questionId: 'q3', value: 5 }, // Strongly supports housing first
    { candidateId: 'candidate1', questionId: 'q4', value: 1 }, // Strongly opposes ICE cooperation
    { candidateId: 'candidate1', questionId: 'q5', value: 5 }, // Strongly supports progressive taxation
    { candidateId: 'candidate1', questionId: 'q6', value: 1 }, // Strongly opposes harsh penalties
    { candidateId: 'candidate1', questionId: 'q7', value: 5 }, // Strongly supports environmental regulations
    { candidateId: 'candidate1', questionId: 'q8', value: 5 }, // Strongly supports public healthcare
    { candidateId: 'candidate1', questionId: 'q9', value: 1 }, // Strongly opposes military spending priority
    
    // Pria the Progressive - Liberal positions
    { candidateId: 'candidate2', questionId: 'q1', value: 4 }, // Mostly supports rent control
    { candidateId: 'candidate2', questionId: 'q2', value: 2 }, // Mostly opposes vouchers
    { candidateId: 'candidate2', questionId: 'q3', value: 4 }, // Mostly supports housing first
    { candidateId: 'candidate2', questionId: 'q4', value: 2 }, // Mostly opposes ICE cooperation
    { candidateId: 'candidate2', questionId: 'q5', value: 4 }, // Mostly supports progressive taxation
    { candidateId: 'candidate2', questionId: 'q6', value: 2 }, // Mostly opposes harsh penalties
    { candidateId: 'candidate2', questionId: 'q7', value: 4 }, // Mostly supports environmental regulations
    { candidateId: 'candidate2', questionId: 'q8', value: 4 }, // Mostly supports public healthcare
    { candidateId: 'candidate2', questionId: 'q9', value: 2 }, // Mostly opposes military spending priority
    
    // Marcus the Moderate - Centrist positions
    { candidateId: 'candidate3', questionId: 'q1', value: 3 }, // Neutral on rent control
    { candidateId: 'candidate3', questionId: 'q2', value: 3 }, // Neutral on vouchers
    { candidateId: 'candidate3', questionId: 'q3', value: 3 }, // Neutral on housing first
    { candidateId: 'candidate3', questionId: 'q4', value: 3 }, // Neutral on ICE cooperation
    { candidateId: 'candidate3', questionId: 'q5', value: 3 }, // Neutral on progressive taxation
    { candidateId: 'candidate3', questionId: 'q6', value: 3 }, // Neutral on penalties
    { candidateId: 'candidate3', questionId: 'q7', value: 3 }, // Neutral on environmental regulations
    { candidateId: 'candidate3', questionId: 'q8', value: 3 }, // Neutral on public healthcare
    { candidateId: 'candidate3', questionId: 'q9', value: 3 }, // Neutral on military spending
    
    // Linda the Libertarian - Minimal government positions
    { candidateId: 'candidate4', questionId: 'q1', value: 1 }, // Strongly opposes rent control (market interference)
    { candidateId: 'candidate4', questionId: 'q2', value: 4 }, // Supports vouchers (school choice)
    { candidateId: 'candidate4', questionId: 'q3', value: 2 }, // Prefers private solutions to homelessness
    { candidateId: 'candidate4', questionId: 'q4', value: 2 }, // Mixed on immigration enforcement
    { candidateId: 'candidate4', questionId: 'q5', value: 1 }, // Strongly opposes progressive taxation
    { candidateId: 'candidate4', questionId: 'q6', value: 2 }, // Prefers prevention over punishment
    { candidateId: 'candidate4', questionId: 'q7', value: 1 }, // Strongly opposes business regulations
    { candidateId: 'candidate4', questionId: 'q8', value: 1 }, // Strongly opposes government healthcare
    { candidateId: 'candidate4', questionId: 'q9', value: 2 }, // Mixed on military spending
    
    // Carla the Conservative - Traditional conservative positions
    { candidateId: 'candidate5', questionId: 'q1', value: 1 }, // Strongly opposes rent control
    { candidateId: 'candidate5', questionId: 'q2', value: 5 }, // Strongly supports school vouchers
    { candidateId: 'candidate5', questionId: 'q3', value: 2 }, // Prefers work requirements approach
    { candidateId: 'candidate5', questionId: 'q4', value: 5 }, // Strongly supports ICE cooperation
    { candidateId: 'candidate5', questionId: 'q5', value: 1 }, // Strongly opposes progressive taxation
    { candidateId: 'candidate5', questionId: 'q6', value: 5 }, // Strongly supports tough penalties
    { candidateId: 'candidate5', questionId: 'q7', value: 1 }, // Strongly opposes environmental regulations
    { candidateId: 'candidate5', questionId: 'q8', value: 1 }, // Strongly opposes public healthcare
    { candidateId: 'candidate5', questionId: 'q9', value: 5 }, // Strongly supports military spending priority
    
    // Incoherent Ian - Contradictory positions
    { candidateId: 'candidate6', questionId: 'q1', value: 2 }, // Contradictory: opposes rent control but...
    { candidateId: 'candidate6', questionId: 'q2', value: 5 }, // Supports vouchers (inconsistent with q1)
    { candidateId: 'candidate6', questionId: 'q3', value: 1 }, // Opposes housing first but...
    { candidateId: 'candidate6', questionId: 'q4', value: 4 }, // Supports ICE cooperation but...
    { candidateId: 'candidate6', questionId: 'q5', value: 3 }, // Neutral on taxes (wishy-washy)
    { candidateId: 'candidate6', questionId: 'q6', value: 1 }, // Opposes penalties but supports ICE
    { candidateId: 'candidate6', questionId: 'q7', value: 5 }, // Supports environmental regs but...
    { candidateId: 'candidate6', questionId: 'q8', value: 2 }, // Opposes public healthcare (inconsistent)
    { candidateId: 'candidate6', questionId: 'q9', value: 4 }  // Supports military spending (contradicts other positions)
  ],
  topics: [
    {
      id: 'housing',
      name: 'Housing',
      description: 'Policies related to affordable housing, rent control, and housing development',
      category: 'general'
    },
    {
      id: 'education',
      name: 'Education',
      description: 'School choice, vouchers, public education funding, and educational policy',
      category: 'general'
    },
    {
      id: 'homelessness',
      name: 'Homelessness',
      description: 'Approaches to addressing homelessness and housing insecurity',
      category: 'general'
    },
    {
      id: 'immigration',
      name: 'Immigration',
      description: 'Immigration enforcement, documentation, and integration policies',
      category: 'general'
    },
    {
      id: 'economy',
      name: 'Economy & Taxes',
      description: 'Taxation policy, income distribution, and economic regulation',
      category: 'general'
    },
    {
      id: 'safety',
      name: 'Public Safety',
      description: 'Crime prevention, criminal justice, and law enforcement policy',
      category: 'general'
    },
    {
      id: 'environment',
      name: 'Environment',
      description: 'Climate change, pollution, conservation, and environmental regulation',
      category: 'general'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Health insurance, medical care, and public health policy',
      category: 'general'
    },
    {
      id: 'defense',
      name: 'Defense & Security',
      description: 'Military spending, national defense, and security policy',
      category: 'general'
    }
  ],
  topicImportance: [
    // Ronald the Radical's priorities - Social justice focus
    { candidateId: 'candidate1', topicId: 'housing', weight: 10 },
    { candidateId: 'candidate1', topicId: 'healthcare', weight: 9 },
    { candidateId: 'candidate1', topicId: 'economy', weight: 8 },
    { candidateId: 'candidate1', topicId: 'environment', weight: 7 },
    { candidateId: 'candidate1', topicId: 'homelessness', weight: 6 },
    { candidateId: 'candidate1', topicId: 'education', weight: 5 },
    { candidateId: 'candidate1', topicId: 'immigration', weight: 4 },
    { candidateId: 'candidate1', topicId: 'safety', weight: 3 },
    { candidateId: 'candidate1', topicId: 'defense', weight: 1 },
    
    // Pria the Progressive's priorities - Balanced progressive
    { candidateId: 'candidate2', topicId: 'healthcare', weight: 10 },
    { candidateId: 'candidate2', topicId: 'education', weight: 9 },
    { candidateId: 'candidate2', topicId: 'environment', weight: 8 },
    { candidateId: 'candidate2', topicId: 'economy', weight: 7 },
    { candidateId: 'candidate2', topicId: 'housing', weight: 6 },
    { candidateId: 'candidate2', topicId: 'immigration', weight: 5 },
    { candidateId: 'candidate2', topicId: 'homelessness', weight: 4 },
    { candidateId: 'candidate2', topicId: 'safety', weight: 3 },
    { candidateId: 'candidate2', topicId: 'defense', weight: 2 },
    
    // Marcus the Moderate's priorities - Balanced approach
    { candidateId: 'candidate3', topicId: 'economy', weight: 10 },
    { candidateId: 'candidate3', topicId: 'education', weight: 9 },
    { candidateId: 'candidate3', topicId: 'healthcare', weight: 8 },
    { candidateId: 'candidate3', topicId: 'safety', weight: 7 },
    { candidateId: 'candidate3', topicId: 'housing', weight: 6 },
    { candidateId: 'candidate3', topicId: 'defense', weight: 5 },
    { candidateId: 'candidate3', topicId: 'environment', weight: 4 },
    { candidateId: 'candidate3', topicId: 'immigration', weight: 3 },
    { candidateId: 'candidate3', topicId: 'homelessness', weight: 2 },
    
    // Linda the Libertarian's priorities - Individual liberty focus
    { candidateId: 'candidate4', topicId: 'economy', weight: 10 },
    { candidateId: 'candidate4', topicId: 'education', weight: 8 },
    { candidateId: 'candidate4', topicId: 'housing', weight: 6 },
    { candidateId: 'candidate4', topicId: 'healthcare', weight: 5 },
    { candidateId: 'candidate4', topicId: 'immigration', weight: 4 },
    { candidateId: 'candidate4', topicId: 'safety', weight: 3 },
    { candidateId: 'candidate4', topicId: 'defense', weight: 2 },
    { candidateId: 'candidate4', topicId: 'homelessness', weight: 2 },
    { candidateId: 'candidate4', topicId: 'environment', weight: 1 },
    
    // Carla the Conservative's priorities - Traditional values
    { candidateId: 'candidate5', topicId: 'defense', weight: 10 },
    { candidateId: 'candidate5', topicId: 'safety', weight: 9 },
    { candidateId: 'candidate5', topicId: 'immigration', weight: 8 },
    { candidateId: 'candidate5', topicId: 'economy', weight: 7 },
    { candidateId: 'candidate5', topicId: 'education', weight: 6 },
    { candidateId: 'candidate5', topicId: 'housing', weight: 4 },
    { candidateId: 'candidate5', topicId: 'healthcare', weight: 3 },
    { candidateId: 'candidate5', topicId: 'homelessness', weight: 2 },
    { candidateId: 'candidate5', topicId: 'environment', weight: 1 },
    
    // Incoherent Ian's priorities - Random/contradictory
    { candidateId: 'candidate6', topicId: 'homelessness', weight: 10 }, // Surprisingly cares about homelessness
    { candidateId: 'candidate6', topicId: 'defense', weight: 8 }, // But also military spending
    { candidateId: 'candidate6', topicId: 'environment', weight: 7 }, // And environment
    { candidateId: 'candidate6', topicId: 'housing', weight: 3 }, // But not housing (inconsistent)
    { candidateId: 'candidate6', topicId: 'education', weight: 5 }, // Medium on education
    { candidateId: 'candidate6', topicId: 'economy', weight: 2 }, // Low on economy
    { candidateId: 'candidate6', topicId: 'healthcare', weight: 6 }, // Medium-high on healthcare
    { candidateId: 'candidate6', topicId: 'immigration', weight: 4 }, // Medium on immigration
    { candidateId: 'candidate6', topicId: 'safety', weight: 1 } // Low on safety (contradicts his answers)
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