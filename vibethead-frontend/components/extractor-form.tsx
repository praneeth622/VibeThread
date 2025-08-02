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
import { Sparkles, Instagram, Youtube, Music2, Zap, ArrowRight } from 'lucide-react';

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
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (err) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
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
            title: "No music found",
            description: "We couldn't identify any music in this media",
            variant: "default",
          });
        } else {
          toast({
            title: "Success!",
            description: `Found ${transformedResults.length} track(s)`,
          });
        }
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract audio");
      toast({
        title: "Extraction Failed",
        description: err instanceof Error ? err.message : "Failed to extract audio",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const platformIcons = [
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", color: "text-pink-400" },
    { icon: <Youtube className="w-5 h-5" />, name: "YouTube", color: "text-red-400" },
    { icon: <Music2 className="w-5 h-5" />, name: "TikTok", color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Main Extraction Form */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl" />
          
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
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-yellow-400/30 rounded-full"
                  />
                </div>
                <h2 className="text-2xl font-bold text-white ml-3">
                  Extract Audio Magic
                </h2>
                <Sparkles className="w-6 h-6 text-purple-400 ml-2" />
              </motion.div>
              
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Paste any social media URL and watch as we extract high-quality audio with AI-powered music recognition
              </p>
            </div>

            {/* Supported Platforms */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-6 mb-8"
            >
              <span className="text-sm text-gray-400 font-medium">Supported platforms:</span>
              {platformIcons.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className={`flex items-center space-x-2 ${platform.color}`}
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
                      placeholder="Paste your Instagram, YouTube, or TikTok URL here..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-lg rounded-xl pl-6 pr-12"
                      disabled={isLoading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Music2 className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading || !url.trim()}
                    className="h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group lg:min-w-[200px]"
                  >
                    <span className="relative z-10 flex items-center">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          Extract Audio
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </div>
              </motion.div>

              {/* Quick Tips */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4"
              >
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Pro Tips:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Works with public posts, reels, and videos</li>
                      <li>• Automatically identifies music and creates Spotify playlists</li>
                      <li>• High-quality audio extraction with metadata</li>
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
          <ErrorAlert message={error} />
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