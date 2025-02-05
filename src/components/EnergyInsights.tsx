import React from 'react';
import { BookOpen, Brain, Lightbulb, Target, Scale, Heart, Compass } from 'lucide-react';

const insights = [
  {
    title: "Energy Over Time Management",
    description: "Focus on managing your energy, not just your time. High-energy hours yield better results than pushing through low-energy periods.",
    icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
    tips: [
      "Identify your peak energy hours and organise important tasks accordingly",
      "Quality of work hours matters more than quantity",
      "Energy management leads to sustainable productivity"
    ]
  },
  {
    title: "Understanding Cognitive Biases",
    description: "Recognise how biases affect your energy perception and decision-making.",
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    tips: [
      "Notice confirmation bias in your energy patterns",
      "Challenge your assumptions about productivity",
      "Be aware of group influence on your energy levels"
    ]
  },
  {
    title: "Self-Knowledge Through Data",
    description: "Use your energy logs as a mirror for deeper self-understanding.",
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    tips: [
      "Look for patterns in your energy fluctuations",
      "Connect emotional states with energy levels",
      "Use data to challenge your self-perceptions"
    ]
  },
  {
    title: "Emotional Root Analysis",
    description: "Examine emotions to understand their impact on your energy levels.",
    icon: <Heart className="w-6 h-6 text-red-500" />,
    tips: [
      "Track emotional triggers that affect energy",
      "Notice how different emotions drain or energize you",
      "Use energy data to understand emotional patterns"
    ]
  },
  {
    title: "Personal Limits & Boundaries",
    description: "Recognize and respect your energy boundaries for sustainable performance.",
    icon: <Scale className="w-6 h-6 text-green-500" />,
    tips: [
      "Set realistic energy expectations",
      "Honor your natural rhythms",
      "Learn to say no when energy reserves are low"
    ]
  },
  {
    title: "Purpose-Driven Energy",
    description: "Align your energy investment with your core purpose and values.",
    icon: <Compass className="w-6 h-6 text-indigo-500" />,
    tips: [
      "Connect daily activities to larger goals",
      "Notice which activities feel purposeful",
      "Use purpose as an energy multiplier"
    ]
  }
];

export default function EnergyInsights() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Energy Management Insights</h2>
        <p className="text-gray-600">Deepen your understanding of personal energy management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              {insight.icon}
              <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{insight.description}</p>
            <ul className="space-y-2">
              {insight.tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Reflection Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Morning Priming Questions</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• What energy state would best serve my goals today?</li>
              <li>• How can I align my tasks with my natural energy rhythm?</li>
              <li>• What boundaries do I need to set to protect my energy?</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Evening Reflection Questions</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• What activities energized or drained me today?</li>
              <li>• How did my emotions influence my energy levels?</li>
              <li>• What patterns am I noticing in my energy management?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}