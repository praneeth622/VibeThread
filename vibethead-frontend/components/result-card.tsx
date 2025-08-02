"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Volume2, Play, Pause, Music, ExternalLink, ListMusic, Sparkles, Heart, Star } from 'lucide-react';
import { AudioResult } from '@/lib/types';
import { SpotifyPlaylistModal } from './spotify-playlist-modal';

interface ResultCardProps {
  results: AudioResult[];
}

export const ResultCard = ({ results }: ResultCardProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<{[key: string]: HTMLAudioElement | null}>({});
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

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

  const handleTrackSelection = (trackId: string, checked: boolean) => {
    const newSelected = new Set(selectedTracks);
    if (checked) {
      newSelected.add(trackId);
    } else {
      newSelected.delete(trackId);
    }
    setSelectedTracks(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTracks(new Set(results.map(r => r.id)));
    } else {
      setSelectedTracks(new Set());
    }
  };

  const getSelectedResults = () => {
    return results.filter(result => selectedTracks.has(result.id));
  };

  const tracksWithSpotify = results.filter(result => result.spotifyId);
  const selectedTracksWithSpotify = getSelectedResults().filter(result => result.spotifyId);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      <Card className="glass-pastel border-pink-300/30 overflow-hidden shadow-pastel-xl hover-lift">
        <CardHeader className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20" />
          <motion.div 
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl"
          />
          <CardTitle className="relative z-10 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <Volume2 className="w-6 h-6 mr-3" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 w-6 h-6 mr-3 bg-pink-300/30 rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center">
                  Extracted Audio 
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="ml-2"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                </h3>
                <p className="text-sm text-gray-700">{results.length} magical tracks found</p>
              </div>
            </div>
            {tracksWithSpotify.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedTracks.size === results.length}
                    onCheckedChange={handleSelectAll}
                    className="border-gray-600 data-[state=checked]:bg-pink-400 data-[state=checked]:border-pink-400"
                  />
                  <label htmlFor="select-all" className="text-sm cursor-pointer font-medium">
                    Select All
                  </label>
                </div>
                {selectedTracks.size > 0 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      size="sm"
                      onClick={() => setIsPlaylistModalOpen(true)}
                      className="bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-gray-800 shadow-pastel hover:shadow-pastel-lg transition-all duration-300 btn-shimmer"
                    >
                      <ListMusic className="w-4 h-4 mr-2" />
                      Create Playlist ({selectedTracks.size})
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="ml-1"
                      >
                        <Sparkles className="w-3 h-3" />
                      </motion.div>
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="p-5 border border-pink-200/50 rounded-2xl glass-pastel hover:border-pink-300/70 transition-all duration-300 hover:shadow-pastel-lg hover-lift">
                  <div className="flex items-start gap-4">
                    {/* Checkbox for track selection */}
                    {result.spotifyId && (
                      <div className="flex items-center pt-2">
                        <Checkbox
                          id={`track-${result.id}`}
                          checked={selectedTracks.has(result.id)}
                          onCheckedChange={(checked) => handleTrackSelection(result.id, checked as boolean)}
                          className="border-pink-300 data-[state=checked]:bg-pink-400 data-[state=checked]:border-pink-400"
                        />
                      </div>
                    )}
                    
                    {/* Track info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-lg mb-1 truncate group-hover:text-pink-600 transition-colors flex items-center">
                            {result.title}
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="ml-2"
                            >
                              <Heart className="w-4 h-4 text-pink-400" />
                            </motion.div>
                          </h4>
                          {result.artists && (
                            <div className="flex items-center text-gray-700 mb-2">
                              <Music className="w-4 h-4 mr-2 text-purple-400" />
                              <span className="truncate">{result.artists}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Play button */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlay(result)}
                            className="ml-4 text-pink-500 hover:text-gray-800 hover:bg-pink-100 rounded-full w-10 h-10 p-0 shadow-pastel"
                          >
                            {playingId === result.id ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </Button>
                        </motion.div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        {result.album && (
                          <span className="flex items-center px-2 py-1 bg-blue-100 rounded-full">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                            Album: {result.album}
                          </span>
                        )}
                        <span className="flex items-center px-2 py-1 bg-green-100 rounded-full">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                          Duration: {result.duration}
                        </span>
                      </div>
                      
                      {result.spotifyId && (
                        <div className="flex items-center text-green-600 text-sm mb-4 px-3 py-2 bg-green-100 rounded-full w-fit">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                          </motion.div>
                          <span className="font-medium">Available on Spotify</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {result.youtubeId && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400 transition-all duration-300 rounded-xl"
                          onClick={() => openYoutube(result.youtubeId!)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          YouTube
                        </Button>
                      </motion.div>
                    )}
                    
                    {result.spotifyId && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-green-300 text-green-600 hover:bg-green-100 hover:border-green-400 transition-all duration-300 rounded-xl"
                          onClick={() => openSpotify(result.spotifyId!)}
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                          </svg>
                          Spotify
                        </Button>
                      </motion.div>
                    )}
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-800 shadow-pastel hover:shadow-pastel-lg transition-all duration-300 rounded-xl btn-shimmer"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = result.url;
                          link.download = `${result.title}.mp3`;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {tracksWithSpotify.length === 0 && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center py-8"
            >
              <div className="glass-pastel rounded-2xl p-8 border border-purple-300/30 shadow-pastel">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Music className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center">
                  No Spotify Integration Available
                  <motion.div
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="ml-2"
                  >
                    <Star className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                </h3>
                <p className="text-gray-700 mb-4">
                  These tracks don't have Spotify IDs, so playlist creation isn't available.
                </p>
                <p className="text-sm text-gray-600 flex items-center justify-center">
                  You can still download the beautiful audio files directly
                  <Heart className="w-4 h-4 ml-2 text-pink-400" />
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Spotify Playlist Modal */}
      <SpotifyPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        selectedTracks={getSelectedResults()}
      />
    </motion.div>
  );
};