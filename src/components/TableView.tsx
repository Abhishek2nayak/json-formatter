import { useMemo } from 'react';
import { useStore } from '../store';

export function TableView() {
  const { theme, jsonInput } = useStore();
  const isDark = theme === 'dark';

  const tableData = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        const headers = [...new Set(parsed.flatMap(row => Object.keys(row as object)))];
        return { headers, rows: parsed as Record<string, unknown>[], type: 'array' };
      }
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return {
          headers: ['Key', 'Value', 'Type'],
          rows: Object.entries(parsed as Record<string, unknown>).map(([k, v]) => ({
            Key: k,
            Value: typeof v === 'object' ? JSON.stringify(v) : String(v ?? 'null'),
            Type: Array.isArray(v) ? 'array' : typeof v === 'object' && v !== null ? 'object' : typeof v,
          })),
          type: 'object',
        };
      }
      return null;
    } catch {
      return null;
    }
  }, [jsonInput]);

  if (!jsonInput.trim()) {
    return (
      <div className={`flex flex-col items-center justify-center h-full gap-3 ${
        isDark ? 'text-gray-600' : 'text-gray-400'
      }`}>
        <div className="text-4xl">📊</div>
        <p className="text-sm">Paste an array of objects to see the table view</p>
      </div>
    );
  }

  if (!tableData) {
    return (
      <div className={`flex flex-col items-center justify-center h-full gap-3 ${
        isDark ? 'text-gray-600' : 'text-gray-400'
      }`}>
        <p className="text-sm">Table view requires a JSON array of objects or a flat object</p>
      </div>
    );
  }

  const cellClass = `px-3 py-2 text-xs border-r last:border-r-0 ${
    isDark ? 'border-[#2d2d2d]' : 'border-gray-200'
  }`;

  return (
    <div className="flex-1 overflow-auto scrollbar-thin">
      <table className="w-full border-collapse">
        <thead className={`sticky top-0 z-10 ${
          isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'
        }`}>
          <tr className={`border-b ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
            {tableData.headers.map(h => (
              <th key={h} className={`${cellClass} font-medium text-left ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b transition-colors ${
                isDark
                  ? 'border-[#2d2d2d] hover:bg-white/3'
                  : 'border-gray-100 hover:bg-gray-50'
              }`}
            >
              {tableData.headers.map(h => {
                const val = (row as Record<string, unknown>)[h];
                const displayVal = val === null || val === undefined
                  ? <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>null</span>
                  : typeof val === 'boolean'
                    ? <span className={isDark ? 'text-purple-400' : 'text-purple-600'}>{String(val)}</span>
                    : typeof val === 'number'
                      ? <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>{String(val)}</span>
                      : <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{String(val)}</span>;

                return (
                  <td key={h} className={`${cellClass} ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-xs truncate`}>
                    {displayVal}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`text-xs p-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        {tableData.rows.length} rows × {tableData.headers.length} columns
      </div>
    </div>
  );
}
