"use client";

import { useState } from 'react';
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
        description: "Please enter an Instagram URL",
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
        description: "Please enter a valid Instagram post URL",
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

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Paste Instagram, YouTube, or TikTok URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-white/20 border-white/20 text-white placeholder:text-white/60 focus:ring-purple-400 focus:border-purple-400 transition-all"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !url.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 dark:hover:shadow-purple-700/25 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                {isLoading ? 'Processing...' : 'Extract Audio'}
                <span className="ml-2">🎵</span>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && <LoadingIndicator />}
      {error && <ErrorAlert message={error} />}
      {results && results.length > 0 && <ResultCard results={results} />}
    </div>
  );
}
