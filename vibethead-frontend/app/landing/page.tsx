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
  Star,
  Cloud,
  Waves
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
      title: "Instagram Magic",
      description: "Extract audio from any Instagram post, reel, or story with just a URL",
      gradient: "from-pink-300 to-rose-300",
      hoverGlow: "hover-glow-warm"
    },
    {
      icon: <Youtube className="w-8 h-8" />,
      title: "Multi-Platform Support",
      description: "Works seamlessly with Instagram, YouTube, TikTok, and more platforms",
      gradient: "from-red-300 to-orange-300",
      hoverGlow: "hover-glow-warm"
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Smart Recognition",
      description: "AI-powered music identification with automatic Spotify playlist creation",
      gradient: "from-purple-300 to-blue-300",
      hoverGlow: "hover-glow-cool"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Instant Downloads",
      description: "High-quality audio downloads in multiple formats with metadata",
      gradient: "from-green-300 to-teal-300",
      hoverGlow: "hover-glow-cool"
    }
  ];

  const stats = [
    { number: "1M+", label: "Tracks Extracted", icon: <Music className="w-6 h-6" />, color: "text-pink-400" },
    { number: "50K+", label: "Happy Users", icon: <Heart className="w-6 h-6" />, color: "text-rose-400" },
    { number: "99.9%", label: "Success Rate", icon: <TrendingUp className="w-6 h-6" />, color: "text-purple-400" },
    { number: "24/7", label: "Available", icon: <Zap className="w-6 h-6" />, color: "text-blue-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-pastel-gradient-soft" />
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl animate-float"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-bounce-gentle"
        />
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-green-200/20 rounded-full blur-2xl"
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/6 text-pink-300/40"
      >
        <Cloud className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/6 text-purple-300/40"
      >
        <Waves className="w-12 h-12" />
      </motion.div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 flex items-center justify-between p-6 lg:px-12"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Music className="w-8 h-8 text-pink-400" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-pink-300/40 rounded-full"
            />
          </div>
          <span className="text-2xl font-bold gradient-text-warm">
            VibeThread
          </span>
        </div>
        <Link href="/dashboard">
          <Button className="bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-800 px-6 py-2 rounded-full transition-all duration-300 shadow-pastel hover:shadow-pastel-lg btn-shimmer">
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
              className="absolute inset-0 w-32 h-32 mx-auto border-4 border-pink-300/30 rounded-full"
            />
            
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 w-28 h-28 mx-auto border-4 border-purple-300/40 rounded-full"
            />
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 w-24 h-24 mx-auto border-4 border-blue-300/50 rounded-full"
            />
            
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center shadow-pastel-lg">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Headphones className="w-16 h-16 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl lg:text-7xl font-bold mb-6 text-gray-800"
        >
          Extract Music
          <br />
          <span className="gradient-text">
            Like Magic ✨
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl leading-relaxed"
        >
          Transform any social media post into high-quality audio with our dreamy AI. 
          <br />
          <span className="text-pink-600 font-medium">Instagram, YouTube, TikTok</span> - we've got you covered with love.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-800 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-pastel-lg hover:shadow-pastel-xl hover:scale-105 btn-shimmer">
              Start Extracting
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg"
            className="border-pink-300 text-pink-600 hover:bg-pink-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover-glow-warm"
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
              className="text-center glass-pastel p-4 rounded-2xl hover-lift"
            >
              <div className={`flex items-center justify-center mb-2 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">
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
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
              Why Choose <span className="gradient-text">VibeThread</span>?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Experience the future of audio extraction with our gentle, powerful technology
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
                <Card className={`p-8 glass-pastel hover:border-pink-300/50 transition-all duration-300 h-full ${feature.hoverGlow} hover-lift shadow-pastel`}>
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-pastel`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
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
          <Card className="p-12 glass-pastel border-pink-300/30 shadow-pastel-xl hover-lift">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
              Ready to Get <span className="gradient-text">Started</span>?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who trust VibeThread for their magical audio extraction needs
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 hover:from-pink-400 hover:via-purple-400 hover:to-blue-400 text-gray-800 px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 shadow-pastel-xl hover:shadow-pastel-xl hover:scale-105 btn-shimmer">
                Start Extracting Now
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-pink-200/50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 lg:mb-0">
            <Music className="w-6 h-6 text-pink-400" />
            <span className="text-xl font-bold gradient-text-warm">
              VibeThread
            </span>
          </div>
          <div className="flex items-center space-x-6 text-gray-600">
            <span>© 2024 VibeThread. Made with 💖</span>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Share2 className="w-5 h-5 hover:text-pink-400 cursor-pointer transition-colors" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
                animate={{ scale: [1, 1.1, 1] }}
              >
                <Heart className="w-5 h-5 hover:text-red-400 cursor-pointer transition-colors text-red-300" />
              </motion.div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;