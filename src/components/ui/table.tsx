"use client";

import * as React from "react";
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { CommandPopover } from "../ui/command-popover";
import { motion } from "framer-motion";
import { AlertCircle, ArrowDownNarrowWide, ArrowUpNarrowWide, Loader2, X } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

type TableProps<TData extends Record<string, any>> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  caption?: string;
  className?: string;
  headerAction?: React.ReactNode | React.ReactNode[];
  actionFooter?: React.ReactNode[];
  actionFooterClassName?: string;
  selectedDockActions?: React.ReactNode[];
  onRowSelect?: (client: TData) => void;
  bordered?: "none" | "right" | "full"; // Add this line
  showDeselect?: boolean;
  hideHeader?: boolean;
  forceLight?: boolean;
  selectableRow?: boolean;
  loading?: boolean;
  loadingIndicator?: React.ReactNode;
};



function Table<TData extends Record<string, any>>({ data, columns, caption, className, headerAction, actionFooter, actionFooterClassName, selectedDockActions, onRowSelect, bordered = "right", showDeselect, hideHeader = false, selectableRow = true, forceLight = false, loading, loadingIndicator }: TableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState<string>("");
  const [selectedRow, setSelectedRow] = React.useState<string | null>(null);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    columns.reduce((acc, col) => ({ ...acc, [col.id as string]: true }), {})
  );

// Handle column visibility change
    const toggleColumnVisibility = (columnId: string) => {
      const visibleColumns = Object.values(columnVisibility).filter(Boolean).length;

      // If toggling off the last visible column, prevent the action
      if (visibleColumns === 1 && columnVisibility[columnId]) {
        return;
      }

      setColumnVisibility((prev) => ({
        ...prev,
        [columnId]: !prev[columnId],
      }));
    };

  // Filtered data based on the search query
  const filteredData = React.useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

