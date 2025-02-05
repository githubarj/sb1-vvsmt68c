import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnergyTracker from './components/EnergyTracker';
import AuthForm from './components/AuthForm';
import NavigationMenu from './components/NavigationMenu';
import { Zap, ArrowRight, Battery, Brain, LineChart as ChartLine } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-16"
      >
        <div className="flex justify-center items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Zap className="w-12 h-12 md:w-16 md:h-16 text-blue-600" />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Zenflowz
          </h1>
        </div>
        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-4">
          Personal Energy Optimisation for Peak Performance 🎯
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          className="bg-blue-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 text-sm md:text-base"
        >
          Get Started
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16">
        {[
          {
            icon: <Battery className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
            title: "Track Your Energy",
            description: "Monitor your daily energy levels and identify patterns that affect your performance."
          },
          {
            icon: <Brain className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />,
            title: "Gain Insights",
            description: "Receive personalised recommendations based on your energy patterns and habits."
          },
          {
            icon: <ChartLine className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />,
            title: "Optimise Performance",
            description: "Use data-driven insights to maximise your productivity and wellbeing."
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index }}
            className="bg-white p-4 md:p-6 rounded-xl shadow-lg"
          >
            <div className="mb-3 md:mb-4">{feature.icon}</div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center text-gray-600 px-4">
        <p className="text-sm md:text-base mb-1">Join hundreds of users in mastering their energy flow in 2025 and beyond</p>
        <p className="text-xs md:text-sm text-gray-500">Be part of a growing community committed to lasting energy optimisation</p>
        <p className="text-xs md:text-sm mt-2">© 2025 Stacy Njimu. All rights reserved.</p>
      </div>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState<{ id: string; firstName: string; reminderTime?: string } | null>(null);
  const [showEnergyLog, setShowEnergyLog] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUser(session.user);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleUser(session.user);
      } else {
        setUser(null);
        setShowLanding(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUser = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, reminder_time')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      setUser({
        id: authUser.id,
        firstName: profile?.first_name || authUser.email?.split('@')[0] || 'User',
        reminderTime: profile?.reminder_time
      });
      setShowLanding(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Create a profile if it doesn't exist
      const firstName = authUser.user_metadata.first_name || authUser.email?.split('@')[0] || 'User';
      const reminderTime = authUser.user_metadata.reminder_time || '09:00';

      try {
        await supabase.from('profiles').insert([
          {
            id: authUser.id,
            first_name: firstName,
            reminder_time: reminderTime,
            email: authUser.email
          }
        ]);

        setUser({
          id: authUser.id,
          firstName,
          reminderTime
        });
        setShowLanding(false);
      } catch (insertError) {
        console.error('Error creating user profile:', insertError);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setShowLanding(true);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Zap className="w-12 h-12 text-blue-600 mx-auto animate-pulse" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showLanding && !user) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {!user ? (
        <AuthForm onLogin={handleUser} />
      ) : (
        <>
          <NavigationMenu onSignOut={handleSignOut} userName={user.firstName} />
          
          <main className="container mx-auto px-4 py-4 md:py-8 flex-grow">
            <EnergyTracker userId={user.id} />
          </main>
        </>
      )}
      
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white shadow-inner mt-auto"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <p className="text-center text-gray-600 text-xs md:text-sm">
            © 2025 Stacy Njimu. All rights reserved. This application is for informational purposes only.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;