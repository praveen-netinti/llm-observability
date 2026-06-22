"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { cn } from "@/utils/cn";

import * as Checkbox from "@/components/ui/checkbox";
import * as Table from "@/components/ui/table";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type RenderGroupHeader = (args: {
  groupKey: string;
  count: number;
  collapsed: boolean;
  toggle: () => void;
  index: number;
}) => React.ReactNode;

type GroupBucket<TData> = { key: string | null; rows: Row<TData>[] };

/** Everything the sub-components and call site need, exposed via context. */
export interface DataTableContextValue<TData> {
  table: TanstackTable<TData>;
  /** Rows in display order (excludes collapsed groups) — drives nav/ranges. */
  flatVisibleRows: Row<TData>[];
  groups: GroupBucket<TData>[];
  collapsed: Record<string, boolean>;
  toggleGroup: (key: string) => void;
  focusedIndex: number;
  focusedRowId: string | null;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  toggleRowSelection: (rowId: string, shiftKey: boolean) => void;
  toggleAllVisible: () => void;
  clearSelection: () => void;
  isAllVisibleSelected: boolean;
  isSomeVisibleSelected: boolean;
  selectedRows: TData[];
  selectedCount: number;
  enableKeyboardNav: boolean;
  keyboardScope: "container" | "page";
  onRowActivate?: (row: TData) => void;
}

// Stored as unknown-typed context; useDataTableContext casts back to TData.
const DataTableContext = React.createContext<DataTableContextValue<unknown> | null>(null);

export function useDataTableContext<TData>() {
  const ctx = React.useContext(DataTableContext);
  if (!ctx) throw new Error("DataTable sub-components must be used within <DataTable>");
  return ctx as unknown as DataTableContextValue<TData>;
}

/** Instance returned by `useDataTable` (alias of the context value). */
export type DataTableInstance<TData> = DataTableContextValue<TData>;

/* -------------------------------------------------------------------------- */
/*                                useDataTable                                */
/* -------------------------------------------------------------------------- */

export interface UseDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getRowId: (row: TData) => string;
  initialSorting?: SortingState;
  initialColumnVisibility?: VisibilityState;

  /* manual grouping (kept out of TanStack to preserve full render control) */
  groupBy?: (row: TData) => string;
  groupOrder?: string[];
  showEmptyGroups?: boolean;
  emptyGroupKeys?: string[];

  /* behavior */
  enableKeyboardNav?: boolean;
  /**
   * Where keyboard shortcuts listen:
   * - "container" (default): only when focus is inside the table.
   * - "page": anywhere on the page, except while typing in inputs/editables.
   */
  keyboardScope?: "container" | "page";
  onRowActivate?: (row: TData) => void;
}

/**
 * Owns all table state (sorting, selection, visibility, grouping, keyboard
 * focus) and returns the TanStack table plus a context bundle. Mirrors
 * tablecn's `useDataTable`, extended with manual grouping + range selection.
 */
