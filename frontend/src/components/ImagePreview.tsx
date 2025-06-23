import type { FC } from 'react';

type ImagePreviewProps = {
  imageUrl: string;
  file?: File;
  className?: string;
};

const ImagePreview: FC<ImagePreviewProps> = ({ imageUrl, file, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <img 
        src={imageUrl} 
        alt="Preview" 
        className="w-full h-auto rounded-lg shadow-md object-contain max-h-96"
      />
      {file && (
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {Math.round(file.size / 1024)} KB
        </div>
      )}
    </div>
  );
};

export default ImagePreview;

// Usage example
// <ImagePreview imageUrl={preview} file={file} className="mb-4" />