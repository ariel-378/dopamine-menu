import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles, Check, X, Plus, Trash2, Settings, Clock,
  Sun, Moon, BatteryLow, Zap, ChevronLeft,
  Wind, Pencil, Users, Hammer, BookOpen, Heart,
  RefreshCw, ArrowLeft
} from 'lucide-react';

// ============================================================
// Categories & metadata
// ============================================================

const CATEGORIES = {
  movement: { label: 'movement', Icon: Wind,    color: '#7BA88E' },
  creative: { label: 'creative', Icon: Pencil,  color: '#E07856' },
  social:   { label: 'social',   Icon: Users,   color: '#D4A24C' },
  hands:    { label: 'hands',    Icon: Hammer,  color: '#B89368' },
  reading:  { label: 'reading',  Icon: BookOpen,color: '#9B7B9E' },
  rest:     { label: 'rest',     Icon: Heart,   color: '#8FA9B8' },
};

const TIERS = {
  snack:  { label: 'Apéritifs',  sub: '2–5 minutes',   shortLabel: 'snack',  numeral: 'I' },
  small:  { label: 'Petits',     sub: '10–20 minutes', shortLabel: 'small',  numeral: 'II' },
  medium: { label: 'Principaux', sub: '30–60 minutes', shortLabel: 'medium', numeral: 'III' },
  feast:  { label: 'Festins',    sub: '1 hour or more',shortLabel: 'feast',  numeral: 'IV' },
};

const MODES = {
  any:     { label: 'Anytime',   Icon: Clock,      hint: 'show me everything' },
  morning: { label: 'Morning',   Icon: Sun,        hint: 'just woke up, low decisions' },
  fried:   { label: 'Fried',     Icon: BatteryLow, hint: 'after school, no energy' },
  bedtime: { label: 'Bedtime',   Icon: Moon,       hint: 'wind down, screen-free' },
};

// ============================================================
// Seed menu — based on Ariel's preferences
// ============================================================

