"use client";

import * as React from "react";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { cn } from "@/utils/cn";

/* -------------------------------------------------------------------------- */
/*                                   Emoji                                    */
/* -------------------------------------------------------------------------- */

/**
 * Slack `:shortcode:` → unicode. Covers everything used in the mock data plus
 * a handful of common ops/status emoji so the parser degrades gracefully.
 */
const EMOJI_MAP: Record<string, string> = {
  rotating_light: "🚨",
  white_check_mark: "✅",
  heavy_check_mark: "✔️",
  mag: "🔍",
  mag_right: "🔎",
  eyes: "👀",
  warning: "⚠️",
  red_circle: "🔴",
  large_orange_circle: "🟠",
  large_yellow_circle: "🟡",
  large_green_circle: "🟢",
  large_blue_circle: "🔵",
  thumbsdown: "👎",
  thumbsup: "👍",
  "-1": "👎",
  "+1": "👍",
  clock3: "🕒",
  hourglass: "⌛",
  hourglass_flowing_sand: "⏳",
  github: "🐙",
  fire: "🔥",
  tada: "🎉",
  rocket: "🚀",
  bell: "🔔",
  no_bell: "🔕",
  lock: "🔒",
  zap: "⚡",
  bug: "🐛",
  sos: "🆘",
  sparkles: "✨",
  robot_face: "🤖",
  wrench: "🔧",
  hammer_and_wrench: "🛠️",
  bar_chart: "📊",
  chart_with_upwards_trend: "📈",
  chart_with_downwards_trend: "📉",
  white_circle: "⚪",
  black_circle: "⚫",
  exclamation: "❗",
  question: "❓",
  x: "❌",
  point_right: "👉",
};

/** Replace `:shortcode:` tokens with unicode, leaving unknown codes intact. */
export function replaceEmoji(text: string): string {
  return text.replace(/:([a-z0-9_+-]+):/gi, (match, name: string) => EMOJI_MAP[name] ?? match);
}

/** Plain-text Slack fields (`plain_text`) only resolve emoji — never markdown. */
export function plainText(text: string): string {
  return replaceEmoji(text);
}

/* -------------------------------------------------------------------------- */
/*                              Inline formatting                             */
/* -------------------------------------------------------------------------- */

