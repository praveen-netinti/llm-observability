"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { flatSpans } from "@/lib/flatten-traces";

import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";

export default function TraceDetailSidePanel({ params }: { params: Promise<{ traceId: string }> }) {
  const { traceId } = use(params);
  const router = useRouter();

  const spans = flatSpans.filter((s) => s.traceId === traceId);

  return (
    <>
      <ResizableHandle withHandle />

      <ResizablePanel
        defaultSize='50%'
        maxSize='80%'
        minSize='40%'
        className='h-full'
      ></ResizablePanel>
    </>
  );
}
