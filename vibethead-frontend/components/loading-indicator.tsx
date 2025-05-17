export const LoadingIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-200 border-b-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
      </div>
      <p className="mt-4 text-white font-medium">Extracting your audio...</p>
      <p className="text-white/70 text-sm mt-2">This may take a moment depending on the size of the video</p>
      
      <div className="mt-6 flex space-x-1">
        <div className="w-2 h-8 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-8 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <div className="w-2 h-8 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        <div className="w-2 h-8 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
      </div>
    </div>
  );
};