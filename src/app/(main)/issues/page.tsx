"use client";

import { useState } from "react";

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";

const columns = [
  { id: "col-planned", name: "Planned", color: "#6B7280" },
  { id: "col-in-progress", name: "In Progress", color: "#F59E0B" },
  { id: "col-done", name: "Done", color: "#10B981" },
];

const staticFeatures = [
  { id: "iss-001", name: "Implement user authentication flow", startAt: new Date("2026-03-10"), endAt: new Date("2026-06-15"), column: "col-planned", owner: { id: "u1", name: "Alice Chen" } },
  { id: "iss-002", name: "Add rate limiting to API endpoints", startAt: new Date("2026-04-01"), endAt: new Date("2026-07-01"), column: "col-planned", owner: { id: "u2", name: "Bob Smith" } },
  { id: "iss-003", name: "Optimize database query performance", startAt: new Date("2026-02-15"), endAt: new Date("2026-05-30"), column: "col-in-progress", owner: { id: "u3", name: "Carol Wu" } },
  { id: "iss-004", name: "Set up CI/CD pipeline", startAt: new Date("2026-03-20"), endAt: new Date("2026-06-20"), column: "col-in-progress", owner: { id: "u1", name: "Alice Chen" } },
  { id: "iss-005", name: "Migrate to serverless architecture", startAt: new Date("2026-01-10"), endAt: new Date("2026-04-10"), column: "col-done", owner: { id: "u4", name: "Dan Lee" } },
  { id: "iss-006", name: "Implement webhook notifications", startAt: new Date("2026-02-01"), endAt: new Date("2026-05-01"), column: "col-done", owner: { id: "u2", name: "Bob Smith" } },
  { id: "iss-007", name: "Add multi-tenant support", startAt: new Date("2026-04-15"), endAt: new Date("2026-08-01"), column: "col-planned", owner: { id: "u3", name: "Carol Wu" } },
  { id: "iss-008", name: "Build analytics dashboard", startAt: new Date("2026-03-05"), endAt: new Date("2026-06-25"), column: "col-in-progress", owner: { id: "u4", name: "Dan Lee" } },
];

const shortDateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function IssuesPage() {
  const [features, setFeatures] = useState(staticFeatures);

  return (
    <KanbanProvider columns={columns} data={features} onDataChange={setFeatures}>
      {(column) => (
        <KanbanBoard id={column.id} key={column.id}>
          <KanbanHeader>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full' style={{ backgroundColor: column.color }} />
              <span>{column.name}</span>
            </div>
          </KanbanHeader>
          <KanbanCards id={column.id}>
            {(feature: (typeof features)[number]) => (
              <KanbanCard column={column.id} id={feature.id} key={feature.id} name={feature.name}>
                <div className='flex items-start justify-between gap-2'>
                  <p className='m-0 flex-1 text-sm font-medium'>{feature.name}</p>
                </div>
                <p className='text-text-sub-600 m-0 text-xs'>
                  {shortDateFormatter.format(feature.startAt)} -{" "}
                  {dateFormatter.format(feature.endAt)}
                </p>
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
}
