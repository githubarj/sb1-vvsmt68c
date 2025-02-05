import React, { useState, useEffect } from 'react';
import { Calendar, Battery, Clock, Sun, Activity, Coffee, Users, BedDouble, BarChart, BookOpen, Award } from 'lucide-react';
import type { EnergyLog, EnergyPhase } from '../types';
import { ENERGY_PHASES } from '../types';
import EnergyAnalytics from './EnergyAnalytics';
import EnergyInsights from './EnergyInsights';
import ProgressTracker from './ProgressTracker';

interface Props {
  userId: string;
}

export default function EnergyTracker({ userId }: Props) {
  const [logs, setLogs] = useState<EnergyLog[]>([]);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [positiveFactors, setPositiveFactors] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [currentPhase, setCurrentPhase] = useState<EnergyPhase>(ENERGY_PHASES.morning);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [otherDrain, setOtherDrain] = useState('');
  const [otherBoost, setOtherBoost] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    const phase = Object.values(ENERGY_PHASES).find(
      phase => hour >= phase.duration[0] && hour <= phase.duration[1]
    ) || ENERGY_PHASES.morning;

    setCurrentPhase(phase);
  }, []);

  useEffect(() => {
    const uniqueDays = new Set(
      logs.map(log => new Date(log.date).toISOString().split('T')[0])
    ).size;

    if (uniqueDays === 7 && !showCelebration) {
      setShowCelebration(true);
    }
  }, [logs]);

  const handleAddOtherDrain = () => {
    if (otherDrain.trim()) {
      setSymptoms(prev => [...prev, otherDrain.trim()]);
      setOtherDrain('');
    }
  };

  const handleAddOtherBoost = () => {
    if (otherBoost.trim()) {
      setPositiveFactors(prev => [...prev, otherBoost.trim()]);
      setOtherBoost('');
    }
  };

  const logEnergy = () => {
    const newLog: EnergyLog = {
      date: new Date().toISOString(),
      energyLevel,
      symptoms,
      positiveFactors,
      activities,
      notes
    };
    
    setLogs(prev => [...prev, newLog]);
    setEnergyLevel(5);
    setSymptoms([]);
    setPositiveFactors([]);
    setActivities([]);
    setNotes('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md text-center space-y-4 relative">
            <Award className="w-16 h-16 text-yellow-500 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-900">Congratulations! 🎉</h3>
            <p className="text-gray-600">
              You've completed 7 days of energy tracking! Your personalised energy management system is now unlocked.
            </p>
            <p className="text-sm text-gray-500">
              We'll analyse your data to provide tailored recommendations for optimising your energy levels.
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Insights
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Energy Tracking</h2>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setShowAnalytics(false);
              setShowInsights(!showInsights);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            {showInsights ? 'Hide Insights' : 'Show Insights'}
          </button>
          <button
            onClick={() => {
              setShowInsights(false);
              setShowAnalytics(!showAnalytics);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BarChart className="w-5 h-5" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
        </div>
      </div>

      {!showInsights && !showAnalytics && <ProgressTracker logs={logs} />}

      {showInsights ? (
        <EnergyInsights />
      ) : showAnalytics ? (
        <EnergyAnalytics logs={logs} />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Track Your Energy
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level
                </label>
                <div className="flex items-center gap-4">
                  <Battery className="w-5 h-5 text-red-500" />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <Battery className="w-5 h-5 text-green-500" />
                  <span className="text-lg font-semibold">{energyLevel}/10</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Drains
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    'Fatigue',
                    'Stress',
                    'Poor Sleep',
                    'Dehydration',
                    'Hunger',
                    'Screen Fatigue',
                    'Physical Tension',
                    'Mental Fog',
                    'Feeling Overwhelmed',
                    'Low Motivation'
                  ].map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => setSymptoms(prev => 
                        prev.includes(symptom) 
                          ? prev.filter(s => s !== symptom)
                          : [...prev, symptom]
                      )}
                      className={`px-4 py-2 rounded-full text-sm ${
                        symptoms.includes(symptom)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otherDrain}
                    onChange={(e) => setOtherDrain(e.target.value)}
                    placeholder="Other energy drain..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddOtherDrain}
                    disabled={!otherDrain.trim()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Boosters
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    'Good Sleep',
                    'Exercise',
                    'Healthy Meal',
                    'Meditation',
                    'Socialising',
                    'Nature Walk',
                    'Focused Work',
                    'Reading',
                    'Creative Activity',
                    'Short Break'
                  ].map((factor) => (
                    <button
                      key={factor}
                      onClick={() => setPositiveFactors(prev => 
                        prev.includes(factor) 
                          ? prev.filter(f => f !== factor)
                          : [...prev, factor]
                      )}
                      className={`px-4 py-2 rounded-full text-sm ${
                        positiveFactors.includes(factor)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {factor}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otherBoost}
                    onChange={(e) => setOtherBoost(e.target.value)}
                    placeholder="Other energy booster..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddOtherBoost}
                    disabled={!otherBoost.trim()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completed Activities
                </label>
                <div className="flex flex-wrap gap-2">
                  {[...currentPhase.activities, ...currentPhase.breaks, ...currentPhase.social].map((activity) => (
                    <button
                      key={activity}
                      onClick={() => setActivities(prev => 
                        prev.includes(activity) 
                          ? prev.filter(a => a !== activity)
                          : [...prev, activity]
                      )}
                      className={`px-4 py-2 rounded-full text-sm ${
                        activities.includes(activity)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="How are you feeling? Have you noticed any particular patterns?"
                />
              </div>

              <button
                onClick={logEnergy}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Log Current Energy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Current Phase: {currentPhase.name}
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  {currentPhase.description}
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Focus Areas
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {currentPhase.focus.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-blue-600" />
                Recommendations
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Suggested Activities
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {currentPhase.activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Coffee className="w-4 h-4" /> Recommended Breaks
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {currentPhase.breaks.map((break_, index) => (
                      <li key={index}>{break_}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Social Interactions
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {currentPhase.social.map((social, index) => (
                      <li key={index}>{social}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}