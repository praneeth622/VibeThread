"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Music, 
  ArrowLeft, 
  Home,
  Search,
  Download,
  ListMusic,
  Settings,
  User,
  Bell,
  Sparkles,
  Heart,
  TrendingUp,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import ExtractorForm from '@/components/extractor-form';
import { MusicPattern } from '@/components/music-pattern';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('extract');

  const navigationItems = [
    { id: 'extract', label: 'Extract Audio', icon: <Search className="w-5 h-5" />, color: 'text-pink-500' },
    { id: 'downloads', label: 'Downloads', icon: <Download className="w-5 h-5" />, color: 'text-purple-500' },
    { id: 'playlists', label: 'Playlists', icon: <ListMusic className="w-5 h-5" />, color: 'text-blue-500' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative">
      {/* Background Pattern */}
      <MusicPattern className="absolute inset-0 opacity-5" />
      <div className="absolute inset-0 bg-pastel-gradient-soft" />
      
      {/* Floating Background Elements */}
      <motion.div 
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 right-1/4 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl"
      />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 glass-pastel border-b border-pink-200/30"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/landing" className="flex items-center space-x-3 group">
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-pink-500 transition-colors" />
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Music className="w-8 h-8 text-pink-400" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-pink-300/30 rounded-full"
                    />
                  </div>
                  <span className="text-2xl font-bold gradient-text-warm">
                    VibeThread
                  </span>
                </div>
              </Link>

              {/* Navigation Tabs */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-pink-200 to-purple-200 text-gray-800 shadow-pastel border border-pink-300/30'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                    }`}
                  >
                    <span className={activeTab === item.id ? item.color : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-pink-500 hover:bg-pink-100/50 rounded-full"
                >
                  <Bell className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-purple-500 hover:bg-purple-100/50 rounded-full"
                >
                  <User className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Welcome to <span className="gradient-text">VibeThread</span>
              </h1>
              <p className="text-gray-700 text-lg">
                Extract audio from your favorite social media posts with magical ease ✨
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-2 text-pink-500">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {activeTab === 'extract' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 glass-pastel border-pink-300/30 hover:border-pink-400/50 transition-all duration-300 shadow-pastel hover-lift">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-pink-300 to-rose-300 rounded-xl shadow-pastel">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">0</p>
                        <p className="text-gray-600 text-sm">Tracks Extracted</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 glass-pastel border-green-300/30 hover:border-green-400/50 transition-all duration-300 shadow-pastel hover-lift">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-green-300 to-emerald-300 rounded-xl shadow-pastel">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">0</p>
                        <p className="text-gray-600 text-sm">Downloads</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 glass-pastel border-blue-300/30 hover:border-blue-400/50 transition-all duration-300 shadow-pastel hover-lift">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-xl shadow-pastel">
                        <ListMusic className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">0</p>
                        <p className="text-gray-600 text-sm">Playlists Created</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Extractor Form */}
              <ExtractorForm />
            </div>
          )}

          {activeTab === 'downloads' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 glass-pastel border-purple-300/30 text-center shadow-pastel-lg">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Download className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Downloads Yet</h3>
                <p className="text-gray-700 mb-6">
                  Your downloaded tracks will appear here once you start extracting audio.
                </p>
                <Button
                  onClick={() => setActiveTab('extract')}
                  className="bg-gradient-to-r from-purple-300 to-blue-300 hover:from-purple-400 hover:to-blue-400 text-gray-800 btn-shimmer"
                >
                  Start Extracting
                </Button>
              </Card>
            </motion.div>
          )}

          {activeTab === 'playlists' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 glass-pastel border-green-300/30 text-center shadow-pastel-lg">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <ListMusic className="w-16 h-16 text-green-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Playlists Yet</h3>
                <p className="text-gray-700 mb-6">
                  Create magical Spotify playlists from your extracted tracks.
                </p>
                <Button
                  onClick={() => setActiveTab('extract')}
                  className="bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-gray-800 btn-shimmer"
                >
                  Extract & Create Playlist
                </Button>
              </Card>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 glass-pastel border-pink-300/30 shadow-pastel-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-pink-500" />
                  Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audio Quality
                    </label>
                    <select className="w-full p-3 glass border border-pink-300/30 rounded-xl text-gray-800 focus-pastel transition-all duration-300">
                      <option value="high">High Quality (320kbps)</option>
                      <option value="medium">Medium Quality (192kbps)</option>
                      <option value="low">Low Quality (128kbps)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Download Format
                    </label>
                    <select className="w-full p-3 glass border border-purple-300/30 rounded-xl text-gray-800 focus-pastel-lavender transition-all duration-300">
                      <option value="mp3">MP3</option>
                      <option value="wav">WAV</option>
                      <option value="flac">FLAC</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 glass rounded-xl border border-blue-300/30">
                    <span className="text-gray-700 font-medium">Auto-create Spotify playlists</span>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-pink-300 to-purple-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
                    >
                      <motion.span 
                        animate={{ x: [4, 20] }}
                        transition={{ duration: 0.3 }}
                        className="inline-block h-4 w-4 transform rounded-full bg-white shadow-pastel transition-transform"
                      />
                    </motion.button>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-800 py-3 rounded-xl btn-shimmer shadow-pastel">
                    Save Settings
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 glass-pastel border-t border-pink-200/30 p-4 z-50"
        >
          <div className="flex items-center justify-around">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? 'text-pink-500 bg-pink-100/50'
                    : 'text-gray-600'
                }`}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;