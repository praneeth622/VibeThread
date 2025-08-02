"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { extractAudio } from '@/lib/api';
import { LoadingIndicator } from '@/components/loading-indicator';
import { ResultCard } from '@/components/result-card';
import { ErrorAlert } from '@/components/error-alert';
import { isValidInstagramUrl } from '@/lib/utils';
import { AudioResult } from '@/lib/types';
import { Sparkles, Instagram, Youtube, Music2, Zap, ArrowRight, Heart, Star } from 'lucide-react';

// Updated interface to match the backend response structure
interface Track {
  title: string;
  artists: string[];
  album?: string;
  duration_ms?: number;
  score?: number;
  release_date?: string;
  spotify?: {
    track?: {
      name: string;
      id: string;
    };
    album?: {
      name: string;
      id: string;
    };
    artists?: {
      name: string;
      id: string;
    }[];
  };
  youtube?: {
    vid: string;
  };
  genres?: string[];
}

interface AudioTrackResult {
  filePath: string;
  tracks: Track[];
  musicInfo?: any[]; // For backward compatibility
}

interface AudioResponse {
  success: boolean;
  platform?: string;
  musicData: AudioTrackResult[];
  error?: string;
}

interface ApiResponse {
  message: string;
  audio: AudioResponse;
}

export default function ExtractorForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AudioResult[] | null>(null);

  // Function to transform backend response to frontend format
  const transformResults = (response: ApiResponse): AudioResult[] => {
    const audioResults: AudioResult[] = [];
    
    if (!response.audio || !response.audio.musicData) {
      return [];
    }
    
    // Process each music data entry
    response.audio.musicData.forEach((data, dataIndex) => {
      // Handle both 'tracks' and 'musicInfo' formats for backward compatibility
      const trackList = data.tracks || (data.musicInfo || []);
      
      trackList.forEach((track, trackIndex) => {
        // Create a unique ID for each track
        const id = `track-${dataIndex}-${trackIndex}`;
        
        // Get artist names as a string
        const artistNames = Array.isArray(track.artists) 
          ? track.artists.join(', ') 
          : (typeof track.artists === 'string' ? track.artists : 'Unknown Artist');
        
        // Format duration if available
        let duration = '0:00';
        if (track.duration_ms) {
          const minutes = Math.floor(track.duration_ms / 60000);
          const seconds = Math.floor((track.duration_ms % 60000) / 1000);
          duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Create YouTube URL if available
        let url = '';
        if (track.youtube && track.youtube.vid) {
          url = `https://www.youtube.com/watch?v=${track.youtube.vid}`;
        } else if (track.spotify && track.spotify.track && track.spotify.track.id) {
          url = `https://open.spotify.com/track/${track.spotify.track.id}`;
        } else {
          // Fallback URL - this would be replaced with actual audio file in a real implementation
          url = `https://example.com/audio/${id}.mp3`;
        }
        
        audioResults.push({
          id,
          title: track.title || 'Unknown Track',
          url,
          duration,
          artists: artistNames,
          album: track.album || 'Unknown Album',
          spotifyId: track.spotify?.track?.id,
          youtubeId: track.youtube?.vid
        });
      });
    });
    
    return audioResults;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Oops! 🌸",
        description: "Please enter a URL to work our magic",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (err) {
      toast({
        title: "Invalid URL ✨",
        description: "Please enter a valid URL so we can create magic",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setResults(null);
    setIsLoading(true);

    try {
      const data = await extractAudio(url);
      
      if (data && data.audio && data.audio.musicData) {
        const transformedResults = transformResults(data);
        setResults(transformedResults);
        
        if (transformedResults.length === 0) {
          toast({
            title: "No music found 🎵",
            description: "We couldn't find any music in this magical media",
            variant: "default",
          });
        } else {
          toast({
            title: "Success! ✨",
            description: `Found ${transformedResults.length} beautiful track(s)`,
          });
        }
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract audio");
      toast({
        title: "Extraction Failed 💔",
        description: err instanceof Error ? err.message : "Failed to extract audio",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const platformIcons = [
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", color: "text-pink-500", bgColor: "bg-pink-100" },
    { icon: <Youtube className="w-5 h-5" />, name: "YouTube", color: "text-red-500", bgColor: "bg-red-100" },
    { icon: <Music2 className="w-5 h-5" />, name: "TikTok", color: "text-purple-500", bgColor: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8">
      {/* Main Extraction Form */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="p-8 glass-pastel border-pink-300/30 rounded-3xl shadow-pastel-xl overflow-hidden relative hover-lift">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-pastel-warm" />
          <motion.div 
            animate={{ x: [0, 100, 0], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-32 h-32 bg-pink-200/30 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl"
          />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-yellow-300/40 rounded-full"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 ml-3">
                  Extract Audio <span className="gradient-text">Magic</span>
                </h2>
                <motion.div
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-pink-400 ml-2" />
                </motion.div>
              </motion.div>
              
              <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                Paste any social media URL and watch as we extract high-quality audio with our gentle AI magic ✨
              </p>
            </div>

            {/* Supported Platforms */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-6 mb-8"
            >
              <span className="text-sm text-gray-600 font-medium">Supported platforms:</span>
              {platformIcons.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full ${platform.bgColor} ${platform.color} shadow-pastel`}
                >
                  {platform.icon}
                  <span className="text-sm font-medium">{platform.name}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Paste your magical URL here... ✨"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-14 glass border-pink-300/40 text-gray-800 placeholder:text-gray-600 focus-pastel transition-all duration-300 text-lg rounded-2xl pl-6 pr-12 shadow-pastel"
                      disabled={isLoading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Music2 className="w-5 h-5 text-pink-400" />
                      </motion.div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading || !url.trim()}
                    className="h-14 bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-800 font-semibold px-8 rounded-2xl transition-all duration-300 shadow-pastel-lg hover:shadow-pastel-xl relative overflow-hidden group lg:min-w-[200px] btn-shimmer"
                  >
                    <span className="relative z-10 flex items-center">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-gray-700/30 border-t-gray-700 rounded-full mr-3"
                          />
                          Processing Magic...
                        </>
                      ) : (
                        <>
                          Extract Audio
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </motion.div>
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </motion.div>

              {/* Quick Tips */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-pastel-cool border border-blue-300/30 rounded-2xl p-4 shadow-pastel"
              >
                <div className="flex items-start space-x-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  </motion.div>
                  <div>
                    <h4 className="text-gray-800 font-medium mb-1 flex items-center">
                      Pro Tips 
                      <motion.div
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="ml-2"
                      >
                        <Star className="w-4 h-4 text-yellow-400" />
                      </motion.div>
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center">
                        <Heart className="w-3 h-3 text-pink-400 mr-2" />
                        Works with public posts, reels, and videos
                      </li>
                      <li className="flex items-center">
                        <Heart className="w-3 h-3 text-purple-400 mr-2" />
                        Automatically identifies music and creates Spotify playlists
                      </li>
                      <li className="flex items-center">
                        <Heart className="w-3 h-3 text-blue-400 mr-2" />
                        High-quality audio extraction with beautiful metadata
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </form>
          </div>
        </Card>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingIndicator />
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ErrorAlert message={error} onRetry={() => {
            setError(null);
            if (url.trim()) {
              handleSubmit(new Event('submit') as any);
            }
          }} />
        </motion.div>
      )}

      {/* Results */}
      {results && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ResultCard results={results} />
        </motion.div>
      )}
    </div>
  );
}