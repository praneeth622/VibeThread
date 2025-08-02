"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Music, Headphones, Sparkles, Zap, Heart, Star } from 'lucide-react';

export const LoadingIndicator = () => {
  const steps = [
    { icon: <Zap className="w-5 h-5" />, text: "Analyzing URL", color: "text-yellow-400", bgColor: "bg-yellow-100" },
    { icon: <Headphones className="w-5 h-5" />, text: "Extracting Audio", color: "text-blue-400", bgColor: "bg-blue-100" },
    { icon: <Music className="w-5 h-5" />, text: "Identifying Music", color: "text-purple-400", bgColor: "bg-purple-100" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Processing Results", color: "text-green-400", bgColor: "bg-green-100" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-8 glass-pastel border-pink-300/30 rounded-3xl shadow-pastel-xl text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-pastel-gradient-soft" />
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl"
        />
        
        <div className="relative z-10">
          {/* Main Loading Animation */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-pink-300/40 rounded-full"
              />
              
              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-4 border-purple-300/50 rounded-full"
              />
              
              {/* Inner ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-4 border-blue-300/60 rounded-full"
              />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center shadow-pastel"
                >
                  <Music className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </div>

            <motion.h3
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center"
            >
              Processing Your Request
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="ml-2"
              >
                <Sparkles className="w-6 h-6 text-pink-400" />
              </motion.div>
            </motion.h3>
            
            <p className="text-gray-700 mb-8 flex items-center justify-center">
              Our gentle AI is working its magic to extract and identify your audio
              <Heart className="w-4 h-4 ml-2 text-pink-400" />
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
                className="flex items-center justify-center space-x-3 p-3 glass rounded-xl border border-pink-200/30"
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
                  className={`p-2 rounded-full ${step.bgColor} ${step.color}`}
                >
                  {step.icon}
                </motion.div>
                <span className="text-gray-800 font-medium">{step.text}</span>
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className="flex space-x-1"
                >
                  <div className="w-1 h-1 bg-pink-400 rounded-full" />
                  <div className="w-1 h-1 bg-purple-400 rounded-full" />
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 p-4 bg-pastel-warm border border-pink-300/30 rounded-xl"
          >
            <motion.p
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-sm text-gray-700 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Star className="w-4 h-4 text-yellow-400" />
              </motion.div>
              <strong>Did you know?</strong> Our AI can identify over 100 million songs and automatically create magical Spotify playlists!
              <Heart className="w-4 h-4 ml-2 text-pink-400" />
            </motion.p>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};