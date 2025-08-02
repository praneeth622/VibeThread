"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Music, CheckCircle, ExternalLink, Copy, Sparkles } from 'lucide-react';
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
        title: "Error",
        description: "Please enter a playlist name",
        variant: "destructive",
      });
      return;
    }

    if (selectedTracks.length === 0) {
      toast({
        title: "Error",
        description: "No tracks selected",
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
              title: "Error",
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
            title: "Error",
            description: "Spotify authorization failed",
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
        title: "Error",
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
        title: "Copied!",
        description: "Playlist URL copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const tracksWithSpotify = selectedTracks.filter(track => track.spotifyId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            {authStep === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Playlist Created Successfully!
              </>
            ) : (
              <>
                <Music className="w-5 h-5 mr-2" />
                Create Spotify Playlist
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {authStep === 'form' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-300 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
              <Sparkles className="w-4 h-4 inline mr-2 text-purple-400" />
              {tracksWithSpotify.length} of {selectedTracks.length} selected tracks have Spotify IDs
            </div>

            <div className="space-y-2">
              <Label htmlFor="playlist-name" className="text-white">
                Playlist Name *
              </Label>
              <Input
                id="playlist-name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="My VibeThread Playlist"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playlist-description" className="text-white">
                Description (optional)
              </Label>
              <Textarea
                id="playlist-description"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Playlist created with VibeThread"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 resize-none focus:ring-purple-500 focus:border-purple-500"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                className="border-gray-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <Label htmlFor="is-public" className="text-white cursor-pointer">
                Make playlist public
              </Label>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                <Music className="w-4 h-4 mr-2 text-purple-400" />
                Selected Tracks:
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tracksWithSpotify.map((track, index) => (
                  <div key={track.id} className="text-xs text-gray-300 flex items-center">
                    <span className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 mr-2 text-xs">
                      {index + 1}
                    </span>
                    <span className="flex-1">
                      {track.title} - {track.artists}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {authStep === 'auth' && (
          <div className="text-center py-8">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-green-400/30 rounded-full animate-pulse" />
            </div>
            <p className="text-white font-medium mb-2">Authorizing with Spotify...</p>
            <p className="text-sm text-gray-400">
              A new window should have opened. If not, please allow popups and try again.
            </p>
          </div>
        )}

        {authStep === 'creating' && (
          <div className="text-center py-8">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-purple-400/30 rounded-full animate-pulse" />
            </div>
            <p className="text-white font-medium mb-2">Creating your Spotify playlist...</p>
            <p className="text-sm text-gray-400">This will only take a moment</p>
          </div>
        )}

        {authStep === 'success' && createdPlaylist && (
          <div className="text-center py-6">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-green-400/30 rounded-full animate-pulse" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              🎉 Playlist Created!
            </h3>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <p className="text-green-400 font-medium mb-1">
                "{createdPlaylist.name}"
              </p>
              <p className="text-sm text-gray-300">
                {createdPlaylist.tracksAdded} tracks added successfully
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => window.open(createdPlaylist.url, '_blank')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Spotify
              </Button>
              
              <Button
                variant="outline"
                onClick={() => copyToClipboard(createdPlaylist.url)}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white py-3 rounded-lg transition-all duration-300"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Playlist URL
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {authStep === 'form' && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePlaylist}
                disabled={isLoading || !playlistName.trim() || tracksWithSpotify.length === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Playlist'
                )}
              </Button>
            </>
          )}
          
          {authStep === 'success' && (
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};