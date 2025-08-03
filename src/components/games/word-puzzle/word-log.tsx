'use client';

interface WordLogEntry {
  word: string;
  userAnswer: string;
  level: number;
  isCorrect: boolean;
}

interface WordLogProps {
  wordLog: WordLogEntry[];
}

// Component to display the session log of answered words
export const WordLog = ({ wordLog }: WordLogProps) => {
  if (wordLog.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-200 mb-2">Session Log</h3>
        <p className="text-gray-400 text-sm">No words answered yet in this session.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-gray-200 mb-3">Session Log</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {wordLog.map((entry, index) => (
          <div 
            key={index}
            className={`p-2 rounded border-l-4 ${
              entry.isCorrect 
                ? 'bg-green-900/20 border-green-500' 
                : 'bg-red-900/20 border-red-500'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <span className="text-sm text-gray-400">Level {entry.level}:</span>
                <span className="ml-2 font-medium text-gray-200">{entry.word}</span>
              </div>
              {entry.userAnswer !== entry.word && (
                <div className="text-right">
                  <span className="text-sm text-gray-400">You:</span>
                  <span className={`ml-1 font-medium ${
                    entry.isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {entry.userAnswer}
                  </span>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {entry.isCorrect ? '✅ Correct' : '❌ Incorrect'}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Total: {wordLog.length}</span>
          <span>Correct: {wordLog.filter(entry => entry.isCorrect).length}</span>
          <span>Accuracy: {Math.round((wordLog.filter(entry => entry.isCorrect).length / wordLog.length) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}; 