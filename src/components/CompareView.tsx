import { useMemo } from 'react';
import { useStore } from '../store';
import { parseJSON, diffJSON } from '../utils/json';

export function CompareView() {
  const { theme, jsonInput, setJsonInput, compareInput, setCompareInput } = useStore();
  const isDark = theme === 'dark';

  const diff = useMemo(() => {
    const left = parseJSON(jsonInput);
    const right = parseJSON(compareInput);
    if (left.error || right.error || !left.parsed || !right.parsed) return null;
    return diffJSON(left.parsed, right.parsed);
  }, [jsonInput, compareInput]);

  const textareaClass = `w-full h-64 p-3 text-xs font-mono rounded-lg border outline-none resize-none scrollbar-thin ${
    isDark
      ? 'bg-[#1a1a1a] border-[#2d2d2d] text-gray-300 placeholder-gray-600'
      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'
  }`;

  return (
    <div className="flex flex-col h-full gap-4 p-4 overflow-auto scrollbar-thin">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className={`text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Left JSON
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"key": "value"}'
            className={textareaClass}
          />
        </div>
        <div>
          <div className={`text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Right JSON
          </div>
          <textarea
            value={compareInput}
            onChange={(e) => setCompareInput(e.target.value)}
            placeholder='{"key": "changed"}'
            className={textareaClass}
          />
        </div>
      </div>

      {diff && (
        <div className={`rounded-lg border overflow-hidden ${
          isDark ? 'border-[#2d2d2d]' : 'border-gray-200'
        }`}>
          <div className={`px-3 py-2 border-b text-xs font-medium ${
            isDark ? 'bg-[#1a1a1a] border-[#2d2d2d] text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
          }`}>
            Diff Results
          </div>
          <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {diff.added.length > 0 && (
              <DiffSection title="Added" items={diff.added} color="green" isDark={isDark} />
            )}
            {diff.removed.length > 0 && (
              <DiffSection title="Removed" items={diff.removed} color="red" isDark={isDark} />
            )}
            {diff.modified.length > 0 && (
              <DiffSection title="Modified" items={diff.modified} color="yellow" isDark={isDark} />
            )}
            {diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0 && (
              <div className={`col-span-3 text-center py-6 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                ✓ No differences found — JSONs are identical
              </div>
            )}
          </div>
        </div>
      )}

      {(!diff && jsonInput && compareInput) && (
        <div className={`text-sm text-center py-4 ${isDark ? 'text-red-400' : 'text-red-500'}`}>
          One or both JSON inputs are invalid
        </div>
      )}
    </div>
  );
}

function DiffSection({ title, items, color, isDark }: {
  title: string;
  items: string[];
  color: 'green' | 'red' | 'yellow';
  isDark: boolean;
}) {
  const colorMap = {
    green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', badge: 'bg-green-500/20 text-green-400' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-400' },
  };
  const c = colorMap[color];

  return (
    <div className={`rounded-lg border p-3 ${c.bg} ${c.border}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold ${c.text}`}>{title}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${c.badge}`}>{items.length}</span>
      </div>
      <div className="space-y-1">
        {items.map(item => (
          <div key={item} className={`text-xs font-mono truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
