import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import ImagePreview from './ImagePreview';
import LoadingSpinner from './LoadingSpinner';
import { analyzeImage } from '../services/api';

type UploadZoneProps = {
  setFeedback: (data: any, imageUrl: string) => void;
};

export default function UploadZone({ setFeedback }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0];
      if (!file) return;
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setIsLoading(true);
      setError(null);

      try {
        const data = await analyzeImage(file);
        setFeedback(data, imageUrl);
      } catch (err) {
        setError('Upload failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {preview ? (
        <ImagePreview imageUrl={preview} className="mb-4" />
      ) : (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">Drag & drop a photo here, or click to browse</p>
          <p className="text-sm text-gray-400 mt-2">Supports JPEG, PNG, WEBP</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          Error: {error}
        </div>
      )}
    </div>
  );
}