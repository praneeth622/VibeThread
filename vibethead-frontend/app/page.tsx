import Hero from '@/components/hero';
import ExtractorForm from '@/components/extractor-form';
import { MusicPattern } from '@/components/music-pattern';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 dark:from-purple-900 dark:via-indigo-950 dark:to-blue-950" />
      
      {/* Decorative pattern */}
      <MusicPattern className="absolute inset-0 opacity-5" />
      
      <div className="relative z-10 w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Hero />
        <ExtractorForm />
      </div>
    </main>
  );
}