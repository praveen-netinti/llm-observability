"use client";

import { useIssuesLayout } from "@/app/(main)/issues/layout";
import { IssuesTableView } from "@/components/issues/issues-table-view";
import { IssuesBoardView } from "@/components/issues/issues-board-view";

export default function ActiveIssuesPage() {
  const { display } = useIssuesLayout();
  return display.view === "list" ? <IssuesTableView filter="active" /> : <IssuesBoardView filter="active" />;
}
