import React, { useEffect } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { TopBar } from './components/TopBar';
import { JsonEditor } from './components/JsonEditor';
import { TreeView } from './components/TreeView';
import { TableView } from './components/TableView';
import { CompareView } from './components/CompareView';
import { ConvertView } from './components/ConvertView';
import { BottomPanel } from './components/BottomPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { ShortcutsModal } from './components/ShortcutsModal';
import { QuickTools } from './components/QuickTools';
import { DragDropWrapper } from './components/DragDrop';
import { useStore } from './store';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function ResizeHandle() {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <PanelResizeHandle className={`w-1 transition-colors hover:bg-blue-500/50 cursor-col-resize ${
      isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'
    }`} />
  );
}

function RightPanel() {
  const { theme, viewMode } = useStore();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = React.useState<'tree' | 'table' | 'tools'>('tree');

  if (viewMode === 'compare') return <CompareView />;
  if (viewMode === 'convert') return <ConvertView />;

  const tabs = [
    { id: 'tree' as const, label: 'Tree', content: <TreeView /> },
    { id: 'table' as const, label: 'Table', content: <TableView /> },
    { id: 'tools' as const, label: 'Tools', content: <QuickTools /> },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center border-b flex-shrink-0 ${
        isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
      }`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? isDark
                  ? 'text-white border-b-2 border-b-blue-500'
                  : 'text-gray-900 border-b-2 border-b-blue-500'
                : isDark
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
}

export default function App() {
  const { theme, setTheme, showHistory, showShortcuts, viewMode } = useStore();

  useKeyboardShortcuts();

  useEffect(() => {
    setTheme(theme);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${
      isDark ? 'bg-[#141414] text-gray-200' : 'bg-gray-50 text-gray-900'
    }`}>
      <TopBar />

      <DragDropWrapper>
        <div className="flex-1 overflow-hidden">
          {viewMode === 'compare' ? (
            <div className="h-full">
              <CompareView />
            </div>
          ) : viewMode === 'convert' ? (
            <PanelGroup orientation="horizontal" className="h-full">
              <Panel defaultSize={50} minSize={30}>
                <div className={`h-full border-r ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
                  <JsonEditor />
                </div>
              </Panel>
              <ResizeHandle />
              <Panel defaultSize={50} minSize={25}>
                <ConvertView />
              </Panel>
            </PanelGroup>
          ) : (
            <PanelGroup orientation="horizontal" className="h-full">
              <Panel defaultSize={55} minSize={30}>
                <div className={`h-full border-r ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
                  <JsonEditor />
                </div>
              </Panel>
              <ResizeHandle />
              <Panel defaultSize={45} minSize={25}>
                <RightPanel />
              </Panel>
            </PanelGroup>
          )}
        </div>

        <BottomPanel />
      </DragDropWrapper>

      {showHistory && <HistoryPanel />}
      {showShortcuts && <ShortcutsModal />}
    </div>
  );
}
