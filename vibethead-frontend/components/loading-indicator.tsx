"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Music, Headphones, Sparkles, Zap } from 'lucide-react';

export const LoadingIndicator = () => {
  const steps = [
    { icon: <Zap className="w-5 h-5" />, text: "Analyzing URL", color: "text-yellow-400" },
    { icon: <Headphones className="w-5 h-5" />, text: "Extracting Audio", color: "text-blue-400" },
    { icon: <Music className="w-5 h-5" />, text: "Identifying Music", color: "text-purple-400" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Processing Results", color: "text-green-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 rounded-2xl shadow-2xl text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-indigo-600/5" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Main Loading Animation */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-purple-500/30 rounded-full"
              />
              
              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-4 border-blue-500/40 rounded-full"
              />
              
              {/* Inner ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-4 border-green-500/50 rounded-full"
              />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                >
                  <Music className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </div>

            <motion.h3
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl font-bold text-white mb-2"
            >
              Processing Your Request
            </motion.h3>
            
            <p className="text-gray-300 mb-8">
              Our AI is working its magic to extract and identify your audio
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2
                }}
                className="flex items-center justify-center space-x-3"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                  className={`${step.color}`}
                >
                  {step.icon}
                </motion.div>
                <span className="text-white font-medium">{step.text}</span>
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className="flex space-x-1"
                >
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <div className="w-1 h-1 bg-white rounded-full" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl"
          >
            <motion.p
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-sm text-gray-300"
            >
              💡 <strong>Did you know?</strong> Our AI can identify over 100 million songs and automatically create Spotify playlists!
            </motion.p>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};