"use client";

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Music, 
  Instagram, 
  Youtube, 
  Headphones, 
  Download, 
  Sparkles, 
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Heart,
  Share2,
  TrendingUp,
  Zap,
  Star
} from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const features = [
    {
      icon: <Instagram className="w-8 h-8" />,
      title: "Instagram Integration",
      description: "Extract audio from any Instagram post, reel, or story with just a URL",
      gradient: "from-pink-500 to-purple-600"
    },
    {
      icon: <Youtube className="w-8 h-8" />,
      title: "Multi-Platform Support",
      description: "Works with Instagram, YouTube, TikTok, and more platforms",
      gradient: "from-red-500 to-orange-600"
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Smart Music Recognition",
      description: "AI-powered music identification with Spotify integration",
      gradient: "from-green-500 to-blue-600"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Instant Downloads",
      description: "High-quality audio downloads in multiple formats",
      gradient: "from-blue-500 to-indigo-600"
    }
  ];

  const stats = [
    { number: "1M+", label: "Tracks Extracted", icon: <Music className="w-6 h-6" /> },
    { number: "50K+", label: "Happy Users", icon: <Heart className="w-6 h-6" /> },
    { number: "99.9%", label: "Success Rate", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "24/7", label: "Available", icon: <Zap className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 flex items-center justify-between p-6 lg:px-12"
      >
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
        <Link href="/dashboard">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-32 h-32 mx-auto border-4 border-purple-500/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 w-28 h-28 mx-auto border-2 border-blue-500/30 rounded-full"
            />
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Headphones className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
        >
          Extract Music
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Like Magic ✨
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl leading-relaxed"
        >
          Transform any social media post into high-quality audio. 
          <br />
          <span className="text-purple-400">Instagram, YouTube, TikTok</span> - we've got you covered.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-purple-500/25 hover:scale-105">
              Start Extracting
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg"
            className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2 text-purple-400">
                {stat.icon}
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose VibeThread?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of audio extraction with our cutting-edge technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-500/30 transition-all duration-300 h-full">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="p-12 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border-purple-500/30">
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who trust VibeThread for their audio extraction needs
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-purple-500/25 hover:scale-105">
                Start Extracting Now
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 lg:mb-0">
            <Music className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              VibeThread
            </span>
          </div>
          <div className="flex items-center space-x-6 text-gray-400">
            <span>© 2024 VibeThread. All rights reserved.</span>
            <div className="flex items-center space-x-4">
              <Share2 className="w-5 h-5 hover:text-purple-400 cursor-pointer transition-colors" />
              <Heart className="w-5 h-5 hover:text-red-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;