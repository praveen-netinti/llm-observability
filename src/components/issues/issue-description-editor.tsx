"use client";

import { useMemo, useRef, useCallback } from "react";
import { Markdown as MarkdownExtension } from "@tiptap/markdown";

import { replaceEmoji } from "@/components/ui/markdown";
import {
  EditorBubbleMenu,
  EditorFormatBold,
  EditorFormatCode,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFormatUnderline,
  EditorLinkSelector,
  EditorProvider,
  type Editor,
} from "@/components/kibo-ui/editor";

/**
 * Convert Slack mrkdwn → CommonMark so the Tiptap Markdown parser handles it.
 * Guarded: transformations skip fenced code blocks and inline code spans.
 */
function slackToCommonMark(text: string): string {
  // Split on fenced code blocks to avoid transforming inside them
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts
    .map((part) => {
      if (part.startsWith("```") && part.endsWith("```")) return part;

      // Protect inline code spans
      const codes: string[] = [];
      let s = part.replace(/`([^`]+)`/g, (m) => {
        codes.push(m);
        return `\x00CODE${codes.length - 1}\x00`;
      });

      // Slack <url|label> → [label](url)
      s = s.replace(/<(https?:\/\/[^>|]+)\|([^>]+)>/g, "[$2]($1)");
      // Slack <url> → <url> (already valid markdown)

      // Slack *bold* → **bold** (only single * not already doubled)
      s = s.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "**$1**");

      // Slack ~strike~ → ~~strike~~
      s = s.replace(/(?<!~)~([^~\n]+)~(?!~)/g, "~~$1~~");

      // Restore code spans
      s = s.replace(/\x00CODE(\d+)\x00/g, (_, i) => codes[Number(i)]);

      return s;
    })
    .join("");
}

type Props = {
  issueId: string;
  description: string;
  onUpdate: (id: string, updates: { description: string }) => void;
};

export default function IssueDescriptionEditor({ issueId, description, onUpdate }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const content = useMemo(() => {
    return slackToCommonMark(replaceEmoji(description || ""));
  }, [description]);

  const handleUpdate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const md = editor.getMarkdown();
        onUpdate(issueId, { description: md });
      }, 500);
    },
    [issueId, onUpdate],
  );

  return (
    <EditorProvider
      className="prose dark:prose-invert prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[120px]"
      content={content}
      contentType="markdown"
      extensions={[MarkdownExtension.configure({ markedOptions: { gfm: true } })]}
      onUpdate={handleUpdate}
      placeholder="Add a description…"
    >
      <EditorBubbleMenu>
        <EditorFormatBold hideName />
        <EditorFormatItalic hideName />
        <EditorFormatUnderline hideName />
        <EditorFormatStrike hideName />
        <EditorFormatCode hideName />
        <EditorLinkSelector />
      </EditorBubbleMenu>
    </EditorProvider>
  );
}
