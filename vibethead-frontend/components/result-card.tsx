"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Volume2, Play, Pause, Music, ExternalLink } from 'lucide-react';
import { AudioResult } from '@/lib/types';

interface ResultCardProps {
  results: AudioResult[];
}

export const ResultCard = ({ results }: ResultCardProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<{[key: string]: HTMLAudioElement | null}>({});

  const handlePlay = (result: AudioResult) => {
    // Stop currently playing audio if any
    if (playingId && audioElements[playingId]) {
      audioElements[playingId]?.pause();
    }

    if (playingId === result.id) {
      // Toggle pause/play if it's the same track
      setPlayingId(null);
    } else {
      // Create audio element if it doesn't exist
      if (!audioElements[result.id]) {
        const audio = new Audio(result.url);
        audio.addEventListener('ended', () => setPlayingId(null));
        setAudioElements(prev => ({ ...prev, [result.id]: audio }));
        audio.play();
      } else {
        audioElements[result.id]?.play();
      }
      setPlayingId(result.id);
    }
  };

  const openSpotify = (spotifyId: string) => {
    window.open(`https://open.spotify.com/track/${spotifyId}`, '_blank');
  };

  const openYoutube = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  };

  return (
    <div className="animate-fade-in">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardTitle className="flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Extracted Audio ({results.length} tracks)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {results.map((result) => (
            <div 
              key={result.id}
              className="p-4 border border-white/10 rounded-lg mb-3 bg-white/5 hover:bg-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex-1">
                <div className="font-medium text-white">{result.title}</div>
                {result.artists && (
                  <div className="text-sm text-white/70">
                    <span className="flex items-center">
                      <Music className="w-3 h-3 mr-1" />
                      {result.artists}
                    </span>
                  </div>
                )}
                {result.album && (
                  <div className="text-sm text-white/70">
                    Album: {result.album}
                  </div>
                )}
                <div className="text-sm text-white/70">Duration: {result.duration}</div>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {/* <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => handlePlay(result)}
                >
                  {playingId === result.id ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {playingId === result.id ? 'Pause' : 'Play'}
                </Button> */}
                
                {result.youtubeId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => openYoutube(result.youtubeId!)}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    YouTube
                  </Button>
                )}
                
                {result.spotifyId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                    onClick={() => openSpotify(result.spotifyId!)}
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Spotify
                  </Button>
                )}
                
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = result.url;
                    link.download = `${result.title}.mp3`;
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
