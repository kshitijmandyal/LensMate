import { useState } from 'react';
import { analyzeImage } from '../services/api';

const useImageAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const feedback = await analyzeImage(file);
      return feedback;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyze, isLoading, error };
};

export default useImageAnalysis;