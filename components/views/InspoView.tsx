'use client';

import Script from 'next/script';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ExternalLink,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { InspoSkeleton } from '@/components/ui/InspoSkeleton';
import type { InspoBoard } from '@/lib/types';

interface Props {
  boards: InspoBoard[];
  currentId: string | null;
  setCurrentId: (id: string | null) => void;
  addBoard: (data: { url: string; label?: string }) => void;
  updateBoard: (id: string, patch: { url?: string; label?: string }) => void;
  deleteBoard: (id: string) => void;
}

const PINTEREST_RE = /^https?:\/\/(www\.)?pinterest\.[a-z.]+\//i;

type PinKind = 'embedPin' | 'embedBoard' | 'embedUser';
type WindowWithPinUtils = Window & { PinUtils?: { build: () => void } };

function detectPinKind(url: string): PinKind {
  try {
    const u = new URL(url);
    const segments = u.pathname.split('/').filter(Boolean);
    if (segments[0] === 'pin') return 'embedPin';
    if (segments.length >= 2) return 'embedBoard';
    return 'embedUser';
  } catch {
    return 'embedBoard';
  }
}

function isPinterestUrl(url: string): boolean {
  return PINTEREST_RE.test(url);
}

function defaultLabel(url: string): string {
  try {
    const u = new URL(url);
    const segs = u.pathname.split('/').filter(Boolean);
    if (segs[0] === 'pin') return `pin ${segs[1] ?? ''}`.trim();
    if (segs.length >= 2) return segs[1].replace(/-/g, ' ');
    if (segs.length === 1) return `@${segs[0]}`;
    return u.hostname;
  } catch {
    return url;
  }
}

