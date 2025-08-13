"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, HelpCircle, ExternalLink, Heart, Star } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert = ({ message, onRetry }: ErrorAlertProps) => {
  const troubleshootingTips = [
    "Make sure the URL is from a public post",
    "Check if the post contains audio/video content",
    "Try copying the URL again from your browser",
    "Ensure you have a stable internet connection"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-8 glass-pastel border-red-300/40 rounded-3xl shadow-pastel-xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 to-orange-100/30" />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-32 h-32 bg-red-200/20 rounded-full blur-3xl"
        />
        
        <div className="relative z-10">
          {/* Error Icon and Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-16 h-16 mx-auto mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-red-300 to-orange-300 rounded-full flex items-center justify-center shadow-pastel-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-4 border-red-300/40 rounded-full"
              />
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center"
            >
              Oops! Something went wrong
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="ml-2"
              >
                <Heart className="w-5 h-5 text-pink-400" />
              </motion.div>
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-red-700 mb-4 font-medium"
            >
              {message}
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
          >
            {onRetry && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onRetry}
                  className="bg-gradient-to-r from-red-300 to-orange-300 hover:from-red-400 hover:to-orange-400 text-gray-800 px-6 py-3 rounded-xl transition-all duration-300 shadow-pastel hover:shadow-pastel-lg btn-shimmer"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </motion.div>
            )}
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400 px-6 py-3 rounded-xl transition-all duration-300"
                onClick={() => window.open('mailto:support@vibethread.com', '_blank')}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Get Help
              </Button>
            </motion.div>
          </motion.div>

          {/* Troubleshooting Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-pastel-warm border border-orange-300/30 rounded-xl p-6"
          >
            <div className="flex items-start space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <HelpCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              </motion.div>
              <div className="flex-1">
                <h4 className="text-gray-800 font-medium mb-3 flex items-center">
                  Troubleshooting Tips:
                  <Star className="w-4 h-4 ml-2 text-yellow-400" />
                </h4>
                <ul className="space-y-2">
                  {troubleshootingTips.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      className="text-sm text-gray-700 flex items-start"
                    >
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Support Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-gray-600 mb-2 flex items-center justify-center">
              Still having issues? We're here to help with love!
              <Heart className="w-4 h-4 ml-2 text-pink-400" />
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-100/50 rounded-xl"
                onClick={() => window.open('https://vibethread.praneethd.xyz/support', '_blank')}
              >
                Visit Support Center
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};