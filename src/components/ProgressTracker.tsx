import React, { useState } from 'react';
import { Calendar, Trophy, Star, Gift, Flame, Award, Battery, ChevronRight, Target, Zap, Crown, Brain, Heart, Sunrise, Moon, Sun } from 'lucide-react';
import type { EnergyLog } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressTrackerProps {
  logs: EnergyLog[];
}

export default function ProgressTracker({ logs }: ProgressTrackerProps) {
  const [showMilestones, setShowMilestones] = useState(false);
  
  const uniqueDays = new Set(
    logs.map(log => new Date(log.date).toISOString().split('T')[0])
  ).size;

  const daysRemaining = 7 - uniqueDays;
  const progress = (uniqueDays / 7) * 100;
  const hasUnlockedMilestones = uniqueDays >= 7;
  
  // Calculate streaks
  const calculateStreak = () => {
    if (logs.length === 0) return 0;
    
    const sortedDates = logs
      .map(log => new Date(log.date).toISOString().split('T')[0])
      .sort()
      .reverse();
    
    let streak = 1;
    const today = new Date().toISOString().split('T')[0];
    let lastDate = sortedDates[0];
    
    // If no log today, streak is broken
    if (lastDate !== today) return 0;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(lastDate);
      currentDate.setDate(currentDate.getDate() - 1);
      const expectedDate = currentDate.toISOString().split('T')[0];
      
      if (sortedDates[i] === expectedDate) {
        streak++;
        lastDate = sortedDates[i];
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  
  // Calculate energy points (tokens)
  const totalPoints = logs.reduce((acc, log) => {
    // Base points for logging
    let points = 10;
    
    // Streak bonus
    if (currentStreak > 1) points += currentStreak * 2;
    
    // Bonus for detailed logging
    if (log.notes) points += 2;
    if (log.activities.length > 0) points += 3;
    if (log.positiveFactors.length > 0) points += 3;
    
    // Consistency bonus
    const logTime = new Date(log.date).getHours();
    const previousLogs = logs.filter(l => 
      new Date(l.date).getHours() === logTime
    ).length;
    if (previousLogs > 1) points += 5; // Bonus for consistent timing
    
    return acc + points;
  }, 0);

  // Calculate battery level (0-100)
  const batteryLevel = Math.min(100, Math.round((logs.length / 30) * 100));

  // Determine user's preferred time period
  const determinePreferredTimePeriod = () => {
    if (logs.length === 0) return null;

    const timeDistribution = logs.reduce((acc: Record<string, number>, log) => {
      const hour = new Date(log.date).getHours();
      if (hour >= 5 && hour < 12) acc.morning = (acc.morning || 0) + 1;
      else if (hour >= 12 && hour < 17) acc.afternoon = (acc.afternoon || 0) + 1;
      else acc.evening = (acc.evening || 0) + 1;
      return acc;
    }, {});

    return Object.entries(timeDistribution)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'morning';
  };

  const preferredPeriod = determinePreferredTimePeriod();

  // Calculate achievement progress with personalized timing
  const calculateAchievements = () => {
    const getTimeRange = () => {
      switch (preferredPeriod) {
        case 'morning': return [5, 11];
        case 'afternoon': return [12, 16];
        case 'evening': return [17, 23];
        default: return [5, 11];
      }
    };

    const [startHour, endHour] = getTimeRange();

    const achievements = {
      peakPerformer: logs.filter(log => {
        const hour = new Date(log.date).getHours();
        return hour >= startHour && hour <= endHour && log.energyLevel >= 7;
      }).length >= 5,
      energyAlchemist: logs.filter(log => log.energyLevel >= 8).length >= 10,
      balanceSeeker: logs.filter(log => 
        log.activities.some(a => a.includes('Break')) && 
        log.activities.some(a => a.includes('Work'))
      ).length >= 7,
      consistentLogger: currentStreak >= 14,
      insightful: logs.filter(log => log.notes.length > 50).length >= 5,
      mindfulObserver: logs.filter(log => 
        log.positiveFactors.length >= 3 && 
        log.symptoms.length >= 2
      ).length >= 5
    };
    
    return achievements;
  };

  const achievements = calculateAchievements();

  // Helper function to get period-specific content
  const getPeriodContent = () => {
    switch (preferredPeriod) {
      case 'morning':
        return {
          icon: <Sunrise className="w-4 h-4 text-purple-500" />,
          title: 'Morning Peak Performer',
          description: 'Maintain high energy (7+) during morning hours for 5 days'
        };
      case 'afternoon':
        return {
          icon: <Sun className="w-4 h-4 text-purple-500" />,
          title: 'Afternoon Achiever',
          description: 'Maintain high energy (7+) during afternoon hours for 5 days'
        };
      case 'evening':
        return {
          icon: <Moon className="w-4 h-4 text-purple-500" />,
          title: 'Evening Excellence',
          description: 'Maintain high energy (7+) during evening hours for 5 days'
        };
      default:
        return {
          icon: <Sunrise className="w-4 h-4 text-purple-500" />,
          title: 'Peak Performer',
          description: 'Maintain high energy (7+) during your preferred hours for 5 days'
        };
    }
  };

  const periodContent = getPeriodContent();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h4 className="font-semibold text-gray-900">Energy Points</h4>
            </div>
            <span className="text-2xl font-bold text-blue-600">{totalPoints}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Earn points by logging consistently!</p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h4 className="font-semibold text-gray-900">Current Streak</h4>
            </div>
            <span className="text-2xl font-bold text-orange-600">{currentStreak} days</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Keep the momentum going!</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">7-Day Challenge Progress</h3>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-600">
            {daysRemaining > 0
              ? `${daysRemaining} days until personalised insights`
              : 'Personalised insights unlocked!'}
          </span>
        </div>
      </div>

      <div className="relative pt-1 mb-6">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {uniqueDays}/7 Days
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
          />
        </div>
      </div>

      {hasUnlockedMilestones ? (
        <button
          onClick={() => setShowMilestones(!showMilestones)}
          className="w-full bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">View Zen Milestones</h3>
            </div>
            <ChevronRight className={`w-5 h-5 text-indigo-600 transition-transform ${showMilestones ? 'rotate-90' : ''}`} />
          </div>
        </button>
      ) : (
        <div className="w-full bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
          <div className="flex items-center gap-3 justify-center text-gray-500">
            <Award className="w-6 h-6" />
            <h3 className="font-semibold">Complete 7-day challenge to unlock Zen Milestones</h3>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showMilestones && hasUnlockedMilestones && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-gray-900">Energy Battery</h4>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{batteryLevel}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Your monthly energy capacity</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  Zen Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${achievements.peakPerformer ? 'bg-purple-500' : 'bg-gray-300'}`} />
                      <span className="font-medium flex items-center gap-1">
                        {periodContent.icon}
                        {periodContent.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{periodContent.description}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${achievements.energyAlchemist ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      <span className="font-medium flex items-center gap-1">
                        <Zap className="w-4 h-4 text-blue-500" />
                        Energy Alchemist
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Transform your energy: Record 10 days with levels of 8 or higher</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${achievements.balanceSeeker ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="font-medium flex items-center gap-1">
                        <Heart className="w-4 h-4 text-green-500" />
                        Balance Keeper
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Balance work and breaks for 7 days</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${achievements.consistentLogger ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                      <span className="font-medium flex items-center gap-1">
                        <Target className="w-4 h-4 text-yellow-500" />
                        Consistency Champion
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Maintain a 14-day logging streak</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${achievements.insightful ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                      <span className="font-medium flex items-center gap-1">
                        <Brain className="w-4 h-4 text-indigo-500" />
                        Reflection Sage
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Write detailed reflections for 5 days</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-rose-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${achievements.mindfulObserver ? 'bg-rose-500' : 'bg-gray-300'}`} />
                      <span className="font-medium flex items-center gap-1">
                        <Heart className="w-4 h-4 text-rose-500" />
                        Mindful Observer
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Track multiple factors affecting your energy for 5 days</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Energy Mastery Progress
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Achievements Unlocked</span>
                      <span className="text-blue-600 font-medium">
                        {Object.values(achievements).filter(Boolean).length}/6
                      </span>
                    </div>
                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(Object.values(achievements).filter(Boolean).length / 6) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}