export function InspoView({
  boards,
  currentId,
  setCurrentId,
  addBoard,
  updateBoard,
  deleteBoard,
}: Props) {
  const [mode, setMode] = useState<'view' | 'add' | 'edit'>(
    boards.length === 0 ? 'add' : 'view'
  );
  const [draftUrl, setDraftUrl] = useState('');
  const [draftLabel, setDraftLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [rebuildKey, setRebuildKey] = useState(0);

  const activeBoard = useMemo(
    () => boards.find((b) => b.id === currentId) ?? null,
    [boards, currentId]
  );
  const pinterest = activeBoard ? isPinterestUrl(activeBoard.url) : false;

  const startAdd = () => {
    setDraftUrl('');
    setDraftLabel('');
    setError(null);
    setMode('add');
  };

  const startEdit = (board: InspoBoard) => {
    setDraftUrl(board.url);
    setDraftLabel(board.label ?? '');
    setError(null);
    setMode('edit');
  };

  const cancel = () => {
    setError(null);
    setMode('view');
  };

  const submit = () => {
    const url = draftUrl.trim();
    if (!url) {
      setError('Paste a URL to save.');
      return;
    }
    try {
      new URL(url);
    } catch {
      setError('That doesn’t look like a valid URL.');
      return;
    }
    if (mode === 'edit' && activeBoard) {
      updateBoard(activeBoard.id, { url, label: draftLabel });
    } else {
      addBoard({ url, label: draftLabel });
    }
    setMode('view');
    setError(null);
  };

  const removeActive = () => {
    if (!activeBoard) return;
    if (window.confirm(`Remove “${activeBoard.label || defaultLabel(activeBoard.url)}”?`)) {
      deleteBoard(activeBoard.id);
      if (boards.length <= 1) setMode('add');
    }
  };

  return (
    <div>
      <Script
        src="https://assets.pinterest.com/js/pinit.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <h1
        style={{
          fontFamily: 'var(--display)',
          fontSize: '36px',
          color: 'var(--cream)',
          margin: '0 0 4px',
          fontStyle: 'italic',
          fontWeight: 400,
        }}
      >
        Inspo
      </h1>
      <div
        style={{
          fontFamily: 'var(--type)',
          fontSize: '11px',
          color: 'var(--brass)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}
      >
        save what&apos;s pretty
      </div>

      {/* Chip row */}
      {boards.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '18px',
          }}
        >
          {boards.map((b) => {
            const active = b.id === currentId;
            const label = b.label || defaultLabel(b.url);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setCurrentId(b.id);
                  setMode('view');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: active ? 'var(--cream)' : 'transparent',
                  color: active ? 'var(--ink)' : 'var(--cream-soft)',
                  border: active ? 'none' : '0.5px solid var(--cream-soft)',
                  fontFamily: 'var(--type)',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  textTransform: 'lowercase',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={startAdd}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'transparent',
              color: 'var(--brass)',
              border: '0.5px dashed var(--brass)',
              fontFamily: 'var(--type)',
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'lowercase',
              cursor: 'pointer',
            }}
            aria-label="Add board"
          >
            <Plus size={11} /> add
          </button>
        </div>
      )}

      {/* Add / edit form */}
      {(mode === 'add' || mode === 'edit') && (
        <div
          style={{
            padding: '16px',
            border: '0.5px solid var(--rule)',
            borderRadius: '6px',
            background: 'var(--panel)',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '10px',
              color: 'var(--brass)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            {mode === 'edit' ? 'Edit board' : 'New board'}
          </div>

          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '9px',
              color: 'var(--cream-soft)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            URL
          </div>
          <input
            type="url"
            value={draftUrl}
            onChange={(e) => {
              setDraftUrl(e.target.value);
              if (error) setError(null);
            }}
            placeholder="https://pinterest.com/yourname/board-name/"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '0.5px solid var(--rule)',
              padding: '6px 0',
              color: 'var(--cream)',
              fontFamily: 'var(--body)',
              fontSize: '14px',
              outline: 'none',
              marginBottom: '12px',
            }}
          />

          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '9px',
              color: 'var(--cream-soft)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            Label <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--cream-soft)', fontStyle: 'italic' }}>(optional)</span>
          </div>
          <input
            type="text"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            placeholder="spring 2026"
            maxLength={30}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '0.5px solid var(--rule)',
              padding: '6px 0',
              color: 'var(--cream)',
              fontFamily: 'var(--body)',
              fontSize: '14px',
              outline: 'none',
              marginBottom: '14px',
            }}
          />

          {error && (
            <div
              style={{
                fontFamily: 'var(--body)',
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'var(--brass-deep)',
                marginBottom: '10px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={submit}
              style={{
                flex: 1,
                padding: '10px',
                background: 'var(--brass)',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'var(--type)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Check size={12} /> save
            </button>
            {boards.length > 0 && (
              <button
                type="button"
                onClick={cancel}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  color: 'var(--cream-soft)',
                  border: '0.5px solid var(--rule)',
                  fontFamily: 'var(--type)',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <X size={12} /> cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty state when no boards saved yet */}
      {boards.length === 0 && mode !== 'add' && (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            border: '0.5px dashed var(--rule-strong)',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <Sparkles size={20} style={{ color: 'var(--brass)' }} />
          <div
            style={{
              fontFamily: 'var(--display)',
              fontStyle: 'italic',
              fontSize: '20px',
              color: 'var(--cream)',
              marginTop: '8px',
              marginBottom: '4px',
            }}
          >
            collect what catches the eye
          </div>
          <div
            style={{
              fontFamily: 'var(--body)',
              fontStyle: 'italic',
              fontSize: '13px',
              color: 'var(--cream-soft)',
              maxWidth: '320px',
              margin: '0 auto 16px',
              lineHeight: '1.5',
            }}
          >
            Save Pinterest boards, profiles, or pins. Switch between them with the
            chips above.
          </div>
          <button
            type="button"
            onClick={startAdd}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'var(--brass)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'var(--type)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <Plus size={12} /> add first board
          </button>
        </div>
      )}

      {/* Active board */}
      {mode === 'view' && activeBoard && (
        <>
          <div
            style={{
              position: 'relative',
              background: 'var(--panel)',
              border: '0.5px solid var(--rule)',
              borderRadius: '12px',
              padding: '12px',
              minHeight: '320px',
              boxShadow: '0 1px 0 rgba(42, 36, 34, 0.04), 0 8px 24px rgba(194, 101, 119, 0.06)',
            }}
          >
            {pinterest ? (
              <PinterestEmbed
                key={`${activeBoard.id}-${rebuildKey}`}
                url={activeBoard.url}
                scriptLoaded={scriptLoaded}
              />
            ) : (
              <a
                href={activeBoard.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '14px 16px',
                  color: 'var(--cream)',
                  textDecoration: 'none',
                  fontFamily: 'var(--body)',
                  fontSize: '14px',
                  wordBreak: 'break-all',
                }}
              >
                <span>{activeBoard.url}</span>
                <ExternalLink
                  size={14}
                  style={{ color: 'var(--brass)', flexShrink: 0 }}
                />
              </a>
            )}
          </div>

          {/* Action row under the embed */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '12px',
            }}
          >
            <a
              href={activeBoard.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--type)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'var(--brass)',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={11} /> open on pinterest
            </a>
            <div style={{ display: 'flex', gap: '6px' }}>
              {pinterest && (
                <button
                  type="button"
                  onClick={() => setRebuildKey((k) => k + 1)}
                  style={iconBtnStyle}
                  aria-label="Reload embed"
                  title="Reload embed"
                >
                  <RefreshCw size={11} />
                </button>
              )}
              <button
                type="button"
                onClick={() => startEdit(activeBoard)}
                style={iconBtnStyle}
                aria-label="Edit board"
                title="Edit"
              >
                <Pencil size={11} />
              </button>
              <button
                type="button"
                onClick={removeActive}
                style={{ ...iconBtnStyle, color: 'var(--brass-deep)' }}
                aria-label="Remove board"
                title="Remove"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  background: 'transparent',
  border: '0.5px solid var(--rule)',
  borderRadius: '4px',
  color: 'var(--cream-soft)',
  cursor: 'pointer',
};

// Keyed by `${boardId}-${rebuildKey}` so state resets cleanly on board switch
// or manual reload — instead of resetting via setState-inside-effect.
function PinterestEmbed({
  url,
  scriptLoaded,
}: {
  url: string;
  scriptLoaded: boolean;
}) {
  const [embedReady, setEmbedReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinKind = detectPinKind(url);

  // Watch for Pinterest's iframe to appear, then hide skeleton.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (el.querySelector('iframe')) {
      setEmbedReady(true);
      return;
    }
    const observer = new MutationObserver(() => {
      if (el.querySelector('iframe')) {
        setEmbedReady(true);
        observer.disconnect();
      }
    });
    observer.observe(el, { childList: true, subtree: true });
    const timeout = setTimeout(() => setEmbedReady(true), 8000);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  // Trigger Pinterest's build() — poll for PinUtils availability.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as WindowWithPinUtils;
    const tryBuild = (): boolean => {
      if (w.PinUtils?.build) {
        w.PinUtils.build();
        return true;
      }
      return false;
    };
    if (tryBuild()) return;
    const interval = setInterval(() => {
      if (tryBuild()) clearInterval(interval);
    }, 250);
    const cap = setTimeout(() => clearInterval(interval), 8000);
    return () => {
      clearInterval(interval);
      clearTimeout(cap);
    };
  }, [scriptLoaded]);

  return (
    <div ref={containerRef} style={{ position: 'relative', minHeight: '300px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          opacity: embedReady ? 1 : 0,
          transition: 'opacity 250ms ease',
        }}
      >
        <a
          data-pin-do={pinKind}
          data-pin-board-width="380"
          data-pin-scale-height="320"
          data-pin-scale-width="80"
          href={url}
        />
      </div>
      {!embedReady && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <InspoSkeleton />
        </div>
      )}
    </div>
  );
}
