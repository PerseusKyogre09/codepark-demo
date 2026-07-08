import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { apiClient } from '../../services/api';

interface DiffLine {
  type: 'add' | 'remove' | 'context' | 'header';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

interface DiffViewerProps {
  filePath: string;
  onClose: () => void;
  sessionId: string;
}

export function DiffViewer({ filePath, onClose, sessionId }: DiffViewerProps) {
  const { themeColors } = useTheme();
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiff();
  }, [filePath, sessionId]);

  const fetchDiff = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.getGitDiff(sessionId, filePath);
      const parsedDiff = parseGitDiff(data.diff);
      setDiffLines(parsedDiff);
    } catch (err: any) {
      console.error('Error fetching diff:', err);
      setError(err.message || 'Failed to fetch diff');
    } finally {
      setLoading(false);
    }
  };

  const parseGitDiff = (diffText: string): DiffLine[] => {
    const lines = diffText.split('\n');
    const result: DiffLine[] = [];
    let oldLineNumber = 0;
    let newLineNumber = 0;

    for (const line of lines) {
      if (line.startsWith('@@')) {
        // Hunk header
        const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
        if (match) {
          oldLineNumber = parseInt(match[1]) - 1;
          newLineNumber = parseInt(match[2]) - 1;
        }
        result.push({ type: 'header', content: line });
      } else if (line.startsWith('+')) {
        newLineNumber++;
        result.push({
          type: 'add',
          content: line.substring(1),
          newLineNumber
        });
      } else if (line.startsWith('-')) {
        oldLineNumber++;
        result.push({
          type: 'remove',
          content: line.substring(1),
          oldLineNumber
        });
      } else if (line.startsWith(' ')) {
        oldLineNumber++;
        newLineNumber++;
        result.push({
          type: 'context',
          content: line.substring(1),
          oldLineNumber,
          newLineNumber
        });
      } else if (line.startsWith('diff --git') || line.startsWith('index ') || line.startsWith('---') || line.startsWith('+++')) {
        result.push({ type: 'header', content: line });
      }
    }

    return result;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4 h-4/5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: themeColors.text }}>
              Loading diff...
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4 h-4/5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: themeColors.text }}>
              Error loading diff
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4 h-4/5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: themeColors.text }}>
            {filePath}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto border rounded-lg" style={{ borderColor: themeColors.border, overscrollBehavior: 'none' }}>
          <div className="grid grid-cols-2 min-h-full">
            {/* Old file (left side) */}
            <div className="border-r" style={{ borderColor: themeColors.border }}>
              <div className="sticky top-0 bg-gray-100 dark:bg-gray-700 px-3 py-2 border-b text-sm font-medium" style={{ borderColor: themeColors.border, color: themeColors.text }}>
                Old
              </div>
              <div className="font-mono text-sm">
                {diffLines.map((line, index) => {
                  if (line.type === 'header') {
                    return (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 px-3 py-1 text-gray-500 text-xs border-b" style={{ borderColor: themeColors.border }}>
                        {line.content}
                      </div>
                    );
                  }

                  if (line.type === 'add') {
                    return (
                      <div key={index} className="flex">
                        <div className="w-12 text-right pr-2 text-gray-400 bg-gray-50 dark:bg-gray-800 border-r" style={{ borderColor: themeColors.border }}>
                          {/* Empty for additions */}
                        </div>
                        <div className="flex-1 px-3 py-0.5 bg-green-50 dark:bg-green-900/20">
                          {/* Empty for additions */}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={index} className="flex">
                      <div className="w-12 text-right pr-2 text-gray-400 bg-gray-50 dark:bg-gray-800 border-r" style={{ borderColor: themeColors.border }}>
                        {line.oldLineNumber}
                      </div>
                      <div className={`flex-1 px-3 py-0.5 ${line.type === 'remove' ? 'bg-red-50 dark:bg-red-900/20' : ''
                        }`}>
                        <span className={
                          line.type === 'remove' ? 'text-red-600 dark:text-red-400' :
                            'text-gray-600 dark:text-gray-300'
                        }>
                          {line.content || ' '}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* New file (right side) */}
            <div>
              <div className="sticky top-0 bg-gray-100 dark:bg-gray-700 px-3 py-2 border-b text-sm font-medium" style={{ borderColor: themeColors.border, color: themeColors.text }}>
                New
              </div>
              <div className="font-mono text-sm">
                {diffLines.map((line, index) => {
                  if (line.type === 'header') {
                    return (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 px-3 py-1 text-gray-500 text-xs border-b" style={{ borderColor: themeColors.border }}>
                        {line.content}
                      </div>
                    );
                  }

                  if (line.type === 'remove') {
                    return (
                      <div key={index} className="flex">
                        <div className="w-12 text-right pr-2 text-gray-400 bg-gray-50 dark:bg-gray-800 border-r" style={{ borderColor: themeColors.border }}>
                          {/* Empty for removals */}
                        </div>
                        <div className="flex-1 px-3 py-0.5 bg-red-50 dark:bg-red-900/20">
                          {/* Empty for removals */}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={index} className="flex">
                      <div className="w-12 text-right pr-2 text-gray-400 bg-gray-50 dark:bg-gray-800 border-r" style={{ borderColor: themeColors.border }}>
                        {line.newLineNumber}
                      </div>
                      <div className={`flex-1 px-3 py-0.5 ${line.type === 'add' ? 'bg-green-50 dark:bg-green-900/20' : ''
                        }`}>
                        <span className={
                          line.type === 'add' ? 'text-green-600 dark:text-green-400' :
                            'text-gray-600 dark:text-gray-300'
                        }>
                          {line.content || ' '}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}