const beatsData = [
  {
    id: '1',
    title: 'Delta',
    image: require('../img/Sleeping.jpg'),
    frequency_gap: '0.1Hz - 4Hz',
    benefits: ['Deep Sleep', 'Pain Relief', 'Healing'],
    icon: 'sleep',
    color: '#142B2E',
    bgColor: '#BCD5EB',
    subCategories: [
      {
        id: '1-1',
        title: 'Deep Sleep',
        description: 'Trigger restorative, dreamless sleep.',
        baseFreq: 100, // Low pitch soothes the mind
        beatFreq: 1.0, // 1Hz is the deepest Delta state
      },
      {
        id: '1-2',
        title: 'Pain Relief',
        description: 'Release endorphins to soothe physical pain.',
        baseFreq: 110,
        beatFreq: 2.5, // Linked to endorphin production
      },
      {
        id: '1-3',
        title: 'Body Healing',
        description: 'Boost immune system and physical repair.',
        baseFreq: 130,
        beatFreq: 3.5, // DNA repair and healing frequencies
      }
    ]
  },
  {
    id: '2',
    title: 'Theta',
    image: require('../img/mediation.jpg'),
    frequency_gap: '4Hz - 8Hz',
    benefits: ['Meditation', 'Deep Relax', 'Creativity'],
    icon: 'meditation',
    color: '#F39F80',
    bgColor: '#A7D1E0',
    subCategories: [
      {
        id: '2-1',
        title: 'Deep Meditation',
        description: 'Enter a trance-like state of calm.',
        baseFreq: 150,
        beatFreq: 4.5, // Tibetan chant range
      },
      {
        id: '2-2',
        title: 'Lucid Dreaming',
        description: 'Promote vivid imagery and REM sleep.',
        baseFreq: 180,
        beatFreq: 5.5, // Theta/Alpha border for visualization
      },
      {
        id: '2-3',
        title: 'Creativity Boost',
        description: 'Unlock subconscious ideas and flow.',
        baseFreq: 200,
        beatFreq: 7.5, // Artistic flow state
      }
    ]
  },
  {
    id: '3',
    title: 'Alpha',
    image: require('../img/mood.jpg'),
    frequency_gap: '8Hz - 13Hz',
    benefits: ['Stress Relief', 'Fast Learning', 'Positive Thinking'],
    icon: 'emoticon-happy-outline',
    color: '#F37557',
    bgColor: '#FFFFFF',
    subCategories: [
      {
        id: '3-1',
        title: 'Anxiety Reduction',
        description: 'Calm the nerves and lower cortisol.',
        baseFreq: 250,
        beatFreq: 8.0, // Low Alpha, grounding
      },
      {
        id: '3-2',
        title: 'Mood Elevation',
        description: 'Increase serotonin and positivity.',
        baseFreq: 260,
        beatFreq: 10.0, // The "Universal" relaxation frequency
      },
      {
        id: '3-3',
        title: 'Super Learning',
        description: 'Absorb new information quickly.',
        baseFreq: 280,
        beatFreq: 12.0, // High Alpha, relaxed alertness
      }
    ]
  },
  {
    id: '4',
    title: 'Beta',
    image: require('../img/styding.jpg'),
    frequency_gap: '13Hz - 30Hz',
    benefits: ['Focus Studying', 'Problem Solving', 'Focused Attention'],
    icon: 'user-graduate',
    color: '#FFC800',
    bgColor: '#FFFFFF',
    subCategories: [
      {
        id: '4-1',
        title: 'Sharp Focus',
        description: 'Laser-like attention for reading.',
        baseFreq: 300,
        beatFreq: 14.0, // Low Beta, "SMR" (Sensory Motor Rhythm)
      },
      {
        id: '4-2',
        title: 'Problem Solving',
        description: 'Enhance logic and mathematical ability.',
        baseFreq: 320,
        beatFreq: 18.0, // Mid Beta for active thinking
      },
      {
        id: '4-3',
        title: 'High Energy',
        description: 'Wake up the mind and banish fatigue.',
        baseFreq: 350,
        beatFreq: 22.0, // High Beta (use with caution for anxiety)
      }
    ]
  },
  {
    id: '5',
    title: 'Gamma',
    image: require('../img/387.jpg'),
    frequency_gap: '30Hz - Above',
    benefits: ['Super Intelligence', 'Peak Awareness', 'Increase Creativity'],
    icon: 'brain',
    color: '#23353F',
    bgColor: '#E6E6E6',
    subCategories: [
      {
        id: '5-1',
        title: 'Memory Binding',
        description: 'Connect complex ideas and memories.',
        baseFreq: 400,
        beatFreq: 40.0, // The famous 40Hz gamma response
      },
      {
        id: '5-2',
        title: 'Peak Performance',
        description: 'For elite cognitive tasks and sports.',
        baseFreq: 450,
        beatFreq: 50.0, // Hyper-focus
      },
      {
        id: '5-3',
        title: 'Insight & Zen',
        description: 'Moments of "Aha!" and spiritual insight.',
        baseFreq: 500,
        beatFreq: 60.0, // Very high frequency processing
      }
    ]
  },
];

export default beatsData;