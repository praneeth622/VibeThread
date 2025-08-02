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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import ExtractorForm from '@/components/extractor-form';
import { MusicPattern } from '@/components/music-pattern';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('extract');

  const navigationItems = [
    { id: 'extract', label: 'Extract Audio', icon: <Search className="w-5 h-5" /> },
    { id: 'downloads', label: 'Downloads', icon: <Download className="w-5 h-5" /> },
    { id: 'playlists', label: 'Playlists', icon: <ListMusic className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <MusicPattern className="absolute inset-0 opacity-5" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 bg-black/20 backdrop-blur-sm border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/landing" className="flex items-center space-x-3 group">
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Music className="w-8 h-8 text-purple-400" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-purple-400/30 rounded-full"
                    />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    VibeThread
                  </span>
                </div>
              </Link>

              {/* Navigation Tabs */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <User className="w-5 h-5" />
              </Button>
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
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Welcome to VibeThread
              </h1>
              <p className="text-gray-400 text-lg">
                Extract audio from your favorite social media posts
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-2 text-purple-400">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">AI-Powered</span>
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
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">0</p>
                      <p className="text-gray-400 text-sm">Tracks Extracted</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-green-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">0</p>
                      <p className="text-gray-400 text-sm">Downloads</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                      <ListMusic className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">0</p>
                      <p className="text-gray-400 text-sm">Playlists Created</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Extractor Form */}
              <ExtractorForm />
            </div>
          )}

          {activeTab === 'downloads' && (
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 text-center">
              <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Downloads Yet</h3>
              <p className="text-gray-400 mb-6">
                Your downloaded tracks will appear here once you start extracting audio.
              </p>
              <Button
                onClick={() => setActiveTab('extract')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Extracting
              </Button>
            </Card>
          )}

          {activeTab === 'playlists' && (
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 text-center">
              <ListMusic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Playlists Yet</h3>
              <p className="text-gray-400 mb-6">
                Create Spotify playlists from your extracted tracks.
              </p>
              <Button
                onClick={() => setActiveTab('extract')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Extract & Create Playlist
              </Button>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Audio Quality
                  </label>
                  <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="high">High Quality (320kbps)</option>
                    <option value="medium">Medium Quality (192kbps)</option>
                    <option value="low">Low Quality (128kbps)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Download Format
                  </label>
                  <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="flac">FLAC</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Auto-create Spotify playlists</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                  </button>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Save Settings
                </Button>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10 p-4"
        >
          <div className="flex items-center justify-around">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? 'text-purple-400'
                    : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;