export function useDataTable<TData>(options: UseDataTableOptions<TData>): DataTableInstance<TData> {
  const {
    data,
    columns,
    getRowId,
    initialSorting = [],
    initialColumnVisibility = {},
    groupBy,
    groupOrder,
    showEmptyGroups = false,
    emptyGroupKeys,
    enableKeyboardNav = true,
    keyboardScope = "container",
    onRowActivate,
  } = options;

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility);
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const anchorRowId = React.useRef<string | null>(null);
  const lastRangeIds = React.useRef<Set<string>>(new Set());

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => getRowId(row),
    state: { sorting, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;

  /* ----------------------------- grouping ------------------------------- */

  const groups = React.useMemo<GroupBucket<TData>[]>(() => {
    if (!groupBy) return [{ key: null, rows }];

    const map = new Map<string, Row<TData>[]>();
    for (const row of rows) {
      const key = groupBy(row.original);
      const bucket = map.get(key);
      if (bucket) bucket.push(row);
      else map.set(key, [row]);
    }

    let keys = groupOrder ? [...groupOrder] : [...map.keys()];
    if (showEmptyGroups && emptyGroupKeys) {
      for (const k of emptyGroupKeys) if (!keys.includes(k)) keys.push(k);
    }
    keys = keys.filter((k) => showEmptyGroups || (map.get(k)?.length ?? 0) > 0);

    return keys.map((key) => ({ key, rows: map.get(key) ?? [] }));
  }, [rows, groupBy, groupOrder, showEmptyGroups, emptyGroupKeys]);

  const flatVisibleRows = React.useMemo(
    () => groups.flatMap((g) => (g.key !== null && collapsed[g.key] ? [] : g.rows)),
    [groups, collapsed],
  );
  const flatVisibleIds = React.useMemo(() => flatVisibleRows.map((r) => r.id), [flatVisibleRows]);

  /* ----------------------------- selection ------------------------------ */

  const toggleRowSelection = React.useCallback(
    (id: string, shiftKey: boolean) => {
      const orderedIds = flatVisibleIds;
      setRowSelection((prev) => {
        const next: RowSelectionState = { ...prev };

        if (shiftKey && anchorRowId.current) {
          const anchorIdx = orderedIds.indexOf(anchorRowId.current);
          const currentIdx = orderedIds.indexOf(id);
          if (anchorIdx >= 0 && currentIdx >= 0) {
            for (const rid of lastRangeIds.current) {
              if (rid !== anchorRowId.current) delete next[rid];
            }
            const start = Math.min(anchorIdx, currentIdx);
            const end = Math.max(anchorIdx, currentIdx);
            const newRange = new Set<string>();
            for (let i = start; i <= end; i++) {
              next[orderedIds[i]] = true;
              newRange.add(orderedIds[i]);
            }
            lastRangeIds.current = newRange;
            return next;
          }
        }

        if (next[id]) delete next[id];
        else next[id] = true;
        anchorRowId.current = id;
        lastRangeIds.current = new Set();
        return next;
      });
    },
    [flatVisibleIds],
  );

  const selectedVisibleCount = flatVisibleIds.filter((id) => rowSelection[id]).length;
  const isAllVisibleSelected =
    flatVisibleIds.length > 0 && selectedVisibleCount === flatVisibleIds.length;
  const isSomeVisibleSelected = selectedVisibleCount > 0 && !isAllVisibleSelected;

  const toggleAllVisible = React.useCallback(() => {
    setRowSelection((prev) => {
      const allSelected = flatVisibleIds.length > 0 && flatVisibleIds.every((id) => prev[id]);
      const next = { ...prev };
      if (allSelected) {
        for (const id of flatVisibleIds) delete next[id];
      } else {
        for (const id of flatVisibleIds) next[id] = true;
      }
      return next;
    });
    anchorRowId.current = null;
    lastRangeIds.current = new Set();
  }, [flatVisibleIds]);

  const clearSelection = React.useCallback(() => {
    setRowSelection({});
    anchorRowId.current = null;
    lastRangeIds.current = new Set();
  }, []);

  const selectedIds = React.useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection],
  );
  const selectedRows = React.useMemo(
    () => rows.filter((r) => rowSelection[r.id]).map((r) => r.original),
    [rows, rowSelection],
  );

  const toggleGroup = React.useCallback(
    (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] })),
    [],
  );

  const focusedRowId = focusedIndex >= 0 ? (flatVisibleIds[focusedIndex] ?? null) : null;

  const value: DataTableInstance<TData> = {
    table,
    flatVisibleRows,
    groups,
    collapsed,
    toggleGroup,
    focusedIndex,
    focusedRowId,
    setFocusedIndex,
    toggleRowSelection,
    toggleAllVisible,
    clearSelection,
    isAllVisibleSelected,
    isSomeVisibleSelected,
    selectedRows,
    selectedCount: selectedIds.length,
    enableKeyboardNav,
    keyboardScope,
    onRowActivate,
  };

  return value;
}

/* -------------------------------------------------------------------------- */
/*                              Select checkbox                               */
/* -------------------------------------------------------------------------- */

/** Reveal-on-hover checkbox used inside the table's select column. */
export function DataTableCheckbox({
  checked,
  onToggle,
  alwaysVisible,
  ariaLabel,
}: {
  checked: boolean | "indeterminate";
  onToggle: (shiftKey: boolean) => void;
  alwaysVisible?: boolean;
  ariaLabel?: string;
}) {
  return (
    <Checkbox.Root
      checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(e.shiftKey);
      }}
      onCheckedChange={() => {}}
      aria-label={ariaLabel ?? "Select row"}
      className={cn(
        "transition-all duration-200 ease-out",
        !alwaysVisible && [
          "opacity-0",
          "group-hover/row:opacity-100",
          "group-data-[selected=true]/row:opacity-100",
          "group-data-[focused=true]/row:opacity-100",
          "focus-visible:opacity-100",
          "hover:opacity-100",
          "scale-95 group-hover/row:scale-100 group-data-[focused=true]/row:scale-100 group-data-[selected=true]/row:scale-100",
        ],
      )}
    />
  );
}

