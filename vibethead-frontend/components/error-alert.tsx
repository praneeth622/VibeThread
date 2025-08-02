"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, HelpCircle, ExternalLink } from 'lucide-react';

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
      <Card className="p-8 bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-sm border-red-500/30 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-orange-600/5 to-red-600/5" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Error Icon and Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-16 h-16 mx-auto mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-4 border-red-400/30 rounded-full"
              />
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl font-bold text-white mb-2"
            >
              Oops! Something went wrong
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-red-200 mb-4"
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
              <Button
                onClick={onRetry}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            
            <Button
              variant="outline"
              className="border-red-500/50 text-red-300 hover:bg-red-500/10 hover:border-red-400 px-6 py-3 rounded-lg transition-all duration-300"
              onClick={() => window.open('mailto:support@vibethread.com', '_blank')}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Get Help
            </Button>
          </motion.div>

          {/* Troubleshooting Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6"
          >
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-white font-medium mb-3">Troubleshooting Tips:</h4>
                <ul className="space-y-2">
                  {troubleshootingTips.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      className="text-sm text-gray-300 flex items-start"
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
            <p className="text-sm text-gray-400 mb-2">
              Still having issues? We're here to help!
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-300 hover:text-white hover:bg-red-500/10"
              onClick={() => window.open('https://vibethread.com/support', '_blank')}
            >
              Visit Support Center
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};