const getBorderClass = (type: "none" | "right" | "full") => {
  if (type === "full") return "border";
  if (type === "right") return "border-b border-r";
  return ""; // No borders
};

  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-hidden rounded-none",
        className
      )}
    >

    {/* Toolbar Header */}
      {!hideHeader && (
        <div
          data-slot="toolbar-header"
          className={cn(
            "flex justify-between items-center p-3 border-b-zinc-200 rounded-none",
            forceLight ? "bg-white border-b-zinc-200" : "bg-white dark:bg-background dark:border-b-zinc-700",
            getBorderClass(bordered)
          )}
        >
          {/* Button on the top left */}
          {headerAction && (
            <div className="flex-shrink-0">
              {headerAction}
            </div>
          )}

          {/* Search, bordered toggle, and column toggle on the right */}
          <div className="flex gap-4 items-center ml-auto">
            {/* Search Input */}
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />

            {/* Column Toggle Popover */}
            <div className="relative">
              <CommandPopover
                columnVisibility={columnVisibility}
                toggleColumnVisibility={toggleColumnVisibility}
                table={table}
              />
            </div>
          </div>
        </div>
      )}

          <table
        data-slot="table"
        className={cn(
          "w-full text-sm text-left border-collapse border-spacing-0 transition-colors",
          forceLight ? "bg-white text-black" : "bg-background text-foreground",
          className
        )}
      >
        {caption && (
          <caption
            data-slot="table-caption"
            className={cn(
              "py-2 text-base font-semibold",
              forceLight ? "text-gray-500" : "text-muted-foreground"
            )}
          >
            {caption}
          </caption>
        )}
          <thead
          data-slot="table-header"
          className={cn(
            forceLight ? "bg-gray-100 border border-zinc-200" : "bg-background"
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className={cn(
                getBorderClass(bordered)
              )}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  data-slot="table-head"
                  className={cn(
                    "px-10 py-4 text-left font-medium cursor-pointer select-none",
                    forceLight ? "border border-zinc-200" : "border-b"
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" && <ArrowUpNarrowWide className="w-4 h-4" />}
                    {header.column.getIsSorted() === "desc" && <ArrowDownNarrowWide className="w-4 h-4" />}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="rounded-b-sm" data-slot="table-body">
          {loading ? (
          <tr>
            <td
              colSpan={columns.length || 1}
              className={cn(
                "p-6 text-center",
                getBorderClass(bordered),
                forceLight ? "border-zinc-200" : ""
              )}
            >
              {loadingIndicator ?? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
              )}
            </td>
          </tr>
          ) : Object.values(columnVisibility).every((visible) => !visible) ? (
            <tr>
              <td
                colSpan={columns.length || 1}
                className={cn(
                  "p-4 text-center",
                  forceLight ? "text-gray-500 border-t border-zinc-200" : "text-muted-foreground"
                )}
                style={{ height: "150px" }}
              >
                No columns selected
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              const isSelected = selectedRow === row.id;

              return (
                <React.Fragment key={row.id}>
                  <tr
                    className={cn(
                      "transition-colors",
                      selectableRow && "cursor-pointer",
                      forceLight
                        ? isSelected
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                        : ["hover:bg-muted/50", isSelected && "bg-muted/80"]
                    )}
                    onClick={() => {
                      if (!selectableRow) return;
                      if (isSelected) {
                        setSelectedRow(null);
                      } else {
                        setSelectedRow(row.id);
                        if (onRowSelect) {
                          onRowSelect(row.original);
                        }
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <td
                        key={cell.id}
                        data-slot="table-cell"
                        className={cn(
                          "px-10 py-4 text-sm",
                          getBorderClass(bordered),
                          forceLight ? "border-zinc-200" : ""
                        )}
                      >
                        {cellIndex === 0 ? (
                          selectableRow ? (
                            <motion.div
                              initial={false}
                              animate={
                                isSelected
                                  ? { borderLeftColor: "#0ea5e9" }
                                  : { borderLeftColor: "transparent" }
                              }
                              transition={{
                                duration: 0.4,
                                ease: "easeInOut",
                              }}
                              style={{
                                borderLeftWidth: "2px",
                                borderLeftStyle: "solid",
                                paddingLeft: "8px",
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </motion.div>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Inline Action Row (Below Selected Row) */}
                  {isSelected && actionFooter && (
                    <tr className="bg-muted/20">
                      <td
                        colSpan={columns.length}
                        className={cn(
                          "px-10 py-4 border-t border text-sm",
                          getBorderClass(bordered),
                          forceLight ? "bg-gray-50 border-zinc-200" : "border-muted",
                          actionFooterClassName
                        )}
                      >
                        <div className="flex items-center justify-between gap-4 w-full">
                          <div className="flex gap-2 items-center">
                            {actionFooter.map((action, index) =>
                              React.isValidElement(action)
                                ? React.cloneElement(action as React.ReactElement, { key: index })
                                : null
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            onClick={() => setSelectedRow(null)}
                            className="hover:opacity-80 transition rounded-full cursor-pointer"
                            aria-label="Deselect"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>

         {!loading && filteredData.length === 0 && (
          <tfoot
            data-slot="table-footer"
            className={cn(
              forceLight ? "bg-gray-100 border-t border-zinc-200" : "bg-muted/50",
              getBorderClass(bordered)
            )}
          >
            <tr>
              <td colSpan={columns.length} className="p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <AlertCircle
                    className={cn(
                      "w-10 h-10 opacity-60",
                      forceLight ? "text-gray-400" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-base font-light",
                      forceLight ? "text-gray-500" : "text-muted-foreground"
                    )}
                  >
                    No data available
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        )}

      </table>
    
{selectedRow && selectedDockActions && selectedDockActions.length > 0 && (
  <div
    data-slot="selected-row-dock"
    className={cn(
      "flex justify-center items-center bg-muted/50 h-15 gap-2",
      getBorderClass(bordered),
      "pb-1"
    )}
  >
    {selectedDockActions.map((action, index) =>
  React.isValidElement(action)
    ? React.cloneElement(action as React.ReactElement, { key: index })
    : null
)}

    {/* Deselect button with icon + label */}
    {showDeselect && (
  <Button
    key="deselect"
    variant="ghost"
    onClick={() => setSelectedRow(null)}
    className="inline-flex items-center text-sm font-medium text-destructive"
  >
    <X className="w-4 h-4" />
    Deselect
  </Button>
)}

  </div>
)}


    </div>
  );
}

export { Table };
