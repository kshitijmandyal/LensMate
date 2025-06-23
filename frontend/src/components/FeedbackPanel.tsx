import { FaTools, FaPalette, FaLightbulb, FaRegStar } from "react-icons/fa";

type FeedbackPanelProps = {
  image: string | null;
  feedback: {
    photograph_type?: string;
    technical_aspects?: Array<{ aspect: string; rating: number; comment: string }>;
    artistic_merits?: Array<{ aspect: string; rating: number; comment: string }>;
    improvement_suggestions?: string[];
    overall_assessment?: string;
    skill_level?: string;
  };
  onReset: () => void;
};

const RatingBar = ({ rating }: { rating: number }) => {
  const width = `${rating * 10}%`;
  let color;
  if (rating <= 3) color = 'bg-red-500';
  else if (rating <= 6) color = 'bg-yellow-400';
  else color = 'bg-green-500';

  return (
    <div className="flex items-center gap-2">
      <span className="w-12 text-right font-semibold text-gray-700">{rating}/10</span>
      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden border border-gray-300 shadow-inner">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 hover:brightness-110`}
          style={{ width: width === '0%' ? '8%' : width, minWidth: 24 }}
        />
      </div>
    </div>
  );
};

export default function FeedbackPanel({ image, feedback, onReset }: FeedbackPanelProps) {
  const renderRatingSection = (
    title: string,
    items?: Array<{ aspect: string; rating: number; comment: string }>,
    icon?: React.ReactNode
  ) => {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
      <div className="mb-8 bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-xl font-bold text-indigo-600">{title}</h3>
        </div>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <strong className="w-44 text-gray-700">{item.aspect}:</strong>
              <div className="flex-1">
                <RatingBar rating={item.rating} />
                <p className="mt-1 text-gray-600">{item.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSuggestions = (suggestions: string[]) => (
    <div className="mb-8 bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <FaLightbulb className="text-yellow-400" />
        <h3 className="text-xl font-bold text-indigo-600">Improvement Suggestions</h3>
      </div>
      <ul className="list-decimal pl-5 space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="text-gray-700">{suggestion}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2 flex justify-center">
          {image && (
            <img
              src={image}
              alt="Uploaded"
              className="rounded-xl shadow-lg border border-gray-200 bg-gray-100"
              style={{
                width: "350px",
                height: "250px",
                objectFit: "contain", // This preserves aspect ratio and fits image inside the box
                background: "#f3f4f6"
              }}
            />
          )}
        </div>
        <div className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
            <FaRegStar className="text-yellow-400" /> AI Feedback
          </h2>

          {typeof feedback.photograph_type === "string" && feedback.photograph_type && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-1 text-indigo-600">Photograph Type:</h3>
              <div className="text-gray-800 capitalize font-normal text-base ml-1">{feedback.photograph_type}</div>
            </div>
          )}

          {Array.isArray(feedback?.technical_aspects) &&
            typeof feedback.technical_aspects[0] === "object" &&
            renderRatingSection(
              "Technical Aspects",
              feedback.technical_aspects as Array<{ aspect: string; rating: number; comment: string }>,
              <FaTools className="text-indigo-500" />
            )
          }
          {Array.isArray(feedback?.artistic_merits) &&
            feedback.artistic_merits.length > 0 &&
            typeof feedback.artistic_merits[0] === "object" &&
            renderRatingSection(
              "Artistic Merits",
              feedback.artistic_merits as Array<{ aspect: string; rating: number; comment: string }>,
              <FaPalette className="text-pink-400" />
            )
          }
          {Array.isArray(feedback.improvement_suggestions) && renderSuggestions(feedback.improvement_suggestions as string[])}

          <div className="mt-8 bg-green-50 rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <FaRegStar className="text-green-400" />
              <h3 className="text-xl font-bold text-indigo-600 mb-0">Overall Assessment</h3>
            </div>
            {typeof feedback.overall_assessment === "string" && (
              <p className="text-gray-700">{feedback.overall_assessment}</p>
            )}
            {typeof feedback.skill_level === "string" && (
              <p className="mt-2 font-medium">
                Skill Level: <span className="text-indigo-600">{feedback.skill_level}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="w-full flex justify-center">
        <button
          onClick={onReset}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium shadow-md hover:shadow-lg"
        >
          Analyze Another
        </button>
      </div>
    </div>
  );
}