import type { QuizDataSVO } from './sheets';

/**
 * SVO-based sample data for development and testing
 * This demonstrates the new Social Value Orientation framework with mixed question types
 */
export const sampleDataSVO: QuizDataSVO = {
  candidates: [
    {
      id: 'candidate1',
      name: 'Ronald Smith',
      party: 'Reform Alliance',
      photo: 'https://lh3.googleusercontent.com/d/1vpiozHoC6UudPBAMK72mR_xF5ef2CyvS=w400',
      bio: 'Advocates for transformative change through bold progressive policies, including wealth redistribution and expanded government programs.',
      link_url: 'https://example.com/ronald',
      link_text: 'Read Our Coverage'
    },
    {
      id: 'candidate2',
      name: 'Pria Davis',
      party: 'Democratic Coalition',
      photo: 'https://lh3.googleusercontent.com/d/1FKVSWpI4R7zeexj50mrpYMTHWThAadhA=w400',
      bio: 'Supports progressive reforms with practical implementation, focusing on social justice, environmental protection, and expanded public services.',
      link_url: 'https://example.com/pria',
      link_text: 'Campaign Website'
    },
    {
      id: 'candidate3',
      name: 'Marcus Johnson',
      party: 'Centrist Coalition',
      photo: 'https://lh3.googleusercontent.com/d/1pgz3uGi4INKsuSEtqWKE3teT2iZuyMRu=w400',
      bio: 'Seeks balanced solutions that bridge partisan divides, emphasizing pragmatic approaches to complex policy challenges.',
      link_url: 'https://example.com/marcus',
      link_text: 'View Profile'
    },
    {
      id: 'candidate4',
      name: 'Linda Williams',
      party: 'Freedom Party',
      photo: 'https://lh3.googleusercontent.com/d/1rG_Io2hnu5dhTkBb9SeT-8RNovQygRYw=w400',
      bio: 'Champions individual liberty and minimal government intervention, supporting free markets and personal responsibility.',
      link_url: 'https://example.com/linda',
      link_text: 'Visit Website'
    },
    {
      id: 'candidate5',
      name: 'Carla Martinez',
      party: 'Traditional Values Party',
      photo: 'https://lh3.googleusercontent.com/d/1YJRegnhDJ0TZwLJDVypaYk6J6MQQEocJ=w400',
      bio: 'Defends traditional values and fiscal responsibility, advocating for strong defense, law and order, and limited government spending.',
      link_url: 'https://example.com/carla',
      link_text: 'Read More'
    },
    {
      id: 'candidate6',
      name: 'Ian Benson',
      party: 'Independent',
      photo: 'https://lh3.googleusercontent.com/d/1a6L3PJXc-u8tMan-uPBP2S9PT-RcEskM=w400',
      bio: 'Independent candidate focused on local issues and community engagement.',
      link_url: 'https://example.com/ian',
      link_text: 'Campaign Info'
    }
  ],
  questions: [
    // Essential Set (Priority: Essential, Active: true)
    {
      id: 'svo_q1',
      text: 'A community receives an unexpected budget surplus. How should it be used?',
      topic: 'economy',
      explanation: 'This tests how you prioritize collective vs individual benefit in resource distribution.',
      type: 'pick_1_4',
      priority: 'Essential',
      active: true,
      options: ['Distribute equally to all residents', 'Invest in projects that benefit most people', 'Reward highest taxpayers with rebates', 'Fund competitive grants for improvements']
    },
    {
      id: 'svo_q2',
      text: 'A hospital has limited resources and must prioritize patient care. What principle should guide decisions?',
      topic: 'healthcare',
      explanation: 'This reveals your orientation toward fairness, merit, and resource allocation in critical situations.',
      type: 'pick_1_4',
      priority: 'Essential',
      active: true,
      options: ['First-come, first-served', 'Greatest medical need', 'Social contribution and value', 'Ability to pay for care']
    },
    {
      id: 'svo_q3',
      text: 'When it comes to taxation, I believe in policies that prioritize...',
      topic: 'economy',
      explanation: 'This captures your fundamental approach to collective vs individual economic responsibility.',
      type: 'pick_1_3',
      priority: 'Essential',
      active: true,
      options: ['Shared prosperity and equality', 'Economic growth and opportunity', 'Individual responsibility and merit']
    },
    {
      id: 'svo_q4',
      text: 'Climate change solutions should focus on...',
      topic: 'environment',
      explanation: 'This tests whether you favor collective action, individual choice, or competitive market solutions.',
      type: 'pick_1_3',
      priority: 'Essential',
      active: true,
      options: ['Government regulations and collective action', 'Individual lifestyle changes and education', 'Market-based solutions and innovation']
    },
    {
      id: 'svo_q5',
      text: 'Education funding should be designed to...',
      topic: 'education',
      explanation: 'This reveals your values about equality of opportunity vs competitive advantage.',
      type: 'pick_1_3',
      priority: 'Essential',
      active: true,
      options: ['Ensure equal outcomes for all students', 'Provide equal opportunities with varied outcomes', 'Reward excellence and create competitive advantage']
    },

    // Additional Set (Priority: Additional, Active: false by default)
    {
      id: 'svo_q6',
      text: 'Communities should support new businesses and economic development.',
      topic: 'economy',
      explanation: 'Traditional agreement scale to test economic development attitudes.',
      type: 'agree_5',
      priority: 'Additional',
      active: false,
      options: []
    },
    {
      id: 'svo_q7',
      text: 'Should government prioritize reducing inequality or promoting individual achievement?',
      topic: 'social',
      explanation: 'Binary choice between equality and meritocracy orientations.',
      type: 'binary_choice',
      priority: 'Additional',
      active: false,
      options: ['Reducing inequality', 'Promoting individual achievement']
    },
    {
      id: 'svo_q8',
      text: 'Which of these should be the top priorities for government? (Select all that apply)',
      topic: 'government',
      explanation: 'Multiple choice to test collective vs individual vs competitive value orientations.',
      type: 'multiple_choice',
      priority: 'Additional',
      active: false,
      options: ['Ensuring equal access to services', 'Protecting individual rights', 'Promoting economic competition', 'Building community solidarity', 'Supporting personal responsibility']
    },
    {
      id: 'svo_q9',
      text: 'The government should do more to help struggling individuals and families.',
      topic: 'social',
      explanation: 'Support scale testing prosocial vs individualistic orientations.',
      type: 'support_3',
      priority: 'Additional',
      active: false,
      options: []
    },
    {
      id: 'svo_q10',
      text: 'Should communities focus more on collective goals or individual success?',
      topic: 'social',
      explanation: 'Final binary test of core SVO orientation.',
      type: 'binary_choice',
      priority: 'Additional',
      active: false,
      options: ['Collective goals', 'Individual success']
    }
  ],
  candidateAnswers: [
    // Ronald the Radical - Prosocial/Cooperative orientation
    { candidateId: 'candidate1', questionId: 'svo_q1', value: 'Distribute equally to all residents' },
    { candidateId: 'candidate1', questionId: 'svo_q2', value: 'Greatest medical need' },
    { candidateId: 'candidate1', questionId: 'svo_q3', value: 'Shared prosperity and equality' },
    { candidateId: 'candidate1', questionId: 'svo_q4', value: 'Government regulations and collective action' },
    { candidateId: 'candidate1', questionId: 'svo_q5', value: 'Ensure equal outcomes for all students' },
    { candidateId: 'candidate1', questionId: 'svo_q6', value: 3 }, // Neutral on business development
    { candidateId: 'candidate1', questionId: 'svo_q7', value: 'Reducing inequality' },
    { candidateId: 'candidate1', questionId: 'svo_q8', value: 'Ensuring equal access to services|Building community solidarity' },
    { candidateId: 'candidate1', questionId: 'svo_q9', value: 3 }, // More support
    { candidateId: 'candidate1', questionId: 'svo_q10', value: 'Collective goals' },

    // Pria the Progressive - Moderate Prosocial
    { candidateId: 'candidate2', questionId: 'svo_q1', value: 'Invest in projects that benefit most people' },
    { candidateId: 'candidate2', questionId: 'svo_q2', value: 'Greatest medical need' },
    { candidateId: 'candidate2', questionId: 'svo_q3', value: 'Shared prosperity and equality' },
    { candidateId: 'candidate2', questionId: 'svo_q4', value: 'Government regulations and collective action' },
    { candidateId: 'candidate2', questionId: 'svo_q5', value: 'Provide equal opportunities with varied outcomes' },
    { candidateId: 'candidate2', questionId: 'svo_q6', value: 4 }, // Mostly supports business development
    { candidateId: 'candidate2', questionId: 'svo_q7', value: 'Reducing inequality' },
    { candidateId: 'candidate2', questionId: 'svo_q8', value: 'Ensuring equal access to services|Protecting individual rights' },
    { candidateId: 'candidate2', questionId: 'svo_q9', value: 3 }, // More support
    { candidateId: 'candidate2', questionId: 'svo_q10', value: 'Collective goals' },

    // Marcus the Moderate - Balanced/Individualistic
    { candidateId: 'candidate3', questionId: 'svo_q1', value: 'Invest in projects that benefit most people' },
    { candidateId: 'candidate3', questionId: 'svo_q2', value: 'First-come, first-served' },
    { candidateId: 'candidate3', questionId: 'svo_q3', value: 'Economic growth and opportunity' },
    { candidateId: 'candidate3', questionId: 'svo_q4', value: 'Market-based solutions and innovation' },
    { candidateId: 'candidate3', questionId: 'svo_q5', value: 'Provide equal opportunities with varied outcomes' },
    { candidateId: 'candidate3', questionId: 'svo_q6', value: 4 }, // Supports business development
    { candidateId: 'candidate3', questionId: 'svo_q7', value: 'Promoting individual achievement' },
    { candidateId: 'candidate3', questionId: 'svo_q8', value: 'Protecting individual rights|Promoting economic competition' },
    { candidateId: 'candidate3', questionId: 'svo_q9', value: 2 }, // Same level of support
    { candidateId: 'candidate3', questionId: 'svo_q10', value: 'Individual success' },

    // Linda the Libertarian - Individualistic
    { candidateId: 'candidate4', questionId: 'svo_q1', value: 'Reward highest taxpayers with rebates' },
    { candidateId: 'candidate4', questionId: 'svo_q2', value: 'Ability to pay for care' },
    { candidateId: 'candidate4', questionId: 'svo_q3', value: 'Individual responsibility and merit' },
    { candidateId: 'candidate4', questionId: 'svo_q4', value: 'Individual lifestyle changes and education' },
    { candidateId: 'candidate4', questionId: 'svo_q5', value: 'Reward excellence and create competitive advantage' },
    { candidateId: 'candidate4', questionId: 'svo_q6', value: 5 }, // Strongly supports business development
    { candidateId: 'candidate4', questionId: 'svo_q7', value: 'Promoting individual achievement' },
    { candidateId: 'candidate4', questionId: 'svo_q8', value: 'Protecting individual rights|Supporting personal responsibility' },
    { candidateId: 'candidate4', questionId: 'svo_q9', value: 1 }, // Less support
    { candidateId: 'candidate4', questionId: 'svo_q10', value: 'Individual success' },

    // Carla the Conservative - Competitive/Hierarchical
    { candidateId: 'candidate5', questionId: 'svo_q1', value: 'Fund competitive grants for improvements' },
    { candidateId: 'candidate5', questionId: 'svo_q2', value: 'Social contribution and value' },
    { candidateId: 'candidate5', questionId: 'svo_q3', value: 'Individual responsibility and merit' },
    { candidateId: 'candidate5', questionId: 'svo_q4', value: 'Market-based solutions and innovation' },
    { candidateId: 'candidate5', questionId: 'svo_q5', value: 'Reward excellence and create competitive advantage' },
    { candidateId: 'candidate5', questionId: 'svo_q6', value: 5 }, // Strongly supports business development
    { candidateId: 'candidate5', questionId: 'svo_q7', value: 'Promoting individual achievement' },
    { candidateId: 'candidate5', questionId: 'svo_q8', value: 'Promoting economic competition|Supporting personal responsibility' },
    { candidateId: 'candidate5', questionId: 'svo_q9', value: 1 }, // Less support
    { candidateId: 'candidate5', questionId: 'svo_q10', value: 'Individual success' },

    // Incoherent Ian - Contradictory positions
    { candidateId: 'candidate6', questionId: 'svo_q1', value: 'Distribute equally to all residents' }, // Prosocial but...
    { candidateId: 'candidate6', questionId: 'svo_q2', value: 'Ability to pay for care' }, // Suddenly competitive
    { candidateId: 'candidate6', questionId: 'svo_q3', value: 'Economic growth and opportunity' }, // Moderate view
    { candidateId: 'candidate6', questionId: 'svo_q4', value: 'Government regulations and collective action' }, // Back to prosocial
    { candidateId: 'candidate6', questionId: 'svo_q5', value: 'Reward excellence and create competitive advantage' }, // Competitive again
    { candidateId: 'candidate6', questionId: 'svo_q6', value: 2 }, // Disagrees with business development despite competitive stance
    { candidateId: 'candidate6', questionId: 'svo_q7', value: 'Reducing inequality' }, // Contradicts Q5
    { candidateId: 'candidate6', questionId: 'svo_q8', value: 'Ensuring equal access to services|Promoting economic competition|Supporting personal responsibility' }, // Contradictory mix
    { candidateId: 'candidate6', questionId: 'svo_q9', value: 3 }, // More support but contradicts Q2
    { candidateId: 'candidate6', questionId: 'svo_q10', value: 'Collective goals' } // Contradicts most other answers
  ],
  topics: [
    {
      id: 'economy',
      name: 'Economy & Resources',
      description: 'How should society allocate resources and structure economic relationships?',
      category: 'general'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'How should healthcare resources be distributed and prioritized?',
      category: 'general'
    },
    {
      id: 'environment',
      name: 'Environment',
      description: 'How should environmental challenges be addressed?',
      category: 'general'
    },
    {
      id: 'education',
      name: 'Education',
      description: 'How should education be funded and organized?',
      category: 'general'
    },
    {
      id: 'social',
      name: 'Social Policy',
      description: 'How should society balance individual needs with collective goals?',
      category: 'general'
    },
    {
      id: 'government',
      name: 'Government Role',
      description: 'What should be the priorities and scope of government?',
      category: 'general'
    }
  ],
  topicImportance: [
    // Ronald the Radical's priorities - Social justice focus
    { candidateId: 'candidate1', topicId: 'social', weight: 10 },
    { candidateId: 'candidate1', topicId: 'economy', weight: 9 },
    { candidateId: 'candidate1', topicId: 'healthcare', weight: 8 },
    { candidateId: 'candidate1', topicId: 'education', weight: 7 },
    { candidateId: 'candidate1', topicId: 'environment', weight: 6 },
    { candidateId: 'candidate1', topicId: 'government', weight: 5 },

    // Pria the Progressive's priorities - Balanced progressive
    { candidateId: 'candidate2', topicId: 'healthcare', weight: 10 },
    { candidateId: 'candidate2', topicId: 'education', weight: 9 },
    { candidateId: 'candidate2', topicId: 'environment', weight: 8 },
    { candidateId: 'candidate2', topicId: 'economy', weight: 7 },
    { candidateId: 'candidate2', topicId: 'social', weight: 6 },
    { candidateId: 'candidate2', topicId: 'government', weight: 5 },

    // Marcus the Moderate's priorities - Balanced approach
    { candidateId: 'candidate3', topicId: 'economy', weight: 10 },
    { candidateId: 'candidate3', topicId: 'education', weight: 9 },
    { candidateId: 'candidate3', topicId: 'healthcare', weight: 8 },
    { candidateId: 'candidate3', topicId: 'government', weight: 7 },
    { candidateId: 'candidate3', topicId: 'environment', weight: 6 },
    { candidateId: 'candidate3', topicId: 'social', weight: 5 },

    // Linda the Libertarian's priorities - Individual liberty focus
    { candidateId: 'candidate4', topicId: 'economy', weight: 10 },
    { candidateId: 'candidate4', topicId: 'government', weight: 9 },
    { candidateId: 'candidate4', topicId: 'education', weight: 7 },
    { candidateId: 'candidate4', topicId: 'healthcare', weight: 6 },
    { candidateId: 'candidate4', topicId: 'social', weight: 4 },
    { candidateId: 'candidate4', topicId: 'environment', weight: 3 },

    // Carla the Conservative's priorities - Traditional hierarchy
    { candidateId: 'candidate5', topicId: 'government', weight: 10 },
    { candidateId: 'candidate5', topicId: 'economy', weight: 9 },
    { candidateId: 'candidate5', topicId: 'education', weight: 8 },
    { candidateId: 'candidate5', topicId: 'social', weight: 6 },
    { candidateId: 'candidate5', topicId: 'healthcare', weight: 5 },
    { candidateId: 'candidate5', topicId: 'environment', weight: 3 },

    // Incoherent Ian's priorities - Random/contradictory
    { candidateId: 'candidate6', topicId: 'social', weight: 10 }, // High on social but contradictory positions
    { candidateId: 'candidate6', topicId: 'environment', weight: 8 },
    { candidateId: 'candidate6', topicId: 'healthcare', weight: 7 },
    { candidateId: 'candidate6', topicId: 'education', weight: 5 },
    { candidateId: 'candidate6', topicId: 'economy', weight: 4 },
    { candidateId: 'candidate6', topicId: 'government', weight: 2 }
  ]
};

/**
 * Helper function to use SVO sample data for development
 */
export function getSampleDataSVO(): Promise<QuizDataSVO> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(sampleDataSVO);
    }, 1000);
  });
} 