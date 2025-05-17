import React from 'react';
import { Headphones, Music, Instagram } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="text-center space-y-4 mb-8 animate-fade-in">
      <div className="flex items-center justify-center mb-2">
        <Music className="h-8 w-8 text-white mr-2" />
        <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Vibe-Thread
        </h1>
        <Instagram className="h-8 w-8 text-white ml-2" />
      </div>
      
      <p className="text-lg text-white/80 max-w-2xl mx-auto">
        Extract audio from Instagram posts with a single click. 
        Just paste the link and let the magic happen!
      </p>
      
      <div className="flex items-center justify-center space-x-2 text-white/70 text-sm mt-2">
        <Headphones className="h-4 w-4" />
        <span>Transform videos into downloadable audio files</span>
      </div>
    </div>
  );
};

export default Hero;