// A fresh regex per call avoids shared `lastIndex` corruption during recursion.
const makeInlineRe = () =>
  /<(https?:\/\/[^>|]+)(?:\|([^>]+))?>|`([^`]+)`|\*([^*\n]+)\*|_([^_\n]+)_|~([^~\n]+)~/g;

/**
 * Parse Slack inline mrkdwn (`*bold*`, `_italic_`, `` `code` ``, `~strike~`,
 * `<url|label>`) into React nodes.
 */
function parseInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = makeInlineRe();
  let lastIndex = 0;
  let token = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const key = `${keyBase}-${token++}`;
    const [, linkUrl, linkLabel, code, bold, italic, strike] = match;

    if (linkUrl !== undefined) {
      nodes.push(
        <a
          key={key}
          href={linkUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary-base font-medium hover:underline'
        >
          {linkLabel ?? linkUrl}
        </a>,
      );
    } else if (code !== undefined) {
      nodes.push(
        <code
          key={key}
          className='bg-bg-weak-50 ring-stroke-soft-200 text-text-strong-950 rounded px-1 py-0.5 font-mono text-[0.85em] ring-1 ring-inset'
        >
          {code}
        </code>,
      );
    } else if (bold !== undefined) {
      nodes.push(
        <strong key={key} className='text-text-strong-950 font-semibold'>
          {parseInline(bold, key)}
        </strong>,
      );
    } else if (italic !== undefined) {
      nodes.push(
        <em key={key} className='italic'>
          {parseInline(italic, key)}
        </em>,
      );
    } else if (strike !== undefined) {
      nodes.push(
        <span key={key} className='text-text-soft-400 line-through'>
          {parseInline(strike, key)}
        </span>,
      );
    }
    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/* -------------------------------------------------------------------------- */
/*                                Code blocks                                 */
/* -------------------------------------------------------------------------- */

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(() => {
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {},
    );
  }, [code]);

  return (
    <div className='border-stroke-soft-200 bg-bg-weak-50 my-2 overflow-hidden rounded-lg border'>
      <div className='border-stroke-soft-200 text-text-soft-400 flex items-center justify-between border-b px-2.5 py-1'>
        <span className='font-mono text-[10px] tracking-wide uppercase'>{lang || "code"}</span>
        <button
          type='button'
          onClick={copy}
          className='hover:text-text-sub-600 inline-flex items-center gap-1 text-[10px] font-medium transition-colors'
        >
          {copied ? <RiCheckLine className='text-success-base size-3' /> : <RiFileCopyLine className='size-3' />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className='text-text-sub-600 text-paragraph-xs overflow-x-auto p-2.5 font-mono leading-relaxed'>
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Block formatting                              */
/* -------------------------------------------------------------------------- */

/** Render a non-code text segment: paragraphs + grouped blockquotes. */
function renderTextSegment(segment: string, keyBase: string): React.ReactNode[] {
  const lines = replaceEmoji(segment).split("\n");
  const out: React.ReactNode[] = [];
  let para: string[] = [];
  let quote: string[] = [];

  const renderLines = (lns: string[], key: string) =>
    lns.map((line, i) => (
      <React.Fragment key={i}>
        {i > 0 && <br />}
        {parseInline(line, `${key}-${i}`)}
      </React.Fragment>
    ));

  const flushPara = () => {
    while (para.length && para[0].trim() === "") para.shift();
    while (para.length && para[para.length - 1].trim() === "") para.pop();
    if (!para.length) return;
    const key = `${keyBase}-p${out.length}`;
    out.push(
      <span key={key} className='block'>
        {renderLines(para, key)}
      </span>,
    );
    para = [];
  };

  const flushQuote = () => {
    if (!quote.length) return;
    const key = `${keyBase}-q${out.length}`;
    out.push(
      <blockquote
        key={key}
        className='border-stroke-soft-200 text-text-sub-600 my-1.5 border-l-2 pl-2.5 italic'
      >
        {renderLines(quote, key)}
      </blockquote>,
    );
    quote = [];
  };

  for (const line of lines) {
    const q = line.match(/^>\s?(.*)$/);
    if (q) {
      flushPara();
      quote.push(q[1]);
    } else {
      flushQuote();
      para.push(line);
    }
  }
  flushPara();
  flushQuote();
  return out;
}

/** Split out fenced code blocks, render the rest as text segments. */
function renderMarkdown(text: string): React.ReactNode[] {
  const segments = text.split(/(```[\s\S]*?```)/g);

  return segments.flatMap((segment, si) => {
    if (!segment) return [];

    if (segment.startsWith("```") && segment.endsWith("```") && segment.length >= 6) {
      const inner = segment.slice(3, -3).replace(/^\n/, "").replace(/\n$/, "");
      const firstNl = inner.indexOf("\n");
      const firstLine = firstNl === -1 ? inner : inner.slice(0, firstNl);
      let lang = "";
      let code = inner;
      if (firstNl !== -1 && /^[a-zA-Z0-9_+-]+$/.test(firstLine)) {
        lang = firstLine;
        code = inner.slice(firstNl + 1);
      }
      return [<CodeBlock key={`code-${si}`} code={code} lang={lang} />];
    }

    return renderTextSegment(segment, `seg${si}`);
  });
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export type MarkdownProps = {
  /** Raw Slack-flavoured markdown text. */
  children: string;
  className?: string;
  /**
   * Inline mode renders into a `<span>` with no block elements (no paragraphs,
   * blockquotes, or code fences) — useful for single-line context rows.
   */
  inline?: boolean;
  /** Polymorphic wrapper element (defaults to `div`, or `span` when inline). */
  as?: React.ElementType;
};

/**
 * Reusable renderer for Slack's mrkdwn dialect. Returns real React nodes so it
 * is safe (no `dangerouslySetInnerHTML`) and composes with the design system.
 */
export function Markdown({ children, className, inline = false, as }: MarkdownProps) {
  const content = React.useMemo(() => {
    if (typeof children !== "string") return null;
    return inline ? parseInline(replaceEmoji(children), "md") : renderMarkdown(children);
  }, [children, inline]);

  const Component = as ?? (inline ? "span" : "div");

  return <Component className={cn(inline ? "[&_a]:break-words" : "space-y-1.5", className)}>{content}</Component>;
}

export default Markdown;
