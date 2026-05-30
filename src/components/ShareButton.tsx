import { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, AlertTriangle, X, Link } from 'lucide-react';
import { buildShareUrl, isShareable } from '../utils/share';
import { useStore } from '../store';

interface ShareButtonProps {
  json: string;
  /** URL path for the share link, defaults to /app */
  basePath?: string;
  className?: string;
}

export function ShareButton({ json, basePath = '/app', className = '' }: ShareButtonProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const hasContent = json.trim().length > 0;
  const shareable = hasContent && isShareable(json);
  const shareUrl = hasContent ? buildShareUrl(json, basePath) : '';

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  const handleOpen = () => {
    if (!hasContent) return;
    setOpen(o => !o);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        disabled={!hasContent}
        title="Share this JSON"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
          open
            ? isDark
              ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
              : 'bg-brand-50 border-brand-300 text-brand-600'
            : isDark
              ? 'border-[#2a2a2a] text-gray-400 hover:text-gray-200 hover:border-[#3a3a3a]'
              : 'border-gray-200 text-gray-600 hover:text-gray-900 bg-white hover:border-gray-300'
        } ${className}`}
      >
        <Share2 size={13} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {open && (
        <div className={`absolute top-[calc(100%+8px)] right-0 z-50 w-80 rounded-2xl border shadow-2xl overflow-hidden animate-fade-in ${
          isDark ? 'bg-[#111111] border-[#222222]' : 'bg-white border-gray-100'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-[#1e1e1e]' : 'border-gray-100'}`}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-500/15 flex items-center justify-center">
                <Link size={12} className="text-brand-400" />
              </div>
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Share JSON</span>
            </div>
            <button onClick={() => setOpen(false)} className={`p-1 rounded-lg transition-colors ${isDark ? 'text-gray-600 hover:text-gray-400 hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}>
              <X size={13} />
            </button>
          </div>

          <div className="p-3 space-y-2.5">
            {shareable ? (
              <>
                {/* URL row */}
                <div>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Shareable link</p>
                  <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDark ? 'bg-[#0a0a0a] border-[#1e1e1e]' : 'bg-gray-50 border-gray-200'}`}>
                    <code className={`flex-1 text-[11px] font-mono truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {shareUrl.replace('https://', '').replace('http://', '')}
                    </code>
                    <button
                      onClick={copyUrl}
                      className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        urlCopied
                          ? 'bg-brand-500/20 text-brand-400'
                          : isDark ? 'bg-[#1e1e1e] text-gray-400 hover:text-white hover:bg-[#2a2a2a]' : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
                      }`}
                    >
                      {urlCopied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                    </button>
                  </div>
                  <p className={`text-[10px] mt-1.5 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
                    Anyone with this link can view and edit your JSON · {Math.round(shareUrl.length / 1000 * 10) / 10}KB
                  </p>
                </div>

                <div className={`h-px ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-100'}`} />

                {/* Copy raw JSON */}
                <button
                  onClick={copyJson}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                    copied
                      ? isDark ? 'bg-brand-500/10 border-brand-500/20' : 'bg-brand-50 border-brand-200'
                      : isDark ? 'border-[#1e1e1e] hover:border-[#2a2a2a] hover:bg-[#141414]' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {copied ? <Check size={14} className="text-brand-400 flex-shrink-0" /> : <Copy size={14} className={`flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />}
                  <div>
                    <p className={`text-xs font-semibold ${copied ? 'text-brand-400' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {copied ? 'JSON copied!' : 'Copy raw JSON'}
                    </p>
                    <p className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{json.length.toLocaleString()} chars</p>
                  </div>
                </button>
              </>
            ) : (
              /* Too large */
              <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-400 mb-1">JSON is too large to share via URL</p>
                  <p className={`text-[10px] leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Your JSON exceeds the URL length limit (~8KB). You can still copy the raw JSON below.
                  </p>
                  <button
                    onClick={copyJson}
                    className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      copied ? 'bg-brand-500/20 text-brand-400' : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    }`}
                  >
                    {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy raw JSON</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
