import React, { useState, useCallback } from 'react';
import { useStore } from '../store';
import { parseJSON, getJSONStats } from '../utils/json';

interface DragDropProps {
  children: React.ReactNode;
}

export function DragDropWrapper({ children }: DragDropProps) {
  const { theme, setJsonInput, setValidationResult, setStats } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const isDark = theme === 'dark';

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/json' || file.name.endsWith('.json') || file.name.endsWith('.txt'))) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        setJsonInput(content);
        const { parsed, error } = parseJSON(content);
        if (error) {
          setValidationResult(false, [error]);
          setStats(null);
        } else {
          setValidationResult(true, []);
          setStats(getJSONStats(parsed));
        }
      };
      reader.readAsText(file);
    }
  }, [setJsonInput, setValidationResult, setStats]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isDragging && (
        <div className={`absolute inset-0 z-50 flex items-center justify-center border-2 border-dashed rounded-lg m-2 ${
          isDark
            ? 'bg-blue-500/10 border-blue-500 text-blue-400'
            : 'bg-blue-50 border-blue-400 text-blue-600'
        }`}>
          <div className="text-center">
            <div className="text-4xl mb-2">📂</div>
            <p className="text-sm font-medium">Drop JSON file here</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
