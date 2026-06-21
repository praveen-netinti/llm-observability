"use client";

import { useIssuesLayout } from "@/app/(main)/issues/layout";
import { IssuesTableView } from "@/components/issues/issues-table-view";
import { IssuesBoardView } from "@/components/issues/issues-board-view";

export default function AllIssuesPage() {
  const { display } = useIssuesLayout();
  return display.view === "list" ? <IssuesTableView filter="all" /> : <IssuesBoardView filter="all" />;
}