/**
 * Reusable "select" column. Header = select-all over visible rows; each cell
 * toggles its row with shift-range support — all read from context, no
 * `table.options.meta` plumbing required.
 */
export function dataTableSelectColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: function SelectAllHeader() {
      const { isAllVisibleSelected, isSomeVisibleSelected, toggleAllVisible } =
        useDataTableContext<TData>();
      return (
        <DataTableCheckbox
          alwaysVisible={isAllVisibleSelected || isSomeVisibleSelected}
          ariaLabel='Select all'
          checked={isAllVisibleSelected ? true : isSomeVisibleSelected ? "indeterminate" : false}
          onToggle={() => toggleAllVisible()}
        />
      );
    },
    cell: function SelectCell({ row }) {
      const { toggleRowSelection } = useDataTableContext<TData>();
      return (
        <DataTableCheckbox
          checked={row.getIsSelected()}
          onToggle={(shiftKey) => toggleRowSelection(row.id, shiftKey)}
        />
      );
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                            DataTable (provider)                            */
/* -------------------------------------------------------------------------- */

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /** The bundle returned from `useDataTable`. */
  instance: ReturnType<typeof useDataTable<TData>>;
  /** Bottom action bar; shown only when rows are selected. */
  actionBar?: React.ReactNode;
}