const SEED_ITEMS = [
  // SNACK (2-5 min)
  { tier: 'snack', text: 'Step outside and look at the sky',                  desc: 'just sixty seconds, no phone',           cats: ['movement','rest'],  modes: ['any','morning','fried','bedtime'] },
  { tier: 'snack', text: 'Three slow breaths with eyes closed',                desc: 'in for four, out for six',               cats: ['rest'],             modes: ['any','morning','fried','bedtime'] },
  { tier: 'snack', text: 'Doodle in the margin of a notebook',                 desc: 'no goal, no judgment',                   cats: ['creative'],         modes: ['any','fried'] },
  { tier: 'snack', text: 'Drink a glass of water slowly',                      desc: 'pay attention to it',                    cats: ['rest'],             modes: ['any','morning','fried','bedtime'] },
  { tier: 'snack', text: 'Open a window, listen for one minute',               desc: 'whatever is out there',                  cats: ['rest'],             modes: ['any','morning','bedtime'] },
  { tier: 'snack', text: 'Tidy one surface',                                   desc: 'desk, nightstand, anything',             cats: ['hands'],            modes: ['any','fried'] },
  { tier: 'snack', text: 'Stretch arms overhead, roll shoulders',              desc: 'release the commute',                    cats: ['movement'],         modes: ['any','morning','fried'] },
  { tier: 'snack', text: 'Write down one thing you noticed today',             desc: 'a single sentence is enough',            cats: ['creative'],         modes: ['any','bedtime'] },
  { tier: 'snack', text: 'Splash cold water on your face',                     desc: 'reset',                                  cats: ['rest'],             modes: ['any','morning','fried'] },
  { tier: 'snack', text: 'Stand by a window for the length of one song',       desc: 'no scrolling, just looking',             cats: ['rest'],             modes: ['any','fried'] },

  // SMALL (10-20 min)
  { tier: 'small', text: 'Walk around the block',                              desc: 'no podcast, no audiobook',               cats: ['movement'],         modes: ['any','morning','fried'] },
  { tier: 'small', text: 'Read ten pages of a paper book',                     desc: 'fiction counts, especially fiction',     cats: ['reading'],          modes: ['any','bedtime'] },
  { tier: 'small', text: 'Sketch something in front of you',                   desc: 'a mug, your hand, the window',           cats: ['creative'],         modes: ['any','fried'] },
  { tier: 'small', text: 'Lie on the floor, listen to one full album',         desc: 'no other input',                         cats: ['rest'],             modes: ['any','fried','bedtime'] },
  { tier: 'small', text: 'Make a real snack from real food',                   desc: 'fruit, toast, anything assembled',       cats: ['hands'],            modes: ['any','fried'] },
  { tier: 'small', text: 'Stretch routine on the floor',                       desc: 'fifteen minutes is enough',              cats: ['movement','rest'],  modes: ['any','morning','bedtime'] },
  { tier: 'small', text: 'Sit on the porch with no phone',                     desc: 'bring water, sit, wait',                 cats: ['rest'],             modes: ['any','fried'] },
  { tier: 'small', text: 'Write a paragraph in a journal',                     desc: 'about anything, even nothing',           cats: ['creative'],         modes: ['any','bedtime'] },
  { tier: 'small', text: 'Organize one drawer or shelf',                       desc: 'small win, real satisfaction',           cats: ['hands'],            modes: ['any','fried'] },
  { tier: 'small', text: 'Call a grandparent or relative',                     desc: 'they will love it',                      cats: ['social'],           modes: ['any'] },
  { tier: 'small', text: 'Watch the sun set without filming it',               desc: 'this one is harder than it sounds',      cats: ['rest'],             modes: ['any','bedtime'] },

  // MEDIUM (30-60 min)
  { tier: 'medium', text: 'Long walk with no destination',                     desc: 'wander, get a little lost',              cats: ['movement'],         modes: ['any'] },
  { tier: 'medium', text: 'Cook a real meal from scratch',                     desc: 'something with actual chopping',         cats: ['hands'],            modes: ['any'] },
  { tier: 'medium', text: 'Read a book for forty-five minutes',                desc: 'paper, not a screen',                    cats: ['reading'],          modes: ['any','bedtime'] },
  { tier: 'medium', text: 'Draw or paint something for the joy of it',         desc: 'no posting, no sharing',                 cats: ['creative'],         modes: ['any'] },
  { tier: 'medium', text: 'Bake something',                                    desc: 'cookies, banana bread, anything',        cats: ['hands'],            modes: ['any'] },
  { tier: 'medium', text: 'Real conversation with a family member',            desc: 'sit down, no phone in sight',            cats: ['social'],           modes: ['any'] },
  { tier: 'medium', text: 'Workout or yoga session',                           desc: 'move until your brain quiets',           cats: ['movement'],         modes: ['any','morning'] },
  { tier: 'medium', text: 'Write a letter to a friend',                        desc: 'pen and paper, mail it',                 cats: ['creative','social'],modes: ['any'] },
  { tier: 'medium', text: 'Walk in a park with a notebook',                    desc: 'note three things you see',              cats: ['movement','creative'], modes: ['any'] },
  { tier: 'medium', text: 'Try a new recipe',                                  desc: 'something you have never made',          cats: ['hands'],            modes: ['any'] },
  { tier: 'medium', text: 'Listen to a record, lying down',                    desc: 'eyes closed, no other inputs',           cats: ['rest'],             modes: ['any','bedtime'] },

  // FEAST (1+ hours)
  { tier: 'feast', text: 'Hike somewhere with elevation',                      desc: 'view, sweat, time outside',              cats: ['movement'],         modes: ['any'] },
  { tier: 'feast', text: 'Hang out with a friend in person',                   desc: 'leave both phones in pockets',           cats: ['social'],           modes: ['any'] },
  { tier: 'feast', text: 'Big creative project session',                       desc: 'paint, write, build, three hours',       cats: ['creative'],         modes: ['any'] },
  { tier: 'feast', text: 'Cook an elaborate meal for the family',              desc: 'something that takes real time',         cats: ['hands','social'],   modes: ['any'] },
  { tier: 'feast', text: 'Day trip somewhere new',                             desc: 'museum, town, trail, anywhere',          cats: ['movement','social'],modes: ['any'] },
  { tier: 'feast', text: 'Read a whole short book in one sitting',             desc: 'novella, poetry, essays',                cats: ['reading'],          modes: ['any'] },
  { tier: 'feast', text: 'Movie night with family, no second screen',          desc: 'phones in the kitchen',                  cats: ['social','rest'],    modes: ['any'] },
  { tier: 'feast', text: 'Big organizing project',                             desc: 'closet, room, bookshelf',                cats: ['hands'],            modes: ['any'] },
];

