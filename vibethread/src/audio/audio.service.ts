import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
var url = require('url');
var crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');

@Injectable()
export class AudioService {
  private readonly spotifyClientId: string;
  private readonly spotifyClientSecret: string;
  private readonly redirectUri: string;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
    
    if (!clientId) {
      throw new Error('SPOTIFY_CLIENT_ID is not set in environment variables');
    }
    if (!clientSecret) {
      throw new Error('SPOTIFY_CLIENT_SECRET is not set in environment variables');
    }
    
    this.spotifyClientId = clientId;
    this.spotifyClientSecret = clientSecret;
    this.redirectUri = this.configService.get<string>('SPOTIFY_REDIRECT_URI') || 'http://localhost:3001/spotify-callback';
    
    // Debug logging to verify environment variables are loaded
    console.log('Spotify Client ID loaded:', this.spotifyClientId ? 'Yes' : 'No');
    console.log('Spotify Client Secret loaded:', this.spotifyClientSecret ? 'Yes' : 'No');
    console.log('Spotify Redirect URI:', this.redirectUri);
  }

  async downloadInstagramAudioAsMP3(
    url: string,
    outputDir = './public/audio/downloads',
  ) {
    console.log('Downloading audio from URL:', url);

    // Ensure the output directory exists
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
    } catch (err) {
      console.error('Error creating directory:', err);
    }

    const outputTemplate = path.join(outputDir, 'audio_%(id)s.%(ext)s');

    // Create a Promise to handle the async exec operation
    return new Promise((resolve, reject) => {
      // Check if ffmpeg is installed
      exec('ffmpeg -version', (ffmpegError) => {
        if (ffmpegError) {
          console.error('ffmpeg is not installed or not in PATH');
          reject(
            new Error(
              'ffmpeg is not installed. Please install ffmpeg to extract audio.',
            ),
          );
          return;
        }

        const command = `yt-dlp --cookies src/audio/cookies.txt -x --audio-format mp3 -o "${outputTemplate}" "${url}"`;
        console.log(`Running command: ${command}`);

        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error('Error downloading audio:', error.message);
            reject(error);
            return;
          }
          if (stderr) {
            console.error('stderr:', stderr);
          }

          console.log('✅ MP3(s) downloaded successfully!');
          console.log(stdout);

          // Find the downloaded file(s)
          try {
            const files = fs.readdirSync(outputDir);
            const mp3Files = files.filter((file) => file.endsWith('.mp3'));

            if (mp3Files.length > 0) {
              const filePaths = mp3Files.map((file) =>
                path.join(outputDir, file),
              );

              // Process each file with identify function
              const defaultOptions = {
                host: 'identify-ap-southeast-1.acrcloud.com',
                endpoint: '/v1/identify',
                signature_version: '1',
                data_type: 'audio',
                secure: true,
                access_key: 'bd254743a2ef0cb4252dd406d2207507',
                access_secret: '59a0v1yGoBJvdca6L6YGOxiX2WEFjtRxBwNsr9Vl',
              };

              // Array to store music identification results
              const musicResults: any[] = [];

              // Process each file and collect results
              const identificationPromises = filePaths.map((filePath) => {
                return new Promise((resolveIdentify, rejectIdentify) => {
                  try {
                    const fileData = fs.readFileSync(filePath);
                    console.log('File data read successfully');
                    this.identify(
                      fileData,
                      defaultOptions,
                      (err: Error | null, _httpResponse: any, body: any) => {
                        console.log('Processing file:', filePath);
                        if (err) {
                          console.error('Error identifying audio:', err);
                          rejectIdentify(err);
                        } else if (body?.metadata?.music && body?.metadata?.music?.length > 0) {
                          // Extract important information from each match
                          const musicInfo = body?.metadata?.music?.map((track: any) => {
                            return {
                              title: track?.title || 'Unknown',
                              artists: track?.artists?.map((artist: any) => artist.name) || ['Unknown'],
                              album: track?.album?.name || 'Unknown',
                              duration_ms: track?.duration_ms,
                              score: track?.score,
                              release_date: track?.release_date,
                              // Extract Spotify data if available
                              spotify: track?.external_metadata?.spotify ? {
                                track: track.external_metadata.spotify.track,
                                album: track.external_metadata.spotify.album,
                                artists: track.external_metadata.spotify.artists
                              } : null,
                              // Extract YouTube data if available
                              youtube: track?.external_metadata?.youtube ? {
                                vid: track?.external_metadata?.youtube?.vid
                              } : null,
                              // Include genres if available
                              genres: track?.genres?.map((genre: any) => genre.name) || []
                            };
                          });
                          
                          musicResults.push({
                            filePath,
                            musicInfo
                          });
                          resolveIdentify(musicInfo);
                        } else {
                          console.log('No music data found in response');
                          resolveIdentify(null);
                        }
                      },
                    );
                  } catch (fileErr) {
                    console.error(`Error reading file ${filePath}:`, fileErr);
                    rejectIdentify(fileErr);
                  }
                });
              });

              // Wait for all identifications to complete
              Promise.all(identificationPromises)
                .then(() => {
                  // Delete the files after processing
                  filePaths.forEach(filePath => {
                    try {
                      fs.unlinkSync(filePath);
                      console.log(`Deleted file: ${filePath}`);
                    } catch (deleteErr) {
                      console.error(`Error deleting file ${filePath}:`, deleteErr);
                    }
                  });
                  
                  // Return information about the downloaded files and music identification
                  resolve({
                    success: true,
                    musicData: musicResults
                  });
                })
                .catch((identifyErr) => {
                  console.error('Error during music identification:', identifyErr);
                  
                  // Delete the files even if identification failed
                  filePaths.forEach(filePath => {
                    try {
                      fs.unlinkSync(filePath);
                      console.log(`Deleted file: ${filePath}`);
                    } catch (deleteErr) {
                      console.error(`Error deleting file ${filePath}:`, deleteErr);
                    }
                  });
                  
                  // Still return the music data even if identification failed
                  resolve({
                    success: true,
                    musicData: musicResults,
                    error: identifyErr.message
                  });
                });
            } else {
              reject(new Error('No MP3 files were downloaded'));
            }
          } catch (err) {
            console.error('Error reading directory:', err);
            reject(err);
          }
        });
      });
    });
  }

  async findAudio() {
    var defaultOptions = {
      host: 'identify-ap-southeast-1.acrcloud.com',
      endpoint: '/v1/identify',
      signature_version: '1',
      data_type: 'audio',
      secure: true,
      access_key: 'bd254743a2ef0cb4252dd406d2207507',
      access_secret: '59a0v1yGoBJvdca6L6YGOxiX2WEFjtRxBwNsr9Vl',
    };
  }

  buildStringToSign(
    method,
    uri,
    accessKey,
    dataType,
    signatureVersion,
    timestamp,
  ) {
    return [method, uri, accessKey, dataType, signatureVersion, timestamp].join(
      '\n',
    );
  }

  sign(signString, accessSecret) {
    return crypto
      .createHmac('sha1', accessSecret)
      .update(Buffer.from(signString, 'utf-8'))
      .digest()
      .toString('base64');
  }

  async identify(data: Buffer, options: any, cb: (err: Error | null, _httpResponse: any, body: any) => void) {
    var current_data = new Date();
    var timestamp = current_data.getTime() / 1000;

    var stringToSign = this.buildStringToSign(
      'POST',
      options.endpoint,
      options.access_key,
      options.data_type,
      options.signature_version,
      timestamp,
    );

    var signature = this.sign(stringToSign, options.access_secret);

    // Create form data
    var form = new FormData();
    // Use Buffer directly instead of Blob
    form.append('sample', data, {
      filename: 'sample.bin',
      contentType: 'application/octet-stream',
    });
    form.append('sample_bytes', data.length);
    form.append('access_key', options.access_key);
    form.append('data_type', options.data_type);
    form.append('signature_version', options.signature_version);
    form.append('signature', signature);
    form.append('timestamp', timestamp);

    axios
      .post('http://' + options.host + options.endpoint, form, {
        headers: form.getHeaders(), // Use form.getHeaders() instead of manually setting Content-Type
      })
      .then(function (response) {
        console.log('Response:', JSON.stringify(response.data, null, 2));
        if (response.data && response.data.metadata) {
          console.log(
            'Music Array:',
            JSON.stringify(response.data.metadata.music, null, 2),
          );
          cb(null, response, response.data);
        } else {
          console.log('No music data found in response');
          cb(null, response, response.data);
        }
      })
      .catch(function (error) {
        console.error('Error:', error.message);
        cb(error, null, null);
      });
  }

  // Spotify OAuth and Playlist Creation Methods
  async generateSpotifyAuthUrl(): Promise<string> {
    console.log('Checking Spotify credentials...');
    console.log('Client ID:', this.spotifyClientId ? 'Present' : 'Missing');
    console.log('Client Secret:', this.spotifyClientSecret ? 'Present' : 'Missing');
    console.log('Redirect URI:', this.redirectUri);
    
    if (!this.spotifyClientId) {
      throw new Error('Spotify Client ID not configured');
    }

    const scopes = [
      'playlist-modify-public',
      'playlist-modify-private',
      'user-read-private'
    ].join(' ');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.spotifyClientId,
      scope: scopes,
      redirect_uri: this.redirectUri,
      state: crypto.randomBytes(16).toString('hex')
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    console.log('Generated Spotify auth URL:', authUrl);
    
    return authUrl;
  }

  async exchangeSpotifyCode(code: string): Promise<any> {
    if (!this.spotifyClientId || !this.spotifyClientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri
    });

    const authHeader = Buffer.from(`${this.spotifyClientId}:${this.spotifyClientSecret}`).toString('base64');

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', params, {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error exchanging Spotify code:', error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  async getSpotifyUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting Spotify user profile:', error.response?.data || error.message);
      throw new Error('Failed to get user profile');
    }
  }

  async createSpotifyPlaylist(
    accessToken: string,
    playlistName: string,
    playlistDescription?: string,
    isPublic: boolean = false,
    selectedTracks: Array<{
      spotifyId: string;
      title: string;
      artists: string;
    }> = []
  ): Promise<any> {
    try {
      // Get user profile to get user ID
      const userProfile = await this.getSpotifyUserProfile(accessToken);
      const userId = userProfile.id;

      // Create the playlist
      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName,
          description: playlistDescription || 'Created with VibeThread',
          public: isPublic
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const playlist = playlistResponse.data;

      // Add tracks to the playlist if any are provided
      if (selectedTracks.length > 0) {
        const trackUris = selectedTracks
          .filter(track => track.spotifyId)
          .map(track => `spotify:track:${track.spotifyId}`);

        if (trackUris.length > 0) {
          await axios.post(
            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
            {
              uris: trackUris
            },
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }
      }

      return {
        id: playlist.id,
        name: playlist.name,
        url: playlist.external_urls.spotify,
        tracksAdded: selectedTracks.length
      };
    } catch (error) {
      console.error('Error creating Spotify playlist:', error.response?.data || error.message);
      throw new Error('Failed to create Spotify playlist');
    }
  }
}