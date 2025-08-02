"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Music, CheckCircle, ExternalLink, Copy, Sparkles, Heart, Star } from 'lucide-react';
import { AudioResult } from '@/lib/types';
import { generateSpotifyAuthUrl, exchangeSpotifyCode, createSpotifyPlaylist } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface SpotifyPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTracks: AudioResult[];
}

export const SpotifyPlaylistModal = ({ isOpen, onClose, selectedTracks }: SpotifyPlaylistModalProps) => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'form' | 'auth' | 'creating' | 'success'>('form');
  const [createdPlaylist, setCreatedPlaylist] = useState<{url: string, name: string, tracksAdded: number} | null>(null);
  const { toast } = useToast();

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      toast({
        title: "Oops! 🌸",
        description: "Please enter a magical playlist name",
        variant: "destructive",
      });
      return;
    }

    if (selectedTracks.length === 0) {
      toast({
        title: "No tracks selected ✨",
        description: "Please select some beautiful tracks first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAuthStep('auth');

    try {
      // Step 1: Generate Spotify auth URL
      const authUrl = await generateSpotifyAuthUrl();
      
      // Step 2: Open Spotify authorization in a new window
      const authWindow = window.open(
        authUrl,
        'spotify-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!authWindow) {
        throw new Error('Failed to open authorization window. Please allow popups.');
      }

      // Step 3: Listen for the authorization callback
      const handleAuthMessage = async (event: MessageEvent) => {
        console.log('Received message in parent window:', event.data);
        console.log('Message origin:', event.origin);
        console.log('Current window origin:', window.location.origin);
        
        // Temporarily allow any origin for debugging
        // if (event.origin !== window.location.origin) return;

        if (event.data.type === 'SPOTIFY_AUTH_SUCCESS') {
          const { code } = event.data;
          authWindow.close();
          window.removeEventListener('message', handleAuthMessage);

          try {
            setAuthStep('creating');
            
            // Step 4: Exchange code for access token
            const tokens = await exchangeSpotifyCode(code);
            
            // Step 5: Create playlist with selected tracks
            const tracksWithSpotifyId = selectedTracks.filter(track => track.spotifyId);
            
            if (tracksWithSpotifyId.length === 0) {
              throw new Error('None of the selected tracks have Spotify IDs');
            }

            const playlist = await createSpotifyPlaylist(
              tokens.access_token,
              playlistName,
              playlistDescription,
              isPublic,
              tracksWithSpotifyId.map(track => ({
                spotifyId: track.spotifyId!,
                title: track.title,
                artists: track.artists || 'Unknown'
              }))
            );

            // Set success state instead of showing toast
            setCreatedPlaylist({
              url: playlist.url,
              name: playlist.name,
              tracksAdded: tracksWithSpotifyId.length
            });
            setAuthStep('success');
            setIsLoading(false);

          } catch (error) {
            console.error('Error creating playlist:', error);
            toast({
              title: "Error 💔",
              description: error instanceof Error ? error.message : 'Failed to create playlist',
              variant: "destructive",
            });
            setIsLoading(false);
            setAuthStep('form');
          }
        } else if (event.data.type === 'SPOTIFY_AUTH_ERROR') {
          authWindow.close();
          window.removeEventListener('message', handleAuthMessage);
          toast({
            title: "Authorization failed 😢",
            description: "Spotify authorization was not successful",
            variant: "destructive",
          });
          setIsLoading(false);
          setAuthStep('form');
        }
      };

      window.addEventListener('message', handleAuthMessage);

      // Check if the auth window was closed manually
      const checkClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleAuthMessage);
          setIsLoading(false);
          setAuthStep('form');
        }
      }, 1000);

    } catch (error) {
      console.error('Error starting Spotify auth:', error);
      toast({
        title: "Error starting auth 🌸",
        description: error instanceof Error ? error.message : 'Failed to start Spotify authorization',
        variant: "destructive",
      });
      setIsLoading(false);
      setAuthStep('form');
    }
  };

  const resetForm = () => {
    setPlaylistName('');
    setPlaylistDescription('');
    setIsPublic(false);
    setIsLoading(false);
    setAuthStep('form');
    setCreatedPlaylist(null);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied! ✨",
        description: "Playlist URL copied to clipboard with love",
      });
    } catch (err) {
      toast({
        title: "Copy failed 💔",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const tracksWithSpotify = selectedTracks.filter(track => track.spotifyId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md glass-pastel border-pink-300/30 shadow-pastel-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-gray-800">
            {authStep === 'success' ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                </motion.div>
                Playlist Created Successfully! 🎉
              </>
            ) : (
              <>
                <Music className="w-5 h-5 mr-2 text-pink-500" />
                Create Magical Spotify Playlist
                <motion.div
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="ml-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </motion.div>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {authStep === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="text-sm text-gray-700 bg-pastel-cool p-3 rounded-xl border border-purple-300/30 flex items-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
              </motion.div>
              {tracksWithSpotify.length} of {selectedTracks.length} selected tracks have Spotify IDs
            </div>

            <div className="space-y-2">
              <Label htmlFor="playlist-name" className="text-gray-800 font-medium">
                Playlist Name ✨
              </Label>
              <Input
                id="playlist-name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="My Magical VibeThread Playlist"
                className="glass border-pink-300/40 text-gray-800 placeholder:text-gray-600 focus-pastel rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playlist-description" className="text-gray-800 font-medium">
                Description (optional) 💖
              </Label>
              <Textarea
                id="playlist-description"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Playlist created with love using VibeThread ✨"
                className="glass border-purple-300/40 text-gray-800 placeholder:text-gray-600 resize-none focus-pastel-lavender rounded-xl"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 p-3 glass rounded-xl border border-blue-300/30">
              <Checkbox
                id="is-public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                className="border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400"
              />
              <Label htmlFor="is-public" className="text-gray-800 cursor-pointer font-medium flex items-center">
                Make playlist public
                <Heart className="w-4 h-4 ml-2 text-pink-400" />
              </Label>
            </div>

            <div className="bg-pastel-warm p-4 rounded-xl border border-pink-300/30">
              <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                <Music className="w-4 h-4 mr-2 text-pink-500" />
                Selected Tracks:
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-2"
                >
                  <Star className="w-4 h-4 text-yellow-400" />
                </motion.div>
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tracksWithSpotify.map((track, index) => (
                  <motion.div 
                    key={track.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-xs text-gray-700 flex items-center p-2 bg-white/50 rounded-lg"
                  >
                    <span className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 mr-2 text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="flex-1">
                      {track.title} - {track.artists}
                    </span>
                    <Heart className="w-3 h-3 text-pink-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {authStep === 'auth' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-300 to-emerald-300 rounded-full flex items-center justify-center shadow-pastel-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 w-16 h-16 mx-auto border-4 border-green-300/40 rounded-full"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center">
              Authorizing with Spotify
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="ml-2"
              >
                <Sparkles className="w-5 h-5 text-green-400" />
              </motion.div>
            </h3>
            <p className="text-sm text-gray-700">
              A magical window should have opened. If not, please allow popups and try again! ✨
            </p>
          </motion.div>
        )}

        {authStep === 'creating' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-300 to-pink-300 rounded-full flex items-center justify-center shadow-pastel-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 w-16 h-16 mx-auto border-4 border-purple-300/40 rounded-full"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center">
              Creating your magical playlist
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="ml-2"
              >
                <Heart className="w-5 h-5 text-pink-400" />
              </motion.div>
            </h3>
            <p className="text-sm text-gray-700">This will only take a moment... ✨</p>
          </motion.div>
        )}

        {authStep === 'success' && createdPlaylist && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-6"
          >
            <div className="relative mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 mx-auto bg-gradient-to-r from-green-300 to-emerald-300 rounded-full flex items-center justify-center shadow-pastel-lg"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-20 h-20 mx-auto border-4 border-green-300/40 rounded-full"
              />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              🎉 Playlist Created with Love! 
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="ml-2"
              >
                <Heart className="w-5 h-5 text-pink-400" />
              </motion.div>
            </h3>
            
            <div className="bg-pastel-cool border border-green-300/30 rounded-xl p-4 mb-6">
              <p className="text-green-700 font-medium mb-1 flex items-center justify-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                "{createdPlaylist.name}"
              </p>
              <p className="text-sm text-gray-700">
                {createdPlaylist.tracksAdded} magical tracks added successfully ✨
              </p>
            </div>

            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => window.open(createdPlaylist.url, '_blank')}
                  className="w-full bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-gray-800 font-medium py-3 rounded-xl transition-all duration-300 shadow-pastel-lg hover:shadow-pastel-xl btn-shimmer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Spotify
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(createdPlaylist.url)}
                  className="w-full border-pink-300 text-pink-700 hover:bg-pink-100 hover:text-pink-800 py-3 rounded-xl transition-all duration-300"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Playlist URL
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        <DialogFooter>
          {authStep === 'form' && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="border-gray-400 text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePlaylist}
                disabled={isLoading || !playlistName.trim() || tracksWithSpotify.length === 0}
                className="bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-gray-800 rounded-xl btn-shimmer"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2"
                    >
                      <Loader2 className="w-4 h-4" />
                    </motion.div>
                    Creating Magic...
                  </>
                ) : (
                  <>
                    Create Playlist
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </>
          )}
          
          {authStep === 'success' && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-800 rounded-xl btn-shimmer"
              >
                Done ✨
              </Button>
            </motion.div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};