function DataTableRoot<TData>({
  instance,
  actionBar,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const {
    flatVisibleRows,
    focusedIndex,
    setFocusedIndex,
    toggleRowSelection,
    toggleAllVisible,
    clearSelection,
    selectedCount,
    enableKeyboardNav,
    keyboardScope,
    onRowActivate,
  } = instance;

  // Keyboard navigation. In "container" scope it only fires when focus is
  // inside the table; in "page" scope it fires anywhere except while typing
  // in form fields / editable elements.
  React.useEffect(() => {
    if (!enableKeyboardNav) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      if (keyboardScope === "container") {
        if (!container.contains(document.activeElement as Node)) return;
      } else {
        // page scope: ignore when the user is typing / interacting with a field
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.isContentEditable ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
            target.closest('[role="menu"],[role="listbox"],[role="dialog"]'))
        ) {
          return;
        }
      }

      const isNav = ["ArrowDown", "ArrowUp"].includes(e.key);
      // cmdk-style: while keyboard-navigating, suppress pointer hover so only
      // the active row is highlighted (cleared on the next real mousemove).
      if (isNav) container.setAttribute("data-keyboard", "true");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((p) => Math.min(p + 1, flatVisibleRows.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((p) => (p < 0 ? flatVisibleRows.length - 1 : Math.max(p - 1, 0)));
      } else if (e.key === "x" || e.key === "X") {
        if (focusedIndex >= 0 && focusedIndex < flatVisibleRows.length) {
          e.preventDefault();
          toggleRowSelection(flatVisibleRows[focusedIndex].id, e.shiftKey);
        }
      } else if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleAllVisible();
      } else if (e.key === "Escape") {
        if (selectedCount > 0) {
          e.preventDefault();
          clearSelection();
        }
      } else if (e.key === "Enter") {
        if (onRowActivate && focusedIndex >= 0 && focusedIndex < flatVisibleRows.length) {
          e.preventDefault();
          onRowActivate(flatVisibleRows[focusedIndex].original);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enableKeyboardNav,
    keyboardScope,
    focusedIndex,
    flatVisibleRows,
    toggleRowSelection,
    toggleAllVisible,
    clearSelection,
    selectedCount,
    onRowActivate,
    setFocusedIndex,
  ]);

  // Leaving keyboard mode on the next real pointer movement.
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = () => container.removeAttribute("data-keyboard");
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Keep the focused row scrolled into view.
  React.useEffect(() => {
    if (focusedIndex < 0) return;
    const id = flatVisibleRows[focusedIndex]?.id;
    if (!id) return;
    containerRef.current
      ?.querySelector(`[data-row-id="${CSS.escape(id)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, flatVisibleRows]);

  return (
    <DataTableContext.Provider value={instance as unknown as DataTableContextValue<unknown>}>
      <div
        ref={containerRef}
        tabIndex={0}
        className={cn(
          "group/table-scroll no-scrollbar relative flex-1 overflow-auto px-2.5 pb-2.5 outline-none",
          className,
        )}
        {...props}
      >
        <Table.Root className='overflow-x-visible'>{children}</Table.Root>
        {actionBar && selectedCount > 0 && (
          <div className='pointer-events-none sticky inset-x-0 bottom-0 z-20 flex justify-center pb-2'>
            <div className='bg-bg-white-0 shadow-custom-md pointer-events-auto flex h-11 items-center gap-2 rounded-full p-2'>
              {actionBar}
            </div>
          </div>
        )}
      </div>
    </DataTableContext.Provider>
  );
}

/* ------------------------------- Header ------------------------------- */

function DataTableHeader<TData>() {
  const { table } = useDataTableContext<TData>();
  return (
    <Table.Header>
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Row key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <Table.Head key={header.id} className='bg-bg-white-0 sticky top-0 z-10'>
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </Table.Head>
          ))}
        </Table.Row>
      ))}
    </Table.Header>
  );
}

/* -------------------------------- Body -------------------------------- */

interface DataTableBodyProps<TData> {
  renderGroupHeader?: RenderGroupHeader;
  cellClassName?: string | ((row: Row<TData>) => string);
  getRowClassName?: (row: Row<TData>) => string;
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  emptyState?: React.ReactNode;
}

function DataTableBody<TData>({
  renderGroupHeader,
  cellClassName,
  getRowClassName,
  onRowClick,
  emptyState,
}: DataTableBodyProps<TData>) {
  const { table, groups, collapsed, toggleGroup, flatVisibleRows, focusedRowId, setFocusedIndex } =
    useDataTableContext<TData>();

  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const rowSelection = table.getState().rowSelection;
  const flatVisibleIds = flatVisibleRows.map((r) => r.id);

  if (table.getRowModel().rows.length === 0 && emptyState) {
    return (
      <Table.Body>
        <tr>
          <td colSpan={visibleColumnCount}>{emptyState}</td>
        </tr>
      </Table.Body>
    );
  }

  return (
    <Table.Body>
      {groups.map((group, groupIndex) => {
        const isGroupCollapsed = group.key !== null && !!collapsed[group.key];
        return (
          <React.Fragment key={group.key ?? "__all__"}>
            {group.key !== null && renderGroupHeader && (
              <tr>
                <td colSpan={visibleColumnCount} className='p-0'>
                  {renderGroupHeader({
                    groupKey: group.key,
                    count: group.rows.length,
                    collapsed: isGroupCollapsed,
                    toggle: () => toggleGroup(group.key as string),
                    index: groupIndex,
                  })}
                </td>
              </tr>
            )}

            {!isGroupCollapsed &&
              group.rows.map((row) => {
                const flatIdx = flatVisibleIds.indexOf(row.id);
                const isSelected = row.getIsSelected();
                const prevSelected = flatIdx > 0 && rowSelection[flatVisibleIds[flatIdx - 1]];
                const nextSelected =
                  flatIdx >= 0 &&
                  flatIdx < flatVisibleIds.length - 1 &&
                  rowSelection[flatVisibleIds[flatIdx + 1]];

                return (
                  <Table.Row
                    key={row.id}
                    data-row-id={row.id}
                    data-selected={isSelected || undefined}
                    data-focused={focusedRowId === row.id || undefined}
                    data-connected-top={(isSelected && prevSelected) || undefined}
                    data-connected-bottom={(isSelected && nextSelected) || undefined}
                    className={cn(onRowClick && "cursor-pointer", getRowClassName?.(row))}
                    onMouseMove={() => {
                      if (focusedRowId !== row.id) setFocusedIndex(flatIdx);
                    }}
                    onClick={(e) => onRowClick?.(row.original, e)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell
                        key={cell.id}
                        className={cn(
                          "group/cell",
                          typeof cellClassName === "function" ? cellClassName(row) : cellClassName,
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                );
              })}
          </React.Fragment>
        );
      })}
    </Table.Body>
  );
}

/* ------------------------------ ActionBar ----------------------------- */

/** Renders bundled count + a divider before consumer-supplied actions. */
function DataTableActionBar<TData>({
  children,
  countLabel,
}: {
  children: React.ReactNode;
  countLabel?: (count: number) => string;
}) {
  const { selectedCount } = useDataTableContext<TData>();
  return (
    <>
      <span className='text-text-strong-950 pl-3 text-xs whitespace-nowrap tabular-nums'>
        {countLabel ? countLabel(selectedCount) : `${selectedCount} selected`}
      </span>
      {children}
    </>
  );
}

/* ------------------------------- exports ------------------------------ */

export const DataTable = Object.assign(DataTableRoot, {
  Header: DataTableHeader,
  Body: DataTableBody,
  ActionBar: DataTableActionBar,
});