// ============================================================
// Storage helpers
// ============================================================

async function getStorage(key, fallback) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : fallback;
  } catch { return fallback; }
}

async function setStorage(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)); }
  catch (e) { console.error('Storage error:', e); }
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ============================================================
// Time-based mode detection
// ============================================================

function detectMode() {
  const hour = new Date().getHours();
  if (hour < 9) return 'morning';
  if (hour >= 21) return 'bedtime';
  if (hour >= 15 && hour < 19) return 'fried';
  return 'any';
}

// ============================================================
// Components
// ============================================================

function MenuItem({ item, index, onClick }) {
  return (
    <button
      onClick={() => onClick(item)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '14px 4px 14px 0',
        borderTop: '0.5px solid var(--rule)',
        background: 'transparent',
        cursor: 'pointer',
        display: 'block',
        transition: 'background 200ms',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(240, 230, 210, 0.04)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'baseline' }}>
        <div
          style={{
            fontFamily: 'var(--type)',
            fontSize: '11px',
            color: 'var(--brass)',
            letterSpacing: '0.1em',
            minWidth: '24px',
            paddingTop: '2px',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--body)',
              fontSize: '16px',
              color: 'var(--cream)',
              lineHeight: '1.35',
              fontWeight: 400,
            }}
          >
            {item.text}
          </div>
          {item.desc && (
            <div
              style={{
                fontFamily: 'var(--body)',
                fontStyle: 'italic',
                fontSize: '13px',
                color: 'var(--cream-soft)',
                marginTop: '3px',
                lineHeight: '1.4',
              }}
            >
              {item.desc}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
            {(item.cats || []).map(c => {
              const cat = CATEGORIES[c];
              if (!cat) return null;
              const { Icon } = cat;
              return (
                <span
                  key={c}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    fontFamily: 'var(--type)',
                    color: cat.color,
                    letterSpacing: '0.06em',
                  }}
                >
                  <Icon size={10} />
                  {cat.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </button>
  );
}

function FocusedItem({ item, onDone, onSkip, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26, 18, 22, 0.94)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px',
        animation: 'fadeIn 300ms ease',
      }}
    >
      <button
        onClick={onClose}
        style={{
          alignSelf: 'flex-start',
          background: 'transparent',
          border: 'none',
          color: 'var(--cream-soft)',
          cursor: 'pointer',
          fontFamily: 'var(--type)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          padding: '8px 12px 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <ArrowLeft size={14} /> back to menu
      </button>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '440px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--type)',
            fontSize: '11px',
            color: 'var(--brass)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          tonight's recommendation
        </div>
        <h1
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(36px, 8vw, 56px)',
            fontWeight: 400,
            color: 'var(--cream)',
            lineHeight: '1.1',
            letterSpacing: '-0.01em',
            margin: '0 0 16px',
          }}
        >
          {item.text}
        </h1>
        {item.desc && (
          <p
            style={{
              fontFamily: 'var(--body)',
              fontStyle: 'italic',
              fontSize: '17px',
              color: 'var(--cream-soft)',
              lineHeight: '1.5',
              margin: '0 0 40px',
            }}
          >
            {item.desc}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '320px',
          }}
        >
          <button
            onClick={() => onDone(item)}
            style={{
              padding: '14px 24px',
              fontFamily: 'var(--type)',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: 'var(--brass)',
              color: 'var(--ink)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            i'm doing it →
          </button>
          <button
            onClick={onSkip}
            style={{
              padding: '12px 24px',
              fontFamily: 'var(--type)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: 'transparent',
              color: 'var(--cream-soft)',
              border: '0.5px solid var(--cream-soft)',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            give me another
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuView({ items, mode, setMode, tier, setTier, onPick, onSurprise, goToEdit }) {
  const filtered = items.filter(i =>
    i.tier === tier && (i.modes || ['any']).includes(mode)
  );

  const tierInfo = TIERS[tier];

  return (
    <>
      {/* Mode pills */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Object.entries(MODES).map(([key, info]) => {
            const active = mode === key;
            const { Icon } = info;
            return (
              <button
                key={key}
                onClick={() => setMode(key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  borderRadius: '999px',
                  background: active ? 'var(--cream)' : 'transparent',
                  color: active ? 'var(--ink)' : 'var(--cream-soft)',
                  border: active ? 'none' : '0.5px solid var(--cream-soft)',
                  fontFamily: 'var(--type)',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'lowercase',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <Icon size={11} />
                {info.label.toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier selector — menu sections */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '6px',
          marginBottom: '24px',
        }}
      >
        {Object.entries(TIERS).map(([key, info]) => {
          const active = tier === key;
          return (
            <button
              key={key}
              onClick={() => setTier(key)}
              style={{
                padding: '10px 4px',
                background: active ? 'var(--panel)' : 'transparent',
                border: `0.5px solid ${active ? 'var(--brass)' : 'var(--rule)'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 200ms',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--type)',
                  fontSize: '10px',
                  color: active ? 'var(--brass)' : 'var(--cream-soft)',
                  letterSpacing: '0.15em',
                  marginBottom: '2px',
                }}
              >
                {info.numeral}
              </div>
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: '14px',
                  color: active ? 'var(--cream)' : 'var(--cream-soft)',
                  fontStyle: 'italic',
                  lineHeight: 1,
                }}
              >
                {info.shortLabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* Section header */}
      <div style={{ marginBottom: '12px', textAlign: 'center', position: 'relative' }}>
        <div
          style={{
            fontFamily: 'var(--type)',
            fontSize: '10px',
            color: 'var(--brass)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          {tierInfo.sub}
        </div>
        <h2
          style={{
            fontFamily: 'var(--display)',
            fontSize: '32px',
            fontWeight: 400,
            color: 'var(--cream)',
            lineHeight: '1.1',
            letterSpacing: '0.02em',
            margin: 0,
          }}
        >
          {tierInfo.label}
        </h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '10px',
            color: 'var(--rule-strong)',
          }}
        >
          <div style={{ width: '40px', height: '0.5px', background: 'var(--rule-strong)' }} />
          <div style={{ fontSize: '8px', color: 'var(--brass)', letterSpacing: '0.3em' }}>✦</div>
          <div style={{ width: '40px', height: '0.5px', background: 'var(--rule-strong)' }} />
        </div>
      </div>

      {/* Surprise me button */}
      {filtered.length > 0 && (
        <button
          onClick={() => onSurprise(filtered)}
          style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            border: '0.5px dashed var(--brass)',
            borderRadius: '4px',
            color: 'var(--brass)',
            fontFamily: 'var(--type)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'all 200ms',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(184, 145, 73, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <Sparkles size={12} />
          surprise me
        </button>
      )}

      {/* Items */}
      <div>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              fontFamily: 'var(--body)',
              fontStyle: 'italic',
              color: 'var(--cream-soft)',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            nothing on this section yet —<br />
            add your own from the editor
          </div>
        ) : (
          filtered.map((item, i) => (
            <MenuItem key={item.id} item={item} index={i} onClick={onPick} />
          ))
        )}
        {filtered.length > 0 && (
          <div style={{ borderTop: '0.5px solid var(--rule)' }} />
        )}

        {/* Inline add button */}
        <button
          onClick={() => goToEdit(tier, mode)}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '16px',
            background: 'transparent',
            border: '0.5px solid var(--rule)',
            borderRadius: '4px',
            color: 'var(--cream-soft)',
            fontFamily: 'var(--type)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 200ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brass)';
            e.currentTarget.style.color = 'var(--brass)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--rule)';
            e.currentTarget.style.color = 'var(--cream-soft)';
          }}
        >
          <Plus size={12} />
          add your own
        </button>
      </div>
    </>
  );
}

function LogView({ log, items }) {
  if (log.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--display)',
            fontSize: '24px',
            color: 'var(--cream)',
            fontStyle: 'italic',
            marginBottom: '8px',
          }}
        >
          a fresh ledger
        </div>
        <div
          style={{
            fontFamily: 'var(--body)',
            fontSize: '14px',
            color: 'var(--cream-soft)',
            fontStyle: 'italic',
          }}
        >
          things you do off your phone show up here
        </div>
      </div>
    );
  }

  // Group by date
  const byDate = {};
  log.slice().reverse().forEach(entry => {
    const d = new Date(entry.at);
    const key = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(entry);
  });

  // Stats
  const total = log.length;
  const last7 = log.filter(e => Date.now() - new Date(e.at).getTime() < 7 * 86400000).length;

  return (
    <div>
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
        The Ledger
      </h1>
      <div
        style={{
          fontFamily: 'var(--type)',
          fontSize: '10px',
          color: 'var(--brass)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}
      >
        what you did instead
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '14px', border: '0.5px solid var(--rule)', borderRadius: '4px' }}>
          <div style={{ fontFamily: 'var(--type)', fontSize: '9px', color: 'var(--brass)', letterSpacing: '0.18em', marginBottom: '4px' }}>
            ALL TIME
          </div>
          <div style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--cream)' }}>
            {total}
          </div>
        </div>
        <div style={{ padding: '14px', border: '0.5px solid var(--rule)', borderRadius: '4px' }}>
          <div style={{ fontFamily: 'var(--type)', fontSize: '9px', color: 'var(--brass)', letterSpacing: '0.18em', marginBottom: '4px' }}>
            LAST 7 DAYS
          </div>
          <div style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--cream)' }}>
            {last7}
          </div>
        </div>
      </div>

      {Object.entries(byDate).map(([date, entries]) => (
        <div key={date} style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '10px',
              color: 'var(--brass)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            {date}
          </div>
          {entries.map((e, i) => {
            const item = items.find(it => it.id === e.itemId);
            const time = new Date(e.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '10px 0',
                  borderTop: '0.5px solid var(--rule)',
                  alignItems: 'baseline',
                }}
              >
                <div style={{ fontFamily: 'var(--type)', fontSize: '10px', color: 'var(--cream-soft)', minWidth: '50px' }}>
                  {time}
                </div>
                <div style={{ fontFamily: 'var(--body)', fontSize: '14px', color: 'var(--cream)' }}>
                  {item?.text || e.text || '(deleted item)'}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function EditorView({ items, addItem, deleteItem, resetSeed, initialTier, initialMode }) {
  const [text, setText] = useState('');
  const [desc, setDesc] = useState('');
  const [tier, setTier] = useState(initialTier || 'snack');
  const [cats, setCats] = useState([]);
  const [modes, setModes] = useState(initialMode && initialMode !== 'any' ? ['any', initialMode] : ['any']);

  const submit = () => {
    if (!text.trim()) return;
    addItem({
      text: text.trim(),
      desc: desc.trim(),
      tier,
      cats,
      modes: modes.length > 0 ? modes : ['any'],
      custom: true,
    });
    setText('');
    setDesc('');
    setCats([]);
    setModes(['any']);
  };

  const toggleMode = (m) => {
    if (modes.includes(m)) {
      setModes(modes.filter(x => x !== m));
    } else {
      setModes([...modes, m]);
    }
  };

  const grouped = useMemo(() => {
    const g = { snack: [], small: [], medium: [], feast: [] };
    items.forEach(i => { if (g[i.tier]) g[i.tier].push(i); });
    return g;
  }, [items]);

  return (
    <div>
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
        Edit the menu
      </h1>
      <div
        style={{
          fontFamily: 'var(--type)',
          fontSize: '10px',
          color: 'var(--brass)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}
      >
        make it your own
      </div>

      {/* Add new */}
      <div
        style={{
          padding: '16px',
          border: '0.5px solid var(--rule)',
          borderRadius: '4px',
          marginBottom: '32px',
          background: 'var(--panel)',
        }}
      >
        <div style={{ fontFamily: 'var(--type)', fontSize: '10px', color: 'var(--brass)', letterSpacing: '0.18em', marginBottom: '10px', textTransform: 'uppercase' }}>
          New item
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's the activity?"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '0.5px solid var(--rule)',
            padding: '8px 0',
            color: 'var(--cream)',
            fontFamily: 'var(--body)',
            fontSize: '15px',
            outline: 'none',
            marginBottom: '8px',
          }}
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="A short note (optional)"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '0.5px solid var(--rule)',
            padding: '8px 0',
            color: 'var(--cream-soft)',
            fontFamily: 'var(--body)',
            fontStyle: 'italic',
            fontSize: '13px',
            outline: 'none',
            marginBottom: '12px',
          }}
        />

        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontFamily: 'var(--type)', fontSize: '9px', color: 'var(--cream-soft)', letterSpacing: '0.15em', marginBottom: '6px', textTransform: 'uppercase' }}>
            Section
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {Object.entries(TIERS).map(([key, info]) => {
              const active = tier === key;
              return (
                <button
                  key={key}
                  onClick={() => setTier(key)}
                  style={{
                    padding: '4px 10px',
                    background: active ? 'var(--cream)' : 'transparent',
                    color: active ? 'var(--ink)' : 'var(--cream-soft)',
                    border: active ? 'none' : '0.5px solid var(--rule)',
                    fontFamily: 'var(--type)',
                    fontSize: '10px',
                    letterSpacing: '0.05em',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  {info.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontFamily: 'var(--type)', fontSize: '9px', color: 'var(--cream-soft)', letterSpacing: '0.15em', marginBottom: '6px', textTransform: 'uppercase' }}>
            Tags
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {Object.entries(CATEGORIES).map(([key, info]) => {
              const active = cats.includes(key);
              const { Icon } = info;
              return (
                <button
                  key={key}
                  onClick={() => setCats(active ? cats.filter(c => c !== key) : [...cats, key])}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: active ? info.color : 'transparent',
                    color: active ? 'var(--ink)' : 'var(--cream-soft)',
                    border: active ? 'none' : '0.5px solid var(--rule)',
                    fontFamily: 'var(--type)',
                    fontSize: '10px',
                    letterSpacing: '0.05em',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={10} />
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontFamily: 'var(--type)', fontSize: '9px', color: 'var(--cream-soft)', letterSpacing: '0.15em', marginBottom: '6px', textTransform: 'uppercase' }}>
            When to suggest
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {Object.entries(MODES).map(([key, info]) => {
              const active = modes.includes(key);
              const { Icon } = info;
              return (
                <button
                  key={key}
                  onClick={() => toggleMode(key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: active ? 'var(--cream)' : 'transparent',
                    color: active ? 'var(--ink)' : 'var(--cream-soft)',
                    border: active ? 'none' : '0.5px solid var(--rule)',
                    fontFamily: 'var(--type)',
                    fontSize: '10px',
                    letterSpacing: '0.05em',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={10} />
                  {info.label.toLowerCase()}
                </button>
              );
            })}
          </div>
          <div style={{ fontFamily: 'var(--body)', fontStyle: 'italic', fontSize: '11px', color: 'var(--cream-soft)', marginTop: '6px', lineHeight: '1.4' }}>
            keep "anytime" on so it always shows in the main menu. add others to also show in those modes.
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!text.trim()}
          style={{
            width: '100%',
            padding: '10px',
            background: text.trim() ? 'var(--brass)' : 'transparent',
            color: text.trim() ? 'var(--ink)' : 'var(--cream-soft)',
            border: text.trim() ? 'none' : '0.5px solid var(--rule)',
            fontFamily: 'var(--type)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            borderRadius: '3px',
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 500,
          }}
        >
          add to menu
        </button>
      </div>

      {/* Existing items by tier */}
      {Object.entries(grouped).map(([tier, tierItems]) => (
        <div key={tier} style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '10px',
              color: 'var(--brass)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            {TIERS[tier].label} · {tierItems.length}
          </div>
          {tierItems.map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                padding: '10px 0',
                borderTop: '0.5px solid var(--rule)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--body)', fontSize: '14px', color: 'var(--cream)', lineHeight: '1.3' }}>
                  {item.text}
                </div>
                {item.desc && (
                  <div style={{ fontFamily: 'var(--body)', fontStyle: 'italic', fontSize: '12px', color: 'var(--cream-soft)', marginTop: '2px' }}>
                    {item.desc}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--cream-soft)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ))}

      <div style={{ paddingTop: '16px', borderTop: '0.5px solid var(--rule)' }}>
        <button
          onClick={resetSeed}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--cream-soft)',
            fontFamily: 'var(--type)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          reset to default menu →
        </button>
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'menu', label: 'Menu' },
    { id: 'log',  label: 'Ledger' },
    { id: 'edit', label: 'Edit' },
  ];
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        marginTop: '40px',
        background: 'var(--ink)',
        borderTop: '0.5px solid var(--rule)',
        display: 'flex',
        padding: '4px',
      }}
    >
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--type)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: active ? 'var(--brass)' : 'var(--cream-soft)',
              cursor: 'pointer',
              fontWeight: active ? 500 : 400,
            }}
          >
            {t.label.toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// Main App
// ============================================================

export default function App() {
  const [tab, setTab] = useState('menu');
  const [items, setItems] = useState(SEED_ITEMS.map(i => ({ ...i, id: makeId() })));
  const [log, setLog] = useState([]);
  const [mode, setMode] = useState(detectMode());
  const [tier, setTier] = useState('snack');
  const [focused, setFocused] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [editorPreset, setEditorPreset] = useState({ tier: null, mode: null });

  const goToEdit = (presetTier, presetMode) => {
    setEditorPreset({ tier: presetTier, mode: presetMode });
    setTab('edit');
  };

  useEffect(() => {
    (async () => {
      const stored = await getStorage('menu:items', null);
      const storedLog = await getStorage('menu:log', []);
      if (stored && stored.length > 0) setItems(stored);
      else {
        const seeded = SEED_ITEMS.map(i => ({ ...i, id: makeId() }));
        setItems(seeded);
        setStorage('menu:items', seeded);
      }
      setLog(storedLog);
      setLoaded(true);
    })();
  }, []);

  const persistItems = (next) => {
    setItems(next);
    setStorage('menu:items', next);
  };

  const addItem = (data) => {
    const next = [...items, { ...data, id: makeId() }];
    persistItems(next);
  };

  const deleteItem = (id) => {
    persistItems(items.filter(i => i.id !== id));
  };

  const resetSeed = () => {
    if (typeof window !== 'undefined' && window.confirm?.('Reset menu to defaults? Custom items will be removed.')) {
      const seeded = SEED_ITEMS.map(i => ({ ...i, id: makeId() }));
      persistItems(seeded);
    }
  };

  const onSurprise = (filtered) => {
    if (filtered.length === 0) return;
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    setFocused(pick);
  };

  const onPick = (item) => setFocused(item);

  const markDone = (item) => {
    const entry = { itemId: item.id, text: item.text, at: new Date().toISOString() };
    const nextLog = [...log, entry];
    setLog(nextLog);
    setStorage('menu:log', nextLog);
    setFocused(null);
  };

  const skipFocused = () => {
    const filtered = items.filter(i =>
      i.tier === tier && (i.modes || ['any']).includes(mode) && i.id !== focused?.id
    );
    if (filtered.length === 0) {
      setFocused(null);
      return;
    }
    setFocused(filtered[Math.floor(Math.random() * filtered.length)]);
  };

  return (
    <div
      style={{
        background: 'var(--ink)',
        minHeight: '100vh',
        color: 'var(--cream)',
        fontFamily: 'var(--body)',
        position: 'relative',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Cardo:ital,wght@0,400;0,700;1,400&family=Special+Elite&display=swap');

        :root {
          --ink: #1A1216;
          --ink-deep: #120A0E;
          --panel: #221820;
          --cream: #F0E6D2;
          --cream-soft: rgba(240, 230, 210, 0.55);
          --brass: #C99B5C;
          --brass-deep: #A07B3F;
          --rule: rgba(240, 230, 210, 0.12);
          --rule-strong: rgba(240, 230, 210, 0.25);
          --display: 'Italiana', Georgia, serif;
          --body: 'Cardo', Georgia, serif;
          --type: 'Special Elite', 'Courier New', monospace;
        }

        * { box-sizing: border-box; }
        button { font-family: var(--type); }
        input::placeholder { color: rgba(240, 230, 210, 0.35); }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .page-enter {
          animation: slideUp 350ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        /* subtle paper texture via gradient noise */
        body {
          background-color: var(--ink);
          background-image:
            radial-gradient(at 20% 10%, rgba(201, 155, 92, 0.04) 0%, transparent 40%),
            radial-gradient(at 80% 90%, rgba(155, 123, 158, 0.04) 0%, transparent 40%);
        }
      `}</style>

      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '28px 24px 0',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Masthead */}
        <div style={{ marginBottom: '28px', textAlign: 'center', position: 'relative' }}>
          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '9px',
              color: 'var(--brass)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            est. today
          </div>
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(36px, 9vw, 48px)',
              color: 'var(--cream)',
              margin: 0,
              lineHeight: '1',
              letterSpacing: '0.02em',
              fontWeight: 400,
            }}
          >
            Dopamine Menu
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '10px',
              color: 'var(--rule-strong)',
            }}
          >
            <div style={{ width: '50px', height: '0.5px', background: 'var(--rule-strong)' }} />
            <div style={{ fontFamily: 'var(--display)', fontSize: '11px', color: 'var(--brass)', fontStyle: 'italic' }}>
              put the phone down
            </div>
            <div style={{ width: '50px', height: '0.5px', background: 'var(--rule-strong)' }} />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {loaded ? (
            <div className="page-enter" key={tab}>
              {tab === 'menu' && (
                <MenuView
                  items={items}
                  mode={mode}
                  setMode={setMode}
                  tier={tier}
                  setTier={setTier}
                  onPick={onPick}
                  onSurprise={onSurprise}
                  goToEdit={goToEdit}
                />
              )}
              {tab === 'log' && <LogView log={log} items={items} />}
              {tab === 'edit' && (
                <EditorView
                  items={items}
                  addItem={addItem}
                  deleteItem={deleteItem}
                  resetSeed={resetSeed}
                  initialTier={editorPreset.tier}
                  initialMode={editorPreset.mode}
                />
              )}
            </div>
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--cream-soft)', fontFamily: 'var(--type)', fontSize: '11px', letterSpacing: '0.15em' }}>
              setting the table...
            </div>
          )}
        </div>

        <BottomNav tab={tab} setTab={setTab} />
      </div>

      {focused && (
        <FocusedItem
          item={focused}
          onDone={markDone}
          onSkip={skipFocused}
          onClose={() => setFocused(null)}
        />
      )}
    </div>
  );
}
