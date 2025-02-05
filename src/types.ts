export interface EnergyLog {
  date: string;
  energyLevel: number;
  symptoms: string[];
  positiveFactors: string[];
  activities: string[];
  notes: string;
}

export interface EnergyPhase {
  name: string;
  description: string;
  duration: [number, number]; // [start, end] hours in 24h format
  energyLevel: 'low' | 'medium' | 'high';
  focus: string[];
  activities: string[];
  breaks: string[];
  social: string[];
}

export interface DailyData {
  date: string;
  logs: EnergyLog[];
}

export const ENERGY_PHASES: Record<string, EnergyPhase> = {
  morning: {
    name: 'Morning Peak',
    description: 'Natural energy peak after waking. Best for complex tasks and creative work.',
    duration: [6, 11],
    energyLevel: 'high',
    focus: [
      'Complex problem solving',
      'Creative work',
      'Important meetings',
      'Strategic planning'
    ],
    activities: [
      'Exercise',
      'Focused work session',
      'Learning new skills',
      'Important presentations'
    ],
    breaks: [
      'Morning meditation',
      'Stretching routine',
      'Quick walk',
      'Healthy breakfast break'
    ],
    social: [
      'Team check-in',
      'Collaborative planning',
      'Mentoring session',
      'Knowledge sharing'
    ]
  },
  afternoon: {
    name: 'Afternoon Transition',
    description: 'Natural dip in energy. Focus on lighter tasks and rejuvenation.',
    duration: [12, 16],
    energyLevel: 'medium',
    focus: [
      'Administrative tasks',
      'Email management',
      'Team coordination',
      'Documentation'
    ],
    activities: [
      'Light exercise',
      'Organisation tasks',
      'Review work',
      'Planning'
    ],
    breaks: [
      'Power nap (15-20 min)',
      'Mindful breathing',
      'Desk stretches',
      'Lunch away from desk'
    ],
    social: [
      'Lunch with colleagues',
      'Walking meetings',
      'Coffee break chats',
      'Team brainstorming'
    ]
  },
  evening: {
    name: 'Evening Recovery',
    description: 'Wind down period. Focus on reflection and preparation for tomorrow.',
    duration: [17, 22],
    energyLevel: 'low',
    focus: [
      'Review daily achievements',
      'Light reading',
      'Planning next day',
      'Personal development'
    ],
    activities: [
      'Gentle exercise',
      'Hobby projects',
      'Reading',
      'Journaling'
    ],
    breaks: [
      'Evening walk',
      'Relaxation exercises',
      'Screen-free time',
      'Mindful dinner'
    ],
    social: [
      'Family dinner',
      'Social calls',
      'Group hobby activities',
      'Community events'
    ]
  }
};