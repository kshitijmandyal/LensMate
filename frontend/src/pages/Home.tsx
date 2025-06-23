import { useState } from 'react';
import UploadZone from '../components/UploadZone';
import FeedbackPanel from '../components/FeedbackPanel';

export default function Home() {
  const [feedback, setFeedback] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // This function will be called by UploadZone when a new image is uploaded
  const handleUpload = (data: any, imageUrl: string) => {
    setFeedback(data);
    setCurrentImage(imageUrl);
  };

  const handleNewUpload = () => {
    setFeedback(null);
    setCurrentImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-indigo-600">
        LensMate AI
      </h1>
      
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        {!feedback ? (
          <UploadZone 
            setFeedback={handleUpload}
          />
        ) : (
          <FeedbackPanel 
            image={currentImage} 
            feedback={feedback} 
            onReset={handleNewUpload}
          />
        )}
      </div>
    </div>
  );
}
