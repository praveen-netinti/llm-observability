import type { ReactNode } from "react";

export function renderMrkdwn(text: string): ReactNode[] {
  let processed = text
    .replace(/:rotating_light:/g, "🚨")
    .replace(/:white_check_mark:/g, "✅")
    .replace(/:mag:/g, "🔍")
    .replace(/:eyes:/g, "👀")
    .replace(/:warning:/g, "⚠️")
    .replace(/:red_circle:/g, "🔴")
    .replace(/:large_orange_circle:/g, "🟠")
    .replace(/:thumbsdown:/g, "👎")
    .replace(/:clock3:/g, "🕒")
    .replace(/:github:/g, "🐙");

  // Links: <url|label>
  processed = processed.replace(/<(https?:\/\/[^|>]+)\|([^>]+)>/g, "[$2]($1)");
  processed = processed.replace(/<(https?:\/\/[^>]+)>/g, "[$1]($1)");

  // Blockquotes: > text
  processed = processed.replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-stroke-soft-200 pl-2 text-text-soft-400 italic">$1</blockquote>');

  // Code blocks
  const parts = processed.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^[a-z]+\n/, "");
      return (
        <pre
          key={i}
          className='my-2 overflow-x-auto rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-3 font-mono text-paragraph-xs'
        >
          {code}
        </pre>
      );
    }
    const formatted = part
      .replace(/\*([^*]+)\*/g, "<b>$1</b>")
      .replace(/_([^_]+)_/g, "<i>$1</i>")
      .replace(
        /`([^`]+)`/g,
        '<code class="rounded bg-bg-weak-50 px-1 py-0.5 text-paragraph-xs font-mono">$1</code>',
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-primary-base hover:underline" target="_blank" rel="noopener">$1</a>',
      )
      .replace(/\n/g, "<br />");

    return <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
  });
}
