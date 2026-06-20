"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { type Issue, type IssueStatus, getNextId, loadIssues, saveIssues } from "@/lib/issues-store";

type IssuesContextType = {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, "id" | "createdAt">) => Issue;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
};

const IssuesContext = createContext<IssuesContextType | null>(null);

export function IssuesProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => { setIssues(loadIssues()); }, []);

  const persist = useCallback((next: Issue[]) => {
    setIssues(next);
    saveIssues(next);
  }, []);

  const addIssue = useCallback((data: Omit<Issue, "id" | "createdAt">) => {
    const current = loadIssues();
    const newIssue: Issue = {
      ...data,
      id: getNextId(current),
      createdAt: new Date().toISOString(),
    };
    persist([newIssue, ...current]);
    return newIssue;
  }, [persist]);

  const updateIssue = useCallback((id: string, updates: Partial<Issue>) => {
    const current = loadIssues();
    persist(current.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, [persist]);

  const deleteIssue = useCallback((id: string) => {
    const current = loadIssues();
    persist(current.filter((i) => i.id !== id));
  }, [persist]);

  return (
    <IssuesContext.Provider value={{ issues, addIssue, updateIssue, deleteIssue }}>
      {children}
    </IssuesContext.Provider>
  );
}

export function useIssues() {
  const ctx = useContext(IssuesContext);
  if (!ctx) throw new Error("useIssues must be used within IssuesProvider");
  return ctx;
}
