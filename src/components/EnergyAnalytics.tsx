import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import type { EnergyLog } from '../types';
import { TrendingUp as TrendUp, Brain } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  logs: EnergyLog[];
}

export default function EnergyAnalytics({ logs }: Props) {
  const last7Days = logs.slice(-7);
  
  // Process data for energy level trends
  const energyData = {
    labels: last7Days.map(log => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Energy Level',
        data: last7Days.map(log => log.energyLevel),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Process data for activity impact
  const activityImpact = logs.reduce((acc: Record<string, number[]>, log) => {
    log.activities.forEach(activity => {
      if (!acc[activity]) acc[activity] = [];
      acc[activity].push(log.energyLevel);
    });
    return acc;
  }, {});

  const averageImpact = Object.entries(activityImpact).map(([activity, levels]) => ({
    activity,
    impact: levels.reduce((sum, level) => sum + level, 0) / levels.length
  })).sort((a, b) => b.impact - a.impact);

  const activityData = {
    labels: averageImpact.map(item => item.activity),
    datasets: [
      {
        label: 'Average Energy Impact',
        data: averageImpact.map(item => item.impact),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      }
    ]
  };

  // Calculate personalized insights
  const calculateInsights = () => {
    const insights: string[] = [];
    
    // Peak energy time patterns
    const peakEnergyLogs = logs.filter(log => log.energyLevel >= 8);
    const peakTimeDistribution = peakEnergyLogs.reduce((acc: Record<string, number>, log) => {
      const hour = new Date(log.date).getHours();
      const timeBlock = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      acc[timeBlock] = (acc[timeBlock] || 0) + 1;
      return acc;
    }, {});

    const bestTimeBlock = Object.entries(peakTimeDistribution)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    if (bestTimeBlock) {
      insights.push(`You tend to have highest energy levels during the ${bestTimeBlock}`);
    }

    // Most effective positive factors
    const topFactors = logs.reduce((acc: Record<string, number>, log) => {
      log.positiveFactors.forEach(factor => {
        if (!acc[factor]) acc[factor] = 0;
        acc[factor] += log.energyLevel;
      });
      return acc;
    }, {});

    const bestFactor = Object.entries(topFactors)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    if (bestFactor) {
      insights.push(`"${bestFactor}" consistently helps improve your energy levels`);
    }

    return insights;
  };

  const insights = calculateInsights();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendUp className="w-6 h-6 text-blue-600" />
          Energy Level Trends
        </h3>
        <div className="h-64">
          <Line
            data={energyData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 10,
                  title: {
                    display: true,
                    text: 'Energy Level'
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          Activity Impact Analysis
        </h3>
        <div className="h-64">
          <Bar
            data={activityData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 10,
                  title: {
                    display: true,
                    text: 'Average Energy Level'
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          Personalized Insights
        </h3>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
              <p className="text-gray-700">{